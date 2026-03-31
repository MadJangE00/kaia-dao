export interface Proposal {
  id: number;
  groupId: number;
  creator: string;
  title: string;
  description: string;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  deadline: number;
  status: "Active" | "Passed" | "Failed";
  finalized: boolean;
}
