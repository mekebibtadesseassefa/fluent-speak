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
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_bookings: {
        Row: {
          agenda_submitted_at: string | null
          agenda_text: string | null
          attended: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          class_id: string
          created_at: string
          deducted: boolean
          id: string
          student_id: string
          teacher_notes: string | null
        }
        Insert: {
          agenda_submitted_at?: string | null
          agenda_text?: string | null
          attended?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          class_id: string
          created_at?: string
          deducted?: boolean
          id?: string
          student_id: string
          teacher_notes?: string | null
        }
        Update: {
          agenda_submitted_at?: string | null
          agenda_text?: string | null
          attended?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          class_id?: string
          created_at?: string
          deducted?: boolean
          id?: string
          student_id?: string
          teacher_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          availability_slot_id: string | null
          capacity: number
          content_item_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          language: string
          scheduled_at: string
          status: string
          teacher_id: string
          type: string
          updated_at: string
        }
        Insert: {
          availability_slot_id?: string | null
          capacity?: number
          content_item_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          language: string
          scheduled_at: string
          status?: string
          teacher_id: string
          type: string
          updated_at?: string
        }
        Update: {
          availability_slot_id?: string | null
          capacity?: number
          content_item_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          language?: string
          scheduled_at?: string
          status?: string
          teacher_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_availability_slot_id_fkey"
            columns: ["availability_slot_id"]
            isOneToOne: false
            referencedRelation: "teacher_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          allow_individual_upgrades: boolean
          billing_email: string | null
          cnpj: string | null
          created_at: string
          employee_limit: number
          id: string
          join_code: string | null
          language_restriction: string[] | null
          name: string
          plan_type: string
          status: string
          updated_at: string
        }
        Insert: {
          allow_individual_upgrades?: boolean
          billing_email?: string | null
          cnpj?: string | null
          created_at?: string
          employee_limit?: number
          id?: string
          join_code?: string | null
          language_restriction?: string[] | null
          name: string
          plan_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          allow_individual_upgrades?: boolean
          billing_email?: string | null
          cnpj?: string | null
          created_at?: string
          employee_limit?: number
          id?: string
          join_code?: string | null
          language_restriction?: string[] | null
          name?: string
          plan_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_employees: {
        Row: {
          active: boolean
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          exit_date: string | null
          id: string
          user_id: string
          verified_year: number | null
        }
        Insert: {
          active?: boolean
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          exit_date?: string | null
          id?: string
          user_id: string
          verified_year?: number | null
        }
        Update: {
          active?: boolean
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          exit_date?: string | null
          id?: string
          user_id?: string
          verified_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_employees_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_frameworks: {
        Row: {
          active: boolean
          api_config: Json | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
          source_type: string | null
        }
        Insert: {
          active?: boolean
          api_config?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          source_type?: string | null
        }
        Update: {
          active?: boolean
          api_config?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          source_type?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          curator_id: string | null
          duration_seconds: number | null
          embed_url: string | null
          framework_id: string | null
          id: string
          language: string
          level_max: string
          level_min: string
          perspective: string | null
          published_week: number | null
          published_year: number | null
          source_url: string | null
          status: string
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          topic_tags: string[] | null
          transcript_text: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          curator_id?: string | null
          duration_seconds?: number | null
          embed_url?: string | null
          framework_id?: string | null
          id?: string
          language?: string
          level_max?: string
          level_min?: string
          perspective?: string | null
          published_week?: number | null
          published_year?: number | null
          source_url?: string | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          topic_tags?: string[] | null
          transcript_text?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          curator_id?: string | null
          duration_seconds?: number | null
          embed_url?: string | null
          framework_id?: string | null
          id?: string
          language?: string
          level_max?: string
          level_min?: string
          perspective?: string | null
          published_week?: number | null
          published_year?: number | null
          source_url?: string | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          topic_tags?: string[] | null
          transcript_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_curator_id_fkey"
            columns: ["curator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "content_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      methodology_phases: {
        Row: {
          applies_to: string
          created_at: string
          default_duration_minutes: number
          id: string
          level_adaptations: Json | null
          name: string
          sort_order: number
          student_instruction: string | null
          teacher_prompt: string | null
          version_id: string
        }
        Insert: {
          applies_to?: string
          created_at?: string
          default_duration_minutes?: number
          id?: string
          level_adaptations?: Json | null
          name: string
          sort_order?: number
          student_instruction?: string | null
          teacher_prompt?: string | null
          version_id: string
        }
        Update: {
          applies_to?: string
          created_at?: string
          default_duration_minutes?: number
          id?: string
          level_adaptations?: Json | null
          name?: string
          sort_order?: number
          student_instruction?: string | null
          teacher_prompt?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "methodology_phases_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "methodology_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      methodology_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          published_at: string | null
          status: string
          version_number: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: string
          version_number: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          published_at?: string | null
          status?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "methodology_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_brl: number
          created_at: string
          id: string
          nfe_number: string | null
          paid_at: string | null
          payment_method: string
          pix_qr_code: string | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          amount_brl: number
          created_at?: string
          id?: string
          nfe_number?: string | null
          paid_at?: string | null
          payment_method?: string
          pix_qr_code?: string | null
          status?: string
          subscription_id?: string | null
        }
        Update: {
          amount_brl?: number
          created_at?: string
          id?: string
          nfe_number?: string | null
          paid_at?: string | null
          payment_method?: string
          pix_qr_code?: string | null
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          cpf: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      session_reflections: {
        Row: {
          class_id: string
          confidence_score: number | null
          created_at: string
          expression_saved: string | null
          id: string
          reflection_text: string | null
          user_id: string
        }
        Insert: {
          class_id: string
          confidence_score?: number | null
          created_at?: string
          expression_saved?: string | null
          id?: string
          reflection_text?: string | null
          user_id: string
        }
        Update: {
          class_id?: string
          confidence_score?: number | null
          created_at?: string
          expression_saved?: string | null
          id?: string
          reflection_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reflections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_preferences: {
        Row: {
          baseline_confidence: number | null
          content_streams: string[] | null
          created_at: string
          languages: string[] | null
          learning_goal: string | null
          onboarding_complete: boolean
          user_id: string
        }
        Insert: {
          baseline_confidence?: number | null
          content_streams?: string[] | null
          created_at?: string
          languages?: string[] | null
          learning_goal?: string | null
          onboarding_complete?: boolean
          user_id: string
        }
        Update: {
          baseline_confidence?: number | null
          content_streams?: string[] | null
          created_at?: string
          languages?: string[] | null
          learning_goal?: string | null
          onboarding_complete?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          created_at: string
          features: Json | null
          hours_per_week: number
          id: string
          name: string
          plan_type: string
          price_brl: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: Json | null
          hours_per_week?: number
          id?: string
          name: string
          plan_type: string
          price_brl: number
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: Json | null
          hours_per_week?: number
          id?: string
          name?: string
          plan_type?: string
          price_brl?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          company_id: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          hours_per_week: number
          id: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          company_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          hours_per_week?: number
          id?: string
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          company_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          hours_per_week?: number
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_availability: {
        Row: {
          available: boolean
          created_at: string
          current_bookings: number
          end_time: string
          id: string
          max_students: number
          slot_date: string
          start_time: string
          teacher_id: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          current_bookings?: number
          end_time: string
          id?: string
          max_students?: number
          slot_date: string
          start_time: string
          teacher_id: string
        }
        Update: {
          available?: boolean
          created_at?: string
          current_bookings?: number
          end_time?: string
          id?: string
          max_students?: number
          slot_date?: string
          start_time?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_payouts: {
        Row: {
          created_at: string
          gross_amount: number
          id: string
          net_amount: number
          nfe_number: string | null
          paid_at: string | null
          period_end: string
          period_start: string
          platform_fee: number
          status: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          nfe_number?: string | null
          paid_at?: string | null
          period_end: string
          period_start: string
          platform_fee?: number
          status?: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          nfe_number?: string | null
          paid_at?: string | null
          period_end?: string
          period_start?: string
          platform_fee?: number
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_payouts_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          active: boolean
          bio: string | null
          country_of_origin: string | null
          created_at: string
          current_city: string | null
          hourly_rate_group: number | null
          hourly_rate_private: number | null
          id: string
          languages_spoken: string[]
          languages_taught: string[]
          max_weekly_load: number
          mei_cnpj: string | null
          onboarding_complete: boolean
          pix_key: string | null
          specializations: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string | null
          country_of_origin?: string | null
          created_at?: string
          current_city?: string | null
          hourly_rate_group?: number | null
          hourly_rate_private?: number | null
          id: string
          languages_spoken?: string[]
          languages_taught?: string[]
          max_weekly_load?: number
          mei_cnpj?: string | null
          onboarding_complete?: boolean
          pix_key?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string | null
          country_of_origin?: string | null
          created_at?: string
          current_city?: string | null
          hourly_rate_group?: number | null
          hourly_rate_private?: number | null
          id?: string
          languages_spoken?: string[]
          languages_taught?: string[]
          max_weekly_load?: number
          mei_cnpj?: string | null
          onboarding_complete?: boolean
          pix_key?: string | null
          specializations?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_saves: {
        Row: {
          content_id: string | null
          context_sentence: string | null
          id: string
          saved_at: string
          user_id: string
          word: string
        }
        Insert: {
          content_id?: string | null
          context_sentence?: string | null
          id?: string
          saved_at?: string
          user_id: string
          word: string
        }
        Update: {
          content_id?: string | null
          context_sentence?: string | null
          id?: string
          saved_at?: string
          user_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_saves_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocabulary_saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_class_usage: {
        Row: {
          classes_allowed: number
          classes_used: number
          user_id: string
          week_start: string
        }
        Insert: {
          classes_allowed?: number
          classes_used?: number
          user_id: string
          week_start: string
        }
        Update: {
          classes_allowed?: number
          classes_used?: number
          user_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_class_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_any_admin: { Args: { _user_id: string }; Returns: boolean }
      is_company_hr_of: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      is_company_member: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "sub_admin_ops"
        | "sub_admin_finance"
        | "sub_admin_content"
        | "pedagogical_lead"
        | "content_curator"
        | "teacher"
        | "student"
        | "company_hr"
        | "company_finance"
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
      app_role: [
        "super_admin",
        "sub_admin_ops",
        "sub_admin_finance",
        "sub_admin_content",
        "pedagogical_lead",
        "content_curator",
        "teacher",
        "student",
        "company_hr",
        "company_finance",
      ],
    },
  },
} as const
