export interface PortfolioType {
  list: string[];
  detailed: DetailedCoin[];
}

export const defaultPortfolio: PortfolioType = {
  list: [],
  detailed: [],
};

export interface UndetailedCoin {
  id: string;
  name: string;
  symbol: string;
  image: ImageData;
  currentPrice: number;
  marketCap: number;
  ath: number;
  webSlug: string;
  description: string;
  links: CoinLinks;
  genesis_date: string;
  market_cap_rank: number;
  fully_diluted_valuation: string;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  total_supply: number;
  max_supply: number;
  circulating_supply: number;
  sparkline: number[];
}

export interface DetailedCoin {
  id: string;
  name: string;
  amount: string;
  totalValue: number;
  info: {
    symbol: string;
    image: ImageData;
    currentPrice: number;
    marketCap: number;
    ath: number;
    webSlug: string;
    description: string;
    links: CoinLinks;
    genesis_date: string;
    market_cap_rank: number;
    fully_diluted_valuation: string;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
    sparkline: number[];
  };
}

export interface MarketDataCoin {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
  sparkline_in_7d: Sparkline;
}

export interface Sparkline {
  price: number[];
}

export interface ImageData {
  thumb: string;
  sm: string;
  lg: string;
}

export interface CoinLinks {
  homepage: string[];
  whitepaper: string;
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  bitcointalk_thread_identifier: null | string;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

export interface CoinDB {
  id: string;
  amount: number;
  _id: string;
  addedAt: string;
}
