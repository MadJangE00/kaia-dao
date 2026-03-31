export interface Group {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  owner_wallet: string;
  chain_group_id: number | null;
  created_at: string;
  member_count?: number;
}

export interface GroupMember {
  group_id: string;
  wallet_address: string;
  joined_at: string;
}
