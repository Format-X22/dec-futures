export type Funding = {
    base: string;
    quote: string;
    diff: number;
    rates: {
        [marketKey: string]: number;
    };
};
