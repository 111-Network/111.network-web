/**
 * Database types for admin app, including role tables.
 * 
 * To regenerate these types, run:
 * npx supabase gen types typescript --project-id <your-project-id> > src/lib/types/database.ts
 * 
 * Or use the Supabase CLI:
 * supabase gen types typescript --local > src/lib/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GeoPrecision = 'exact' | 'approx' | 'region';

export interface Database {
  public: {
    Tables: {
      // Existing tables from map app
      anonymous_devices: {
        Row: {
          id: string;
          device_id_hash: string;
          device_public_key: string | null;
          ip_hash: string;
          created_at: string;
          last_post_at: string | null;
          post_count_24h: number;
          post_count_reset_at: string;
        };
        Insert: {
          id?: string;
          device_id_hash: string;
          device_public_key?: string | null;
          ip_hash: string;
          created_at?: string;
          last_post_at?: string | null;
          post_count_24h?: number;
          post_count_reset_at?: string;
        };
        Update: {
          id?: string;
          device_id_hash?: string;
          device_public_key?: string | null;
          ip_hash?: string;
          created_at?: string;
          last_post_at?: string | null;
          post_count_24h?: number;
          post_count_reset_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      broadcast_messages: {
        Row: {
          id: string;
          content: string;
          latitude: number;
          longitude: number;
          geo_precision: GeoPrecision;
          status: 'published' | 'pending';
          device_id: string;
          profile_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          latitude: number;
          longitude: number;
          geo_precision?: GeoPrecision;
          status?: 'published' | 'pending';
          device_id: string;
          profile_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          latitude?: number;
          longitude?: number;
          geo_precision?: GeoPrecision;
          status?: 'published' | 'pending';
          device_id?: string;
          profile_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'broadcast_messages_device_id_fkey';
            columns: ['device_id'];
            referencedRelation: 'anonymous_devices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'broadcast_messages_profile_id_fkey';
            columns: ['profile_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      // Admin role tables
      core_team: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'core_team_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'core_team_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      community_contributors: {
        Row: {
          id: string;
          user_id: string;
          level: number;
          status: 'pending' | 'approved' | 'rejected' | 'suspended';
          created_at: string;
          updated_at: string;
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          level?: number;
          status?: 'pending' | 'approved' | 'rejected' | 'suspended';
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: number;
          status?: 'pending' | 'approved' | 'rejected' | 'suspended';
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'community_contributors_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_contributors_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_contributors_approved_by_fkey';
            columns: ['approved_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_and_increment_rate_limit: {
        Args: {
          p_device_id_hash: string;
          p_ip_hash: string;
          p_rate_limit: number;
        };
        Returns: {
          device_id: string;
          allowed: boolean;
          remaining: number;
        }[];
      };
      reset_rate_limit_counters: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_user_role: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          role_type: string | null;
          level: number | null;
          is_core: boolean;
          status: string | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
