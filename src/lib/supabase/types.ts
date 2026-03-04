export type Category = "ai" | "crypto" | "finance" | "vc";
export type IntensityTag = "WILD" | "HEATED" | "MEH" | "BREAKING";
export type DigestStatus = "pending" | "generating" | "ready" | "failed";

export interface Profile {
  id: string;
  display_name: string | null;
  partner_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  topics: Category[];
  tone: number;
  created_at: string;
  updated_at: string;
}

export interface DailyDigest {
  id: string;
  user_id: string;
  edition_date: string;
  intro_text: string | null;
  status: DigestStatus;
  created_at: string;
}

export interface DigestItem {
  id: string;
  digest_id: string;
  position: number;
  headline: string;
  category: Category;
  intensity_tag: IntensityTag | null;
  summary: string;
  source_url: string;
  source_name: string;
  raw_content: string | null;
  created_at: string;
}

export interface RssSource {
  id: string;
  name: string;
  feed_url: string;
  category: Category;
  is_active: boolean;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserPreferences, "id" | "user_id" | "created_at">>;
      };
      daily_digests: {
        Row: DailyDigest;
        Insert: Omit<DailyDigest, "id" | "created_at">;
        Update: Partial<Omit<DailyDigest, "id" | "user_id" | "created_at">>;
      };
      digest_items: {
        Row: DigestItem;
        Insert: Omit<DigestItem, "id" | "created_at">;
        Update: Partial<Omit<DigestItem, "id" | "digest_id" | "created_at">>;
      };
      rss_sources: {
        Row: RssSource;
        Insert: Omit<RssSource, "id">;
        Update: Partial<Omit<RssSource, "id">>;
      };
    };
  };
}
