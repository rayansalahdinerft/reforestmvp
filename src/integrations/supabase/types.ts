export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          badge_description: string | null
          badge_name: string
          badge_type: string
          earned_at: string
          id: string
          wallet_address: string
        }
        Insert: {
          badge_description?: string | null
          badge_name: string
          badge_type: string
          earned_at?: string
          id?: string
          wallet_address: string
        }
        Update: {
          badge_description?: string | null
          badge_name?: string
          badge_type?: string
          earned_at?: string
          id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      swap_history: {
        Row: {
          buy_amount: string
          buy_token: string
          chain_id: number
          created_at: string
          donation_usd: number
          id: string
          sell_amount: string
          sell_token: string
          status: string
          trees_planted: number
          tx_hash: string
          wallet_address: string
        }
        Insert: {
          buy_amount: string
          buy_token: string
          chain_id?: number
          created_at?: string
          donation_usd?: number
          id?: string
          sell_amount: string
          sell_token: string
          status?: string
          trees_planted?: number
          tx_hash: string
          wallet_address: string
        }
        Update: {
          buy_amount?: string
          buy_token?: string
          chain_id?: number
          created_at?: string
          donation_usd?: number
          id?: string
          sell_amount?: string
          sell_token?: string
          status?: string
          trees_planted?: number
          tx_hash?: string
          wallet_address?: string
        }
        Relationships: []
      }
      tree_counter: {
        Row: {
          id: string
          total_donations_usd: number
          total_swaps: number
          total_trees: number
          updated_at: string
        }
        Insert: {
          id?: string
          total_donations_usd?: number
          total_swaps?: number
          total_trees?: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_donations_usd?: number
          total_swaps?: number
          total_trees?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          dynamic_user_id: string
          first_name: string
          id: string
          onboarding_completed: boolean
          pseudo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dynamic_user_id: string
          first_name: string
          id?: string
          onboarding_completed?: boolean
          pseudo: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dynamic_user_id?: string
          first_name?: string
          id?: string
          onboarding_completed?: boolean
          pseudo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          chain: string
          created_at: string
          id: string
          is_primary: boolean
          profile_id: string
          wallet_address: string
          wallet_name: string
          wallet_type: string
        }
        Insert: {
          chain?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          profile_id: string
          wallet_address: string
          wallet_name?: string
          wallet_type?: string
        }
        Update: {
          chain?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          profile_id?: string
          wallet_address?: string
          wallet_name?: string
          wallet_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_stats: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak: number
          display_name: string | null
          id: string
          last_swap_date: string | null
          longest_streak: number
          total_donations_usd: number
          total_swaps: number
          total_trees: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          last_swap_date?: string | null
          longest_streak?: number
          total_donations_usd?: number
          total_swaps?: number
          total_trees?: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          last_swap_date?: string | null
          longest_streak?: number
          total_donations_usd?: number
          total_swaps?: number
          total_trees?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string
          id: string
          token_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          token_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          token_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
