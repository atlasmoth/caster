export interface Author {
  object: "user";
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles: any[];
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  active_status: string;
}

export interface Reaction {
  likes: any[];
  recasts: any[];
}

export interface Replies {
  count: number;
}

export interface Cast {
  object: "cast_hydrated";
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  parent_author: {
    fid: number | null;
  };
  author: Author;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: Reaction;
  replies: Replies;
  mentioned_profiles: any[];
  main: boolean;
}
