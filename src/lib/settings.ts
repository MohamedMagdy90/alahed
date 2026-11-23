// Shared (client-safe) settings shapes and defaults.

export type ShareInfo = {
  /**
   * Master switch for everything about the listing on the public website: the header status line, the home page
   * share section, the Investors page and every link to it, the "next chapter" milestone, the investor enquiry
   * type and the securities clauses of the disclaimer. Off until the company is listed.
   */
  visible: boolean;
  status: "pre-listing" | "listed";
  exchange: string;
  ticker: string;
  isin: string;
  currency: string;
  price: number | null;
  change: number | null; // absolute
  changePct: number | null;
  asOf: string | null; // ISO date
  noteEn: string;
  noteAr: string;
};

export const defaultShare: ShareInfo = {
  visible: false,
  status: "pre-listing",
  exchange: "QSE",
  ticker: "",
  isin: "",
  currency: "QAR",
  price: null,
  change: null,
  changePct: null,
  asOf: null,
  noteEn:
    "Al-Ahed Holding is preparing for a proposed listing on the Qatar Stock Exchange. Any offering will be made only in accordance with the rules of the Qatar Financial Markets Authority.",
  noteAr:
    "تستعد العهد القابضة لإدراج مقترح في بورصة قطر. ويتم أي طرح وفقًا لأحكام وقواعد هيئة قطر للأسواق المالية فقط.",
};

export type IrContact = {
  nameEn: string;
  nameAr: string;
  email: string;
  phone: string;
};

export const defaultIrContact: IrContact = {
  nameEn: "Investor Relations Department",
  nameAr: "إدارة علاقات المستثمرين",
  email: "ir@alahedholding.com",
  phone: "+974 4441 4022",
};

export const SETTING_KEYS = { share: "share", irContact: "irContact" } as const;
