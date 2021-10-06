import { Abstract, TOrder, TPairAndPaginationArgs, TPairData, TPosition, TTrade } from '@app/stock/abstract';
import { DydxClient } from '@dydxprotocol/v3-client';

// Fix Web3 types definition error in commonjs mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

const API = 'https://api.dydx.exchange';

export class DyDx extends Abstract {
    private web3 = new Web3();
    private client: DydxClient;

    constructor() {
        super();

        this.client = new DydxClient(API, { web3: this.web3 });
    }

    public async getCurrentPosition({ base, quote }: TPairData): Promise<TPosition | null> {
        // TODO -
        return null;
    }

    public async getMarkPrice({ base, quote }: TPairData): Promise<number> {
        // TODO -
        return;
    }

    public async getIndexPrice({ base, quote }: TPairData): Promise<number> {
        // TODO -
        return;
    }

    public async getPositionHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TPosition>> {
        // TODO -
        return [];
    }

    public async getOrderHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TOrder>> {
        // TODO -
        return [];
    }

    public async getTradeHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TTrade>> {
        // TODO -
        return [];
    }
}
