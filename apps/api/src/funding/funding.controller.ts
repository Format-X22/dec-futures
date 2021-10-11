import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Funding, FundingDocument } from '@app/shared/funding.schema';
import { FilterQuery, Model } from 'mongoose';
import { EMarketKey } from '@app/shared/entity.enum';
import * as moment from 'moment';

type TPair = { base: string; quote: string };
type TFunding = Map<EMarketKey, number>;

enum TTimeframe {
    H1 = '1_Hour',
    H8 = '8_Hours',
    D1 = '1_Day',
}

@Controller('/')
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
            <style>
                td {
                    padding: 3px 10px;
                    border: 1px solid gainsboro;
                }
            </style>
            <h1>Next funding</h1>
            <table>
                <thead>
                    <tr>
                        <td>Pair</td>
                        <td>${EMarketKey.DYDX} rate</td>
                        <td>${EMarketKey.PERP} rate</td>
                    </tr>
                </thead>
                <tbody>
                    ${Array.from(funding)
                        .map(
                            ([{ base, quote }, funding]) => `
                        <tr>
                            <td><a href='${base}-${quote}'>${base}-${quote}</a></td>
                            <td>${funding.get(EMarketKey.DYDX) || '---'}</td>
                            <td>${funding.get(EMarketKey.PERP) || '---'}</td>
                        </tr>
                    `,
                        )
                        .join('')}
                </tbody>
            </table>`;
    }

    @Get(':pair')
    async choiceTimeframe(@Param('pair') pair: string): Promise<string> {
        return `
            <style>
                li {
                    padding: 5px;
                }
            </style>
            <h1>Choice timeframe:</h1>
            <ul>
                <li><a href='${pair}/${TTimeframe.H1}'>${TTimeframe.H1}</a>
                <li><a href='${pair}/${TTimeframe.H8}'>${TTimeframe.H8}</a>
                <li><a href='${pair}/${TTimeframe.H1}'>${TTimeframe.D1}</a>
            </ul>
        `;
    }

    @Get(':pair/:timeframe')
    async getHistory(@Param('pair') pairString: string, @Param('timeframe') timeframe: string): Promise<string> {
        const [base, quote] = pairString.split('-');
        const dydxCalc = this.makeAvgCalculator(base, quote, EMarketKey.DYDX);
        const perpCalc = this.makeAvgCalculator(base, quote, EMarketKey.PERP);

        const dydxLastDay = await dydxCalc(1);
        const dydxLast7Days = await dydxCalc(7);
        const dydxLast30Days = await dydxCalc(30);
        const dydxLast90Days = await dydxCalc(90);
        const dydxLastMax = await dydxCalc(null);

        const perpLastDay = await perpCalc(1);
        const perpLast7Days = await perpCalc(1);
        const perpLast30Days = await perpCalc(1);
        const perpLast90Days = await perpCalc(1);
        const perpLastMax = await perpCalc(null);

        return `
            <style>
                td {
                    padding: 3px 10px;
                    border: 1px solid gainsboro;
                }
            </style>
            <h1>Statistics</h1>
            <h2>Avg:</h2>
            <table>
                <thead>
                    <tr><td>Time</td><td>DYDX</td><td>PERP</td></tr>
                </thead>
                <tbody>                  
                    <tr><td>Last day     </td><td> ${dydxLastDay}    </td><td> ${perpLastDay}    </td></tr>
                    <tr><td>Last 7 days  </td><td> ${dydxLast7Days}  </td><td> ${perpLast7Days}  </td></tr>
                    <tr><td>Last 30 days </td><td> ${dydxLast30Days} </td><td> ${perpLast30Days} </td></tr>
                    <tr><td>Last 90 days </td><td> ${dydxLast90Days} </td><td> ${perpLast90Days} </td></tr>
                    <tr><td>Last MAX     </td><td> ${dydxLastMax}    </td><td> ${perpLastMax}    </td></tr>
                </tbody>
            </table>
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

            return String(sum || '---');
        };
    }
}
