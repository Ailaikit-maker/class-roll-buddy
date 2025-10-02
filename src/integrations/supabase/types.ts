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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          child_id: string | null
          created_at: string
          description: string
          due_date: string
          grade: string | null
          id: string
          instructions: string | null
          title: string
          total_points: number
          updated_at: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          description: string
          due_date: string
          grade?: string | null
          id?: string
          instructions?: string | null
          title: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          description?: string
          due_date?: string
          grade?: string | null
          id?: string
          instructions?: string | null
          title?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          child_id: string
          created_at: string
          date: string
          id: string
          is_present: boolean
          marked_absent_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          date: string
          id?: string
          is_present?: boolean
          marked_absent_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          is_present?: boolean
          marked_absent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          award_name: string
          award_type: string
          awarded_by: string | null
          child_id: string
          created_at: string
          date_received: string
          description: string | null
          id: string
        }
        Insert: {
          award_name: string
          award_type: string
          awarded_by?: string | null
          child_id: string
          created_at?: string
          date_received: string
          description?: string | null
          id?: string
        }
        Update: {
          award_name?: string
          award_type?: string
          awarded_by?: string | null
          child_id?: string
          created_at?: string
          date_received?: string
          description?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "awards_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      disciplinary_records: {
        Row: {
          action_taken: string | null
          child_id: string
          created_at: string
          description: string | null
          id: string
          incident_date: string
          incident_type: string
          severity: string
          updated_at: string
        }
        Insert: {
          action_taken?: string | null
          child_id: string
          created_at?: string
          description?: string | null
          id?: string
          incident_date: string
          incident_type: string
          severity: string
          updated_at?: string
        }
        Update: {
          action_taken?: string | null
          child_id?: string
          created_at?: string
          description?: string | null
          id?: string
          incident_date?: string
          incident_type?: string
          severity?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciplinary_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      escalations: {
        Row: {
          absence_count: number
          child_id: string
          escalated_at: string
          escalation_type: string
          id: string
          period_end: string
          period_start: string
          resolved: boolean
          resolved_at: string | null
        }
        Insert: {
          absence_count: number
          child_id: string
          escalated_at?: string
          escalation_type: string
          id?: string
          period_end: string
          period_start: string
          resolved?: boolean
          resolved_at?: string | null
        }
        Update: {
          absence_count?: number
          child_id?: string
          escalated_at?: string
          escalation_type?: string
          id?: string
          period_end?: string
          period_start?: string
          resolved?: boolean
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      extracurricular_activities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          instructor: string | null
          name: string
          schedule: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          instructor?: string | null
          name: string
          schedule?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          instructor?: string | null
          name?: string
          schedule?: string | null
        }
        Relationships: []
      }
      grading_rubrics: {
        Row: {
          assignment_id: string
          criteria: string
          description: string | null
          id: string
          points: number
        }
        Insert: {
          assignment_id: string
          criteria: string
          description?: string | null
          id?: string
          points: number
        }
        Update: {
          assignment_id?: string
          criteria?: string
          description?: string | null
          id?: string
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "grading_rubrics_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          state: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          state?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          state?: string | null
        }
        Relationships: []
      }
      learner_activities: {
        Row: {
          activity_id: string
          child_id: string
          created_at: string
          enrollment_date: string
          id: string
          status: string
        }
        Insert: {
          activity_id: string
          child_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
        }
        Update: {
          activity_id?: string
          child_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "extracurricular_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learner_activities_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      representatives: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          territory: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          territory?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          territory?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      school_fees: {
        Row: {
          academic_year: string
          amount_paid: number
          child_id: string
          created_at: string
          id: string
          last_payment_date: string | null
          payment_status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          academic_year: string
          amount_paid?: number
          child_id: string
          created_at?: string
          id?: string
          last_payment_date?: string | null
          payment_status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          academic_year?: string
          amount_paid?: number
          child_id?: string
          created_at?: string
          id?: string
          last_payment_date?: string | null
          payment_status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_fees_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          ai_detection_details: Json | null
          ai_usage_detected: boolean | null
          assignment_id: string
          child_id: string
          feedback: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: string
          submission_file_url: string | null
          submission_text: string
          submitted_at: string
        }
        Insert: {
          ai_detection_details?: Json | null
          ai_usage_detected?: boolean | null
          assignment_id: string
          child_id: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          submission_file_url?: string | null
          submission_text: string
          submitted_at?: string
        }
        Update: {
          ai_detection_details?: Json | null
          ai_usage_detected?: boolean | null
          assignment_id?: string
          child_id?: string
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          submission_file_url?: string | null
          submission_text?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      surgeons: {
        Row: {
          contact_email: string | null
          created_at: string
          hospital_id: string | null
          id: string
          name: string
          specialty: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          name: string
          specialty: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          name?: string
          specialty?: string
        }
        Relationships: [
          {
            foreignKeyName: "surgeons_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      surgical_cases: {
        Row: {
          booking_value: number
          case_date: string
          case_number: string
          combine_run_number: string | null
          created_at: string
          hospital_id: string
          id: string
          notes: string | null
          representative_id: string
          sap_invoice_date: string | null
          sap_invoice_value: number | null
          sets_required: number
          status: string
          surgeon_id: string
          surgery_type: string
          updated_at: string
          usage_number: string | null
        }
        Insert: {
          booking_value: number
          case_date: string
          case_number?: string
          combine_run_number?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          notes?: string | null
          representative_id: string
          sap_invoice_date?: string | null
          sap_invoice_value?: number | null
          sets_required?: number
          status?: string
          surgeon_id: string
          surgery_type: string
          updated_at?: string
          usage_number?: string | null
        }
        Update: {
          booking_value?: number
          case_date?: string
          case_number?: string
          combine_run_number?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          notes?: string | null
          representative_id?: string
          sap_invoice_date?: string | null
          sap_invoice_value?: number | null
          sets_required?: number
          status?: string
          surgeon_id?: string
          surgery_type?: string
          updated_at?: string
          usage_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surgical_cases_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surgical_cases_representative_id_fkey"
            columns: ["representative_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surgical_cases_surgeon_id_fkey"
            columns: ["surgeon_id"]
            isOneToOne: false
            referencedRelation: "surgeons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_create_escalations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
