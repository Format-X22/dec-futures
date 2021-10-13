import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Funding, FundingDocument } from '@app/shared/funding.schema';
import { FilterQuery, Model } from 'mongoose';
import { EMarketKey } from '@app/shared/entity.enum';
import * as moment from 'moment';
import * as lodash from 'lodash';

type TPair = { base: string; quote: string };
type TFunding = Map<EMarketKey, number>;
type TGroupedHistory = Array<{ time: string; DYDX: string; PERP: string }>;

enum ETimeframe {
    CHOOSE = 'CHOOSE',
    H1 = '1 hour',
    H8 = '8 hours',
    D1 = '1 day',
}

const EMPTY = '---';
const HEAD_LOGO = `
    <div style='margin-top: 14px'>
        <img src='https://decommas.io/icons/logo.svg' alt='DeCommas' width='25'/>
        <div style='display: inline-block; height: 25px; vertical-align: top; margin: 4px 0 0 5px'>DeCommas</div>
        <hr>
    </div>`;

@Controller('/futures/simple-demo')
export class FundingController {
    constructor(@InjectModel(Funding.name) private fundingModel: Model<FundingDocument>) {}

    @Get('')
    async getCurrentFundingData(): Promise<string> {
        const quotes: Array<string> = await this.fundingModel.distinct('quote');
        const pairs: Array<TPair> = [];
        const funding: Map<TPair, TFunding> = new Map();

        for (const quote of quotes) {
            const bases: Array<string> = await this.fundingModel.distinct('base', { quote });

            for (const base of bases) {
                pairs.push({ base, quote });
            }
        }

        for (const pair of pairs) {
            for (const marketKeyString of Object.keys(EMarketKey)) {
                const marketKey = marketKeyString as EMarketKey;
                const fundingData: { rate: number } = await this.fundingModel.findOne(
                    {
                        ...pair,
                        marketKey: marketKey as EMarketKey,
                    },
                    { rate: true },
                    { sort: { payDate: -1 } },
                );

                if (fundingData) {
                    funding.set(pair, funding.get(pair) || new Map());
                    funding.get(pair).set(marketKey, fundingData.rate);
                }
            }
        }

        return `
            <title>DeCommas Futures Funding</title>
            <base href='/futures/simple-demo/'/>
            <style>
                td {
                    padding: 3px 10px;
                    border: 1px solid gainsboro;
                }
            </style>
            ${HEAD_LOGO}
            <h1>Next funding</h1>
            <table>
                <thead>
                    <tr>
                        <td rowspan='2'>Pair</td>
                        <td colspan='3'>${EMarketKey.DYDX} rate %</td>
                        <td colspan='3'>${EMarketKey.PERP} rate %</td>
                    </tr>
                    <tr>
                        <td>1 hour</td>
                        <td>8 hours</td>
                        <td>Annual</td>
                        <td>1 hour</td>
                        <td>8 hours</td>
                        <td>Annual</td>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(funding)
                        .map(([{ base, quote }, funding]) => {
                            const dydxFunding = funding.get(EMarketKey.DYDX) || 0;
                            const perpFunding = funding.get(EMarketKey.PERP) || 0;

                            return `
                                <tr>
                                    <td><a href='${base}-${quote}/${ETimeframe.CHOOSE}'>${base}-${quote}</a></td>
                                    <td>${this.formatFunding(dydxFunding)}</td>
                                    <td>${this.formatFunding(dydxFunding * 8)}</td>
                                    <td>${this.formatFunding(dydxFunding * 24 * 356)}</td>
                                    <td>${this.formatFunding(perpFunding)}</td>
                                    <td>${this.formatFunding(perpFunding * 8)}</td>
                                    <td>${this.formatFunding(perpFunding * 8 * 356)}</td>
                                </tr>
                    `;
                        })
                        .join('')}
                </tbody>
            </table>
            <script>
                setTimeout(() => window.location.reload(), 3000);
            </script>`;
    }

