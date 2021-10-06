import { Abstract, TOrder, TPairAndPaginationArgs, TPairData, TPosition, TTrade } from '@app/stock/abstract';

export class DyDx extends Abstract {
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
