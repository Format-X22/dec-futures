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
    H1 = '1_Hour',
    H8 = '8_Hours',
    D1 = '1_Day',
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
                        <td>Pair</td>
                        <td>${EMarketKey.DYDX} rate %</td>
                        <td>${EMarketKey.PERP} rate %</td>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(funding)
                        .map(
                            ([{ base, quote }, funding]) => `
                        <tr>
                            <td><a href='${base}-${quote}'>${base}-${quote}</a></td>
                            <td>${funding.get(EMarketKey.DYDX) || EMPTY}</td>
                            <td>${funding.get(EMarketKey.PERP) || EMPTY}</td>
                        </tr>
                    `,
                        )
                        .join('')}
                </tbody>
            </table>
            <script>
                setTimeout(() => window.location.reload(), 3000);
            </script>`;
    }

    @Get(':pair')
    async choiceTimeframe(@Param('pair') pair: string): Promise<string> {
        return `
            <title>DeCommas Futures Funding</title>
            <base href='/futures/simple-demo/'/>
            <style>
                li {
                    padding: 5px;
                }
            </style>
            ${HEAD_LOGO}
            <h1>Choice timeframe:</h1>
            <ul>
                <li><a href='${pair}/${ETimeframe.H1}'>${ETimeframe.H1}</a>
                <li><a href='${pair}/${ETimeframe.H8}'>${ETimeframe.H8}</a>
                <li><a href='${pair}/${ETimeframe.D1}'>${ETimeframe.D1}</a>
            </ul>
        `;
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
        let dydxLast30Days = EMPTY;
        let dydxLast90Days = EMPTY;
        let dydxLastMax = EMPTY;

        // Data in db may be incomplete, re-calc is the right way
        if (dydxLastDay === dydxLast7Days) {
            dydxLast7Days = EMPTY;
        } else {
            dydxLast30Days = await dydxCalc(30);

            if (dydxLast7Days === dydxLast30Days) {
                dydxLast30Days = EMPTY;
            } else {
                dydxLast90Days = await dydxCalc(90);

                if (dydxLast30Days === dydxLast90Days) {
                    dydxLast90Days = EMPTY;
                } else {
                    dydxLastMax = await dydxCalc(null);

                    if (dydxLast90Days === dydxLastMax) {
                        dydxLastMax = EMPTY;
                    }
                }
            }
        }

        const perpLastDay = await perpCalc(1);
        let perpLast7Days = await perpCalc(7);
        let perpLast30Days = EMPTY;
        let perpLast90Days = EMPTY;
        let perpLastMax = EMPTY;

        // Data in db may be incomplete, re-calc is the right way
        if (perpLastDay === perpLast7Days) {
            perpLast7Days = EMPTY;
        } else {
            perpLast30Days = await perpCalc(30);

            if (perpLast7Days === perpLast30Days) {
                perpLast30Days = EMPTY;
            } else {
                perpLast90Days = await perpCalc(90);

                if (perpLast30Days === perpLast90Days) {
                    perpLast90Days = EMPTY;
                } else {
                    perpLastMax = await perpCalc(null);

                    if (perpLast90Days === perpLastMax) {
                        perpLastMax = EMPTY;
                    }
                }
            }
        }

        const groupedData = await this.getGroupedHistory(base, quote, timeframe);

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
            <h2>Avg:</h2>
            <table>
                <thead>
                    <tr><td>Time</td><td>DYDX %</td><td>PERP %</td></tr>
                </thead>
                <tbody>                  
                    <tr><td>Last day     </td><td> ${dydxLastDay}    </td><td> ${perpLastDay}    </td></tr>
                    <tr><td>Last 7 days  </td><td> ${dydxLast7Days}  </td><td> ${perpLast7Days}  </td></tr>
                    <tr><td>Last 30 days </td><td> ${dydxLast30Days} </td><td> ${perpLast30Days} </td></tr>
                    <tr><td>Last 90 days </td><td> ${dydxLast90Days} </td><td> ${perpLast90Days} </td></tr>
                    <tr><td>Last MAX     </td><td> ${dydxLastMax}    </td><td> ${perpLastMax}    </td></tr>
                </tbody>
            </table>
            <h2>History group by "${timeframe}" chunks:</h2>
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
            <script>
                setTimeout(() => window.location.reload(), 7000);
            </script>
        `;
    }

    private makeAvgCalculator(base: string, quote: string, marketKey: EMarketKey) {
        return async (daysAgo: number | null): Promise<string> => {
            const filter: FilterQuery<FundingDocument> = { base, quote, marketKey };

            if (daysAgo) {
                filter.payDate = { $gt: moment().subtract(daysAgo, 'day').toDate() };
            }

            const data = await this.fundingModel.find(filter, { rate: true });
            const sum = data.reduce((sum, { rate }) => sum + rate, 0) / data.length;

            return String(sum || EMPTY);
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
                DYDX: String(dydxRate || EMPTY),
                PERP: String(perpRate || EMPTY),
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
}
