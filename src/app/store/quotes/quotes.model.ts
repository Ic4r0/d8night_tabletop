export interface QuotesState {
  list: Array<Quote>;
  filtered: Array<Quote>;
}

export class Quote {
  id: number;
  quote: string;

  static arrayFromREST(obj: any): Array<Quote> {
    return Object.keys(obj)
      .map((idx) =>
        ({
          id: Number(idx),
          quote: obj[idx]
        })
      );
  }
}
