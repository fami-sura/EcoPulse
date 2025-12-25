export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      issues: {
        Row: {
          address: string | null;
          category: Database['public']['Enums']['issue_category'];
          created_at: string;
          flagged_reason: string | null;
          id: string;
          is_flagged: boolean;
          lat: number;
          lng: number;
          note: string | null;
          photos: string[];
          session_id: string | null;
          severity: Database['public']['Enums']['issue_severity'];
          status: Database['public']['Enums']['issue_status'];
          updated_at: string;
          user_id: string | null;
          verification_count: number;
        };
        Insert: {
          address?: string | null;
          category: Database['public']['Enums']['issue_category'];
          created_at?: string;
          flagged_reason?: string | null;
          id?: string;
          is_flagged?: boolean;
          lat: number;
          lng: number;
          note?: string | null;
          photos?: string[];
          session_id?: string | null;
          severity: Database['public']['Enums']['issue_severity'];
          status?: Database['public']['Enums']['issue_status'];
          updated_at?: string;
          user_id?: string | null;
          verification_count?: number;
        };
        Update: {
          address?: string | null;
          category?: Database['public']['Enums']['issue_category'];
          created_at?: string;
          flagged_reason?: string | null;
          id?: string;
          is_flagged?: boolean;
          lat?: number;
          lng?: number;
          note?: string | null;
          photos?: string[];
          session_id?: string | null;
          severity?: Database['public']['Enums']['issue_severity'];
          status?: Database['public']['Enums']['issue_status'];
          updated_at?: string;
          user_id?: string | null;
          verification_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'issues_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      points_history: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          issue_id: string | null;
          reason: string;
          user_id: string;
          verification_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          issue_id?: string | null;
          reason: string;
          user_id: string;
          verification_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          issue_id?: string | null;
          reason?: string;
          user_id?: string;
          verification_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'points_history_issue_id_fkey';
            columns: ['issue_id'];
            isOneToOne: false;
            referencedRelation: 'issues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'points_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'points_history_verification_id_fkey';
            columns: ['verification_id'];
            isOneToOne: false;
            referencedRelation: 'verifications';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          anonymous_reports_migrated: boolean;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          email: string | null;
          email_action_cards: boolean | null;
          email_monthly_summary: boolean | null;
          email_verified_reports: boolean | null;
          id: string;
          location: string | null;
          points: number;
          profile_public: boolean | null;
          role: Database['public']['Enums']['user_role'];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          anonymous_reports_migrated?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          email_action_cards?: boolean | null;
          email_monthly_summary?: boolean | null;
          email_verified_reports?: boolean | null;
          id: string;
          location?: string | null;
          points?: number;
          profile_public?: boolean | null;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          anonymous_reports_migrated?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          email_action_cards?: boolean | null;
          email_monthly_summary?: boolean | null;
          email_verified_reports?: boolean | null;
          id?: string;
          location?: string | null;
          points?: number;
          profile_public?: boolean | null;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      verifications: {
        Row: {
          created_at: string;
          id: string;
          is_valid: boolean;
          issue_id: string;
          lat: number | null;
          lng: number | null;
          note: string | null;
          photo_url: string;
          verifier_id: string | null;
          verifier_session_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_valid?: boolean;
          issue_id: string;
          lat?: number | null;
          lng?: number | null;
          note?: string | null;
          photo_url: string;
          verifier_id?: string | null;
          verifier_session_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_valid?: boolean;
          issue_id?: string;
          lat?: number | null;
          lng?: number | null;
          note?: string | null;
          photo_url?: string;
          verifier_id?: string | null;
          verifier_session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'verifications_issue_id_fkey';
            columns: ['issue_id'];
            isOneToOne: false;
            referencedRelation: 'issues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verifications_verifier_id_fkey';
            columns: ['verifier_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      verification_spam_log: {
        Row: {
          created_at: string | null;
          distance_override: boolean | null;
          id: string;
          issue_id: string | null;
          override_clicked: boolean | null;
          override_reason: string | null;
          screenshot_detected: boolean | null;
          similar_photo_detected: boolean | null;
          user_id: string | null;
          verification_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          distance_override?: boolean | null;
          id?: string;
          issue_id?: string | null;
          override_clicked?: boolean | null;
          override_reason?: string | null;
          screenshot_detected?: boolean | null;
          similar_photo_detected?: boolean | null;
          user_id?: string | null;
          verification_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          distance_override?: boolean | null;
          id?: string;
          issue_id?: string | null;
          override_clicked?: boolean | null;
          override_reason?: string | null;
          screenshot_detected?: boolean | null;
          similar_photo_detected?: boolean | null;
          user_id?: string | null;
          verification_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'verification_spam_log_issue_id_fkey';
            columns: ['issue_id'];
            isOneToOne: false;
            referencedRelation: 'issues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verification_spam_log_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verification_spam_log_verification_id_fkey';
            columns: ['verification_id'];
            isOneToOne: false;
            referencedRelation: 'verifications';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      issue_category: 'waste' | 'drainage';
      issue_severity: 'low' | 'medium' | 'high';
      issue_status: 'pending' | 'verified' | 'in_progress' | 'resolved';
      user_role: 'member' | 'ngo_coordinator' | 'government_staff' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      issue_category: ['waste', 'drainage'],
      issue_severity: ['low', 'medium', 'high'],
      issue_status: ['pending', 'verified', 'in_progress', 'resolved'],
      user_role: ['member', 'ngo_coordinator', 'government_staff', 'admin'],
    },
  },
} as const;
