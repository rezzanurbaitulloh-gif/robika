export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          level: number;
          skill_level: "pemula" | "menengah" | "lanjut";
          xp: number;
          streak: number;
          skin_id: string | null;
          last_active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      wallets: {
        Row: {
          profile_id: string;
          stars: number;
          gems: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wallets"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["wallets"]["Row"]>;
        Relationships: [];
      };
      hints: {
        Row: {
          profile_id: string;
          count: number;
          next_refresh_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["hints"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["hints"]["Row"]>;
        Relationships: [];
      };
      inventory: {
        Row: {
          profile_id: string;
          item_id: string;
          acquired_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inventory"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["inventory"]["Row"]>;
        Relationships: [];
      };
      progress: {
        Row: {
          profile_id: string;
          level_id: string;
          stars: number;
          best_score: number;
          completed_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          profile_id: string;
          item_type: "hints" | "gems" | "mentor";
          item_ref: string | null;
          amount: number;
          price: number;
          status: "pending" | "paid" | "fulfilled" | "failed" | "refunded";
          external_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["purchases"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["purchases"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          profile_id: string;
          plan: "none" | "mentor";
          trial_started_at: string | null;
          trial_ends_at: string | null;
          paid_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          profile_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Relationships: [];
      };
      boss_attempts: {
        Row: {
          profile_id: string;
          attempted_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["boss_attempts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["boss_attempts"]["Row"]>;
        Relationships: [];
      };
      learn_progress: {
        Row: {
          profile_id: string;
          item_type: "module" | "quiz";
          item_id: string;
          completed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["learn_progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["learn_progress"]["Row"]>;
        Relationships: [];
      };
      codelab_progress: {
        Row: {
          profile_id: string;
          challenge_id: string;
          completed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["codelab_progress"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["codelab_progress"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_leaderboard: {
        Args: { limit_rows: number };
        Returns: Array<{
          id: string;
          username: string | null;
          xp: number;
          level: number;
          streak: number;
        }>;
      };
    };
    Enums: Record<string, never>;
  };
};
