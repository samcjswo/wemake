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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_id: number
          createdAt: string
          description: string
          name: string
          updatedAt: string
        }
        Insert: {
          category_id?: never
          createdAt?: string
          description: string
          name: string
          updatedAt?: string
        }
        Update: {
          category_id?: never
          createdAt?: string
          description?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      community_post_replies: {
        Row: {
          createdAt: string
          parent_reply_id: number | null
          post_id: number | null
          post_reply_id: number
          profile_id: string | null
          reply: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          parent_reply_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id?: string | null
          reply: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          parent_reply_id?: number | null
          post_id?: number | null
          post_reply_id?: never
          profile_id?: string | null
          reply?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_replies_parent_reply_id_community_post_replies_p"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "community_post_replies"
            referencedColumns: ["post_reply_id"]
          },
          {
            foreignKeyName: "community_post_replies_post_id_community_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "community_post_replies_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      community_post_upvotes: {
        Row: {
          createdAt: string
          post_id: number
          profile_id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          post_id: number
          profile_id: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          post_id?: number
          profile_id?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_upvotes_post_id_community_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "community_post_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          createdAt: string
          post_id: number
          profile_id: string | null
          title: string
          topic_id: number | null
          updatedAt: string
        }
        Insert: {
          content: string
          createdAt?: string
          post_id?: never
          profile_id?: string | null
          title: string
          topic_id?: number | null
          updatedAt?: string
        }
        Update: {
          content?: string
          createdAt?: string
          post_id?: never
          profile_id?: string | null
          title?: string
          topic_id?: number | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "community_posts_topic_id_community_topics_topic_id_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      community_topics: {
        Row: {
          createdAt: string
          name: string
          slug: string
          topic_id: number
        }
        Insert: {
          createdAt?: string
          name: string
          slug: string
          topic_id?: never
        }
        Update: {
          createdAt?: string
          name?: string
          slug?: string
          topic_id?: never
        }
        Relationships: []
      }
      follows: {
        Row: {
          createdAt: string
          follower_id: string | null
          following_id: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          follower_id?: string | null
          following_id?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          follower_id?: string | null
          following_id?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      gpt_ideas_likes: {
        Row: {
          idea_id: number
          profile_id: string
        }
        Insert: {
          idea_id: number
          profile_id: string
        }
        Update: {
          idea_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gpt_ideas_likes_idea_id_ideas_id_fk"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpt_ideas_likes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      ideas: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          id: number
          like_count: number
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: number
          like_count?: number
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: number
          like_count?: number
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "ideas_claimed_by_profiles_profile_id_fk"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string | null
          company_logo_url: string
          company_name: string
          created_at: string
          description: string
          id: number
          job_type: string
          location: string
          position_location: string
          requirements: string[]
          responsibilities: string[]
          salary_range: string
          title: string
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          company_logo_url: string
          company_name: string
          created_at?: string
          description: string
          id?: number
          job_type: string
          location: string
          position_location: string
          requirements: string[]
          responsibilities: string[]
          salary_range: string
          title: string
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          company_logo_url?: string
          company_name?: string
          created_at?: string
          description?: string
          id?: number
          job_type?: string
          location?: string
          position_location?: string
          requirements?: string[]
          responsibilities?: string[]
          salary_range?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_room_members: {
        Row: {
          created_at: string
          message_room_id: number | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          message_room_id?: number | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          message_room_id?: number | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_message_room"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      message_rooms: {
        Row: {
          created_at: string
          message_room_id: number
        }
        Insert: {
          created_at?: string
          message_room_id?: never
        }
        Update: {
          created_at?: string
          message_room_id?: never
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          message_id: number
          message_room_id: number | null
          seen_at: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          seen_at?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: never
          message_room_id?: number | null
          seen_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_message_rooms_message_room_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          notification_id: number
          post_id: number | null
          product_id: number | null
          source_id: string | null
          target_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          notification_id?: never
          post_id?: number | null
          product_id?: number | null
          source_id?: string | null
          target_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          notification_id?: never
          post_id?: number | null
          product_id?: number | null
          source_id?: string | null
          target_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_post_id_community_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "notifications_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      product_upvotes: {
        Row: {
          createdAt: string
          product_id: number
          profile_id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          product_id: number
          profile_id: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          product_id?: number
          profile_id?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_upvotes_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          createdAt: string
          description: string
          how_it_works: string
          icon: string
          id: number
          name: string
          profile_id: string | null
          stats: Json
          tagline: string
          updatedAt: string
          url: string
        }
        Insert: {
          category_id?: number | null
          createdAt?: string
          description: string
          how_it_works: string
          icon: string
          id?: never
          name: string
          profile_id?: string | null
          stats?: Json
          tagline: string
          updatedAt?: string
          url: string
        }
        Update: {
          category_id?: number | null
          createdAt?: string
          description?: string
          how_it_works?: string
          icon?: string
          id?: never
          name?: string
          profile_id?: string | null
          stats?: Json
          tagline?: string
          updatedAt?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          createdAt: string
          headline: string | null
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          stats: Json | null
          updatedAt: string
          username: string
          views: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          headline?: string | null
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updatedAt?: string
          username: string
          views?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          createdAt?: string
          headline?: string | null
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updatedAt?: string
          username?: string
          views?: Json | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          createdAt: string
          product_id: number | null
          profile_id: string | null
          rating: number
          review_id: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          product_id?: number | null
          profile_id?: string | null
          rating: number
          review_id?: never
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          product_id?: number | null
          profile_id?: string | null
          rating?: number
          review_id?: never
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          equity_split: number
          product_description: string
          product_name: string
          roles: string
          team_id: number
          team_size: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          equity_split: number
          product_description: string
          product_name: string
          roles: string
          team_id?: never
          team_size: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          equity_split?: number
          product_description?: string
          product_name?: string
          roles?: string
          team_id?: never
          team_size?: number
          updated_at?: string
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
      role:
        | "developer"
        | "founder"
        | "marketer"
        | "product_manager"
        | "designer"
        | "other"
      type: "follow" | "review" | "reply" | "mention"
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
    Enums: {
      role: [
        "developer",
        "founder",
        "marketer",
        "product_manager",
        "designer",
        "other",
      ],
      type: ["follow", "review", "reply", "mention"],
    },
  },
} as const
