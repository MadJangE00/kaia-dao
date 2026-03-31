export interface Market {
  id: number;
  creator: string;
  question: string;
  options: string[];
  deadline: number;
  totalPool: bigint;
  winningOption: number;
  resolved: boolean;
}

export interface Bet {
  marketId: number;
  bettor: string;
  optionIndex: number;
  amount: bigint;
}
