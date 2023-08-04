export interface MarketInfo {
  id: string;
  label: string;
  inputMint: string;
  outputMint: string;
  notEnoughLiquidity: boolean;
  inAmount: string;
  outAmount: string;
  minInAmount?: string | null;
  minOutAmount?: string | null;
  priceImpactPct: number;
  lpFee: {
    amount: string;
    mint: string;
    pct: number;
  };
  platformFee: {
    amount: string;
    mint: string;
    pct: number;
  };
}

export interface Fees {
  description?: string;
  signatureFee: number;
  openOrdersDeposits: number[];
  ataDeposits: number[];
  totalFeeAndDeposits: number;
  minimumSOLForTransaction: number;
}

export interface Route {
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  marketInfos: MarketInfo[];
  amount: string;
  slippageBps: number;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  fees?: Fees | null;
}