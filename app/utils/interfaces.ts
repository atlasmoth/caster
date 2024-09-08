export interface Cast {
  object: "cast";
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string;
  root_parent_url: string;
  parent_author: Author;
  author: User;
  text: string;
  timestamp: string;
  embeds: Embed[];
  reactions: Reactions;
  replies: Replies;
  channel: Channel;
  mentioned_profiles?: Profile[];
}

export interface User {
  object: "user";
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: UserProfile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: "active" | "inactive";
  power_badge: boolean;
}

export interface Author {
  fid: number | null;
}

export interface UserProfile {
  bio: Bio;
}

export interface Bio {
  text: string;
  mentioned_profiles?: Profile[] | null;
}

export interface Profile {
  fid: number;
}

export interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface Embed {
  url: string;
  metadata: EmbedMetadata;
  cast_id?: string | null;
}

export interface EmbedMetadata {
  content_type: string;
  content_length?: string;
  _status: "RESOLVED" | "PENDING";
  video?: VideoMetadata;
  image?: ImageMetadata;
}

export interface VideoMetadata {
  streams: VideoStream[];
  duration_s: number;
}

export interface VideoStream {
  codec_name: string;
  height_px: number;
  width_px: number;
}

export interface ImageMetadata {
  height_px: number;
  width_px: number;
}

export interface Reactions {
  likes_count: number;
  recasts_count: number;
  likes: Like[];
  recasts: any[];
}

export interface Like {
  fid: number;
}

export interface Replies {
  count: number;
}

export interface Channel {
  object?: "channel_dehydrated";
  id?: string;
  name?: string;
  image_url?: string;
  url?: string;
}

export interface Cursor {
  cursor: string;
}

export interface FeedResponse {
  casts: Cast[];
  next?: Cursor;
}
