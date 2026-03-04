export type Category = "ai" | "crypto" | "finance" | "vc";
export type IntensityTag = "WILD" | "HEATED" | "MEH" | "BREAKING";

export interface StoryItem {
  id: string;
  position: number;
  headline: string;
  category: Category;
  intensityTag: IntensityTag;
  summary: string;
  sourceUrl: string;
  sourceName: string;
}

export interface DailyDigest {
  editionDate: string;
  introText: string;
  stories: StoryItem[];
}

export const CATEGORY_META: Record<
  Category,
  { label: string; colorClass: string; dotClass: string }
> = {
  ai: {
    label: "AI",
    colorClass: "bg-cat-ai/15 text-cat-ai",
    dotClass: "bg-cat-ai",
  },
  crypto: {
    label: "CRYPTO",
    colorClass: "bg-cat-crypto/15 text-cat-crypto",
    dotClass: "bg-cat-crypto",
  },
  finance: {
    label: "FINANCE",
    colorClass: "bg-cat-finance/15 text-cat-finance",
    dotClass: "bg-cat-finance",
  },
  vc: {
    label: "VC",
    colorClass: "bg-cat-vc/15 text-cat-vc",
    dotClass: "bg-cat-vc",
  },
};

export const INTENSITY_META: Record<IntensityTag, { label: string; colorClass: string }> = {
  WILD: { label: "WILD", colorClass: "text-amber-400" },
  HEATED: { label: "HEATED", colorClass: "text-red-400" },
  MEH: { label: "MEH", colorClass: "text-muted" },
  BREAKING: { label: "BREAKING", colorClass: "text-rose-400" },
};