    @Get(':pair/:timeframe')
    async getHistory(@Param('pair') pairString: string, @Param('timeframe') timeframe: ETimeframe): Promise<string> {
        try {
            const data = pairString.split('-');

            if (data.length !== 2 || !data[0] || !data[1]) {
                return 'Invalid pair';
            }
        } catch (e) {
            return 'Invalid pair';
        }

        if (!Object.values(ETimeframe).includes(timeframe)) {
            return 'Invalid timeframe';
        }

        const [base, quote] = pairString.split('-');
        const dydxCalc = this.makeAvgCalculator(base, quote, EMarketKey.DYDX);
        const perpCalc = this.makeAvgCalculator(base, quote, EMarketKey.PERP);

        const dydxLastDay = await dydxCalc(1);
        let dydxLast7Days = await dydxCalc(7);
        let dydxLast30Days = 0;
        let dydxLast90Days = 0;
        let dydxLastMax = 0;

        // Data in db may be incomplete, re-calc is the right way
        if (dydxLastDay === dydxLast7Days) {
            dydxLast7Days = 0;
        } else {
            dydxLast30Days = await dydxCalc(30);

            if (dydxLast7Days === dydxLast30Days) {
                dydxLast30Days = 0;
            } else {
                dydxLast90Days = await dydxCalc(90);

                if (dydxLast30Days === dydxLast90Days) {
                    dydxLast90Days = 0;
                } else {
                    dydxLastMax = await dydxCalc(null);

                    if (dydxLast90Days === dydxLastMax) {
                        dydxLastMax = 0;
                    }
                }
            }
        }

        const perpLastDay = await perpCalc(1);
        let perpLast7Days = await perpCalc(7);
        let perpLast30Days = 0;
        let perpLast90Days = 0;
        let perpLastMax = 0;

        // Data in db may be incomplete, re-calc is the right way
        if (perpLastDay === perpLast7Days) {
            perpLast7Days = 0;
        } else {
            perpLast30Days = await perpCalc(30);

            if (perpLast7Days === perpLast30Days) {
                perpLast30Days = 0;
            } else {
                perpLast90Days = await perpCalc(90);

                if (perpLast30Days === perpLast90Days) {
                    perpLast90Days = 0;
                } else {
                    perpLastMax = await perpCalc(null);

                    if (perpLast90Days === perpLastMax) {
                        perpLastMax = 0;
                    }
                }
            }
        }

        return `
            <title>DeCommas Futures Funding</title>
            <base href='/futures/simple-demo/'/>
            <style>
                td {
                    padding: 3px 10px;
                    border: 1px solid gainsboro;
                }
            </style>
            ${HEAD_LOGO}
            <h1>Statistics</h1>
            <a href=''>&lt;-- back to pair list</a>
            <h2>Avg:</h2>
            <table>
                <thead>
                    <tr>
                        <td rowspan='2'>Time</td>
                        <td colspan='3'>DYDX %</td>
                        <td colspan='3'>PERP %</td>
                    </tr>
                    <tr>
                        <td>In 1 hour</td>
                        <td>In 8 hours</td>
                        <td>In annual</td>
                        <td>In 1 hour</td>
                        <td>In 8 hours</td>
                        <td>In annual</td>
                    </tr>
                </thead>
                <tbody>                  
                    <tr>
                        <td>Last day</td>
                        <td>${this.formatFunding(dydxLastDay)}</td>
                        <td>${this.formatFunding(dydxLastDay * 8)}</td>
                        <td>${this.formatFunding(dydxLastDay * 24 * 365)}</td>
                        <td>${this.formatFunding(perpLastDay)}</td>
                        <td>${this.formatFunding(perpLastDay * 8)}</td>
                        <td>${this.formatFunding(perpLastDay * 24 * 365)}</td>
                    </tr>
                    <tr>
                        <td>Last 7 days</td>
                        <td>${this.formatFunding(dydxLast7Days)}</td>
                        <td>${this.formatFunding(dydxLast7Days * 8)}</td>
                        <td>${this.formatFunding(dydxLast7Days * 24 * 365)}</td>
                        <td>${this.formatFunding(perpLast7Days)}</td>
                        <td>${this.formatFunding(perpLast7Days * 8)}</td>
                        <td>${this.formatFunding(perpLast7Days * 24 * 365)}</td>
                    </tr>
                    <tr>
                        <td>Last 30 days</td>
                        <td>${this.formatFunding(dydxLast30Days)}</td>
                        <td>${this.formatFunding(dydxLast30Days * 8)}</td>
                        <td>${this.formatFunding(dydxLast30Days * 24 * 365)}</td>
                        <td>${this.formatFunding(perpLast30Days)}</td>
                        <td>${this.formatFunding(perpLast30Days * 8)}</td>
                        <td>${this.formatFunding(perpLast30Days * 24 * 365)}</td>
                    </tr>
                    <tr>
                        <td>Last 90 days</td>
                        <td>${this.formatFunding(dydxLast90Days)}</td>
                        <td>${this.formatFunding(dydxLast90Days * 8)}</td>
                        <td>${this.formatFunding(dydxLast90Days * 24 * 365)}</td>
                        <td>${this.formatFunding(perpLast90Days)}</td>
                        <td>${this.formatFunding(perpLast90Days * 8)}</td>
                        <td>${this.formatFunding(perpLast90Days * 24 * 365)}</td>
                    </tr>
                    <tr>
                        <td>Last MAX</td>
                        <td>${this.formatFunding(dydxLastMax)}</td>
                        <td>${this.formatFunding(dydxLastMax * 8)}</td>
                        <td>${this.formatFunding(dydxLastMax * 24 * 365)}</td>
                        <td>${this.formatFunding(perpLastMax)}</td>
                        <td>${this.formatFunding(perpLastMax * 8)}</td>
                        <td>${this.formatFunding(perpLastMax * 24 * 365)}</td>
                    </tr>
                </tbody>
            </table>
            <h2>History${timeframe !== ETimeframe.CHOOSE ? `group by "${timeframe}" chunks` : ''}:</h2>
            ${this.makeChooseTimeframeFragment(pairString, timeframe)}
            ${timeframe !== ETimeframe.CHOOSE ? await this.makeHistoryFragment(base, quote, timeframe) : ''}
            <script>
                setTimeout(() => window.location.reload(), 7000);
            </script>
        `;
    }