export const mockDigests: Record<string, DailyDigest> = {
  "2026-03-04": {
    editionDate: "2026-03-04",
    introText:
      "Hi love — if it felt like I was glued to my phone today, it's because the AI world decided to have a complete meltdown, crypto did its usual roller-coaster thing, and some VC drama unfolded that was honestly more entertaining than anything on Netflix.",
    stories: [
      {
        id: "1",
        position: 1,
        headline: "OpenAI Just Released a Model That Can Actually Reason Through Math Proofs",
        category: "ai",
        intensityTag: "WILD",
        summary:
          "So OpenAI dropped a new AI model that can solve college-level math problems by actually working through the logic step-by-step, not just pattern-matching. Think of it like the difference between a kid who memorized multiplication tables versus one who actually understands what multiplication means. The internet is losing it because this is a genuine leap, not just a slightly better chatbot.",
        sourceUrl: "https://techcrunch.com",
        sourceName: "TechCrunch",
      },
      {
        id: "2",
        position: 2,
        headline: "Bitcoin Blasts Past $150K as ETF Inflows Hit Record Highs",
        category: "crypto",
        intensityTag: "HEATED",
        summary:
          "Bitcoin smashed through $150,000 today because massive Wall Street investment funds keep pouring money into Bitcoin ETFs — basically, normal retirement-fund-type money is now flowing into crypto. Your partner probably checked their portfolio 47 times today. The mood in crypto Twitter is somewhere between 'told you so' and 'should I quit my job.'",
        sourceUrl: "https://coindesk.com",
        sourceName: "CoinDesk",
      },
      {
        id: "3",
        position: 3,
        headline: "The Fed Signals It Might Actually Cut Rates This Summer",
        category: "finance",
        intensityTag: "BREAKING",
        summary:
          "The Federal Reserve (the people who control interest rates) hinted they might lower borrowing costs this summer. Translation: mortgages, car loans, and credit cards could get cheaper. Stocks went up because investors love cheap money like your partner loves checking their brokerage app at dinner.",
        sourceUrl: "https://bloomberg.com",
        sourceName: "Bloomberg",
      },
      {
        id: "4",
        position: 4,
        headline: "Andreessen Horowitz Leads $400M Round for an AI Startup Nobody's Heard Of",
        category: "vc",
        intensityTag: "WILD",
        summary:
          "The biggest venture capital firm in Silicon Valley just poured $400 million into an AI company that's been in stealth mode (fancy talk for 'secret') for two years. Nobody really knows what they do, but the investors are calling it 'transformative,' which is VC-speak for 'we hope this prints money.' Your partner is definitely going to bring this up at dinner.",
        sourceUrl: "https://techcrunch.com",
        sourceName: "TechCrunch",
      },
      {
        id: "5",
        position: 5,
        headline: "Ethereum's Big Upgrade Just Made Transactions 10x Cheaper",
        category: "crypto",
        intensityTag: "HEATED",
        summary:
          "Ethereum (Bitcoin's younger, more complicated sibling) just rolled out a technical upgrade that slashed transaction fees dramatically. If Bitcoin is digital gold, Ethereum is more like the plumbing that runs a ton of crypto apps. Cheaper fees means more people will actually use it, which is why your partner was fist-pumping at their laptop.",
        sourceUrl: "https://coindesk.com",
        sourceName: "CoinDesk",
      },
      {
        id: "6",
        position: 6,
        headline: "Google DeepMind's New AI Can Design Drugs in Hours Instead of Years",
        category: "ai",
        intensityTag: "BREAKING",
        summary:
          "Google's AI lab built a system that can design potential new medicines in a few hours — a process that normally takes pharmaceutical companies years and billions of dollars. It's not magic; the AI predicts how molecules will interact with your body. This is genuinely exciting and also terrifying if you think about it too hard.",
        sourceUrl: "https://wired.com",
        sourceName: "Wired",
      },
    ],
  },
  "2026-03-03": {
    editionDate: "2026-03-03",
    introText:
      "Hey there — your partner's screen time was definitely above average today, and honestly, fair enough. It was a big news day in the corners of the internet they inhabit. Here's what had them glued to their phone.",
    stories: [
      {
        id: "7",
        position: 1,
        headline: "Apple Just Announced Its Own AI Chip That Doesn't Need the Cloud",
        category: "ai",
        intensityTag: "WILD",
        summary:
          "Apple revealed a new chip that can run advanced AI directly on your iPhone without sending your data to some distant server. This matters because it means Siri might finally stop being embarrassing, and your photos, messages, and voice stay on your device. Privacy people are thrilled. Google is nervous.",
        sourceUrl: "https://theverge.com",
        sourceName: "The Verge",
      },
      {
        id: "8",
        position: 2,
        headline: "Solana Goes Down Again, Crypto Twitter Erupts",
        category: "crypto",
        intensityTag: "HEATED",
        summary:
          "Solana, which is like the fast-and-cheap alternative to Ethereum, crashed for the fourth time this year. Imagine if Venmo just stopped working for six hours — that's basically what happened. Solana fans say it'll be fine. Everyone else is posting memes. Your partner is probably in the meme camp.",
        sourceUrl: "https://coindesk.com",
        sourceName: "CoinDesk",
      },
      {
        id: "9",
        position: 3,
        headline: "SaaS Valuations Are Bouncing Back After Two Years of Pain",
        category: "finance",
        intensityTag: "MEH",
        summary:
          "Software companies that sell monthly subscriptions (SaaS) are finally seeing their stock prices recover after getting hammered since 2024. If your partner works in tech or invests in tech stocks, this is their version of their favorite team making the playoffs again. Cautious optimism is the vibe.",
        sourceUrl: "https://bloomberg.com",
        sourceName: "Bloomberg",
      },
      {
        id: "10",
        position: 4,
        headline: "Sequoia Capital Splits Into Three Separate Firms",
        category: "vc",
        intensityTag: "BREAKING",
        summary:
          "Sequoia, basically the Beyoncé of venture capital firms, announced it's splitting into three independent companies — one for the US, one for China, and one for India. It's like a corporate divorce, but with billions of dollars. The gossip in Silicon Valley is absolutely unhinged right now.",
        sourceUrl: "https://techcrunch.com",
        sourceName: "TechCrunch",
      },
    ],
  },
};

export function getDigestForDate(dateStr: string): DailyDigest | null {
  return mockDigests[dateStr] ?? null;
}

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAdjacentDate(dateStr: string, direction: "prev" | "next"): string {
  const date = new Date(dateStr + "T12:00:00");
  date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
  return date.toISOString().split("T")[0];
}