    private makeChooseTimeframeFragment(pairString: string, timeframe: ETimeframe): string {
        return `
            <style>
                .current-timeframe {
                    background-color: #ecebeb;
                }
            </style>
            <h4>Timeframe:</h4>
            <table>
                <tbody>
                    <tr>
                        <td class='${timeframe === ETimeframe.H1 ? 'current-timeframe' : ''}'>
                            <a href='${pairString}/${ETimeframe.H1}'>${ETimeframe.H1}</a> 
                        </td>
                        <td class='${timeframe === ETimeframe.H8 ? 'current-timeframe' : ''}'>
                            <a href='${pairString}/${ETimeframe.H8}'>${ETimeframe.H8}</a>
                        </td>
                        <td class='${timeframe === ETimeframe.D1 ? 'current-timeframe' : ''}'>
                            <a href='${pairString}/${ETimeframe.D1}'>${ETimeframe.D1}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    private async makeHistoryFragment(base, quote, timeframe): Promise<string> {
        const groupedData = await this.getGroupedHistory(base, quote, timeframe);

        return `
            <table>
                <thead>
                    <tr><td>Time</td><td>DYDX %</td><td>PERP %</td></tr>
                </thead>
                <tbody>
                    ${groupedData
                        .map(
                            (rowData) =>
                                `<tr>
                                    <td>${rowData.time}</td>
                                    <td>${rowData.DYDX}</td>
                                    <td>${rowData.PERP}</td>
                                </tr>`,
                        )
                        .join('')}
                </tbody>
            </table>
        `;
    }

    private makeAvgCalculator(base: string, quote: string, marketKey: EMarketKey) {
        return async (daysAgo: number | null): Promise<number> => {
            const filter: FilterQuery<FundingDocument> = { base, quote, marketKey };

            if (daysAgo) {
                filter.payDate = { $gt: moment().subtract(daysAgo, 'day').toDate() };
            }

            const data = await this.fundingModel.find(filter, { rate: true });
            const sum = data.reduce((sum, { rate }) => sum + rate, 0) / data.length;

            return sum || 0;
        };
    }

    // TODO Warning - pack only 1 hours based funding
    private async getGroupedHistory(base: string, quote: string, timeframe: ETimeframe): Promise<TGroupedHistory> {
        const dydxData = await this.fundingModel.find({ base, quote, marketKey: EMarketKey.DYDX }, { rate: true });
        const dydxGrouped = this.packByTimeframe(timeframe, dydxData);
        const perpData = await this.fundingModel.find({ base, quote, marketKey: EMarketKey.PERP }, { rate: true });
        const perpGrouped = this.packByTimeframe(timeframe, perpData);
        const maxHistoryLength = Math.max(dydxGrouped.length, perpGrouped.length);
        const result: TGroupedHistory = [];
        let currentMoment = moment().startOf('hour');

        for (let i = 0; i < maxHistoryLength; i++) {
            const dydxRate = dydxGrouped[i];
            const perpRate = perpGrouped[i];
            const time = currentMoment.format('YYYY MMM DD HH:mm (Z)');

            result.push({
                time,
                DYDX: String((dydxRate && dydxRate.toFixed(4)) || EMPTY),
                PERP: String((perpRate && perpRate.toFixed(4)) || EMPTY),
            });

            switch (timeframe) {
                case ETimeframe.H1:
                    currentMoment = currentMoment.subtract(1, 'hour');
                    break;

                case ETimeframe.H8:
                    currentMoment = currentMoment.subtract(8, 'hours');
                    break;

                case ETimeframe.D1:
                    currentMoment = currentMoment.subtract(1, 'day');
                    break;
            }
        }

        return result;
    }

    private packByTimeframe(timeframe: ETimeframe, data: Array<Pick<Funding, 'rate'>>): Array<number> {
        let chunkSize: number;

        switch (timeframe) {
            case ETimeframe.H1:
                chunkSize = 1;
                break;

            case ETimeframe.H8:
                chunkSize = 8;
                break;

            case ETimeframe.D1:
                chunkSize = 24;
                break;
        }

        return lodash
            .chunk<Pick<Funding, 'rate'>>(data, chunkSize)
            .map((chunk) => chunk.reduce((sum, { rate }) => sum + rate, 0));
    }

    private formatFunding(value: number | undefined | null): string {
        value = Number(value);

        if (Number.isFinite(value) && value) {
            return value.toFixed(4);
        }

        return EMPTY;
    }
}
