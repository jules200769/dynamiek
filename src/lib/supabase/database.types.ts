export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'owner' | 'student';
          full_name: string;
          email: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: 'owner' | 'student';
          full_name?: string;
          email?: string;
          phone?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>>;
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          status: 'Actief' | 'Gepauzeerd' | 'Afgerond';
          full_name: string;
          address: string;
          city: string;
          postal_code: string;
          date_of_birth: string | null;
          phone: string;
          email: string;
          cbr_number: string;
          theory_certificate_number: string;
          health_declaration_status: 'Ingediend' | 'Goedgekeurd' | 'Ontbreekt' | 'In behandeling';
          license_category: 'B' | 'BE' | 'A' | 'AM';
          training_start_date: string | null;
          internal_note: string | null;
          updated_at: string;
          version: number;
        };
        Insert: Partial<Database['public']['Tables']['students']['Row']>;
        Update: Partial<Database['public']['Tables']['students']['Row']>;
      };
      package_infos: {
        Row: {
          student_id: string;
          package_name: string;
          total_minutes: number;
          used_minutes: number;
          extra_minutes: number;
          open_balance: number;
          next_installment_date: string | null;
        };
        Insert: Partial<Database['public']['Tables']['package_infos']['Row']>;
        Update: Partial<Database['public']['Tables']['package_infos']['Row']>;
      };
      availability_slots: {
        Row: {
          id: string;
          student_id: string;
          start_at: string;
          end_at: string;
          instructor: string;
          car: string;
          location: string;
        };
        Insert: Partial<Database['public']['Tables']['availability_slots']['Row']>;
        Update: Partial<Database['public']['Tables']['availability_slots']['Row']>;
      };
      lessons: {
        Row: {
          id: string;
          student_id: string;
          start_at: string;
          end_at: string;
          duration_minutes: number;
          pickup_location: string;
          dropoff_location: string;
          instructor: string;
          car: string;
          lesson_type: 'Praktijkles' | 'Toetsles' | 'Examentraining';
          status: 'Gepland' | 'Bevestigd' | 'Voltooid' | 'Geannuleerd' | 'Wachtlijst';
          notes: string | null;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['lessons']['Row']>;
        Update: Partial<Database['public']['Tables']['lessons']['Row']>;
      };
      documents: {
        Row: {
          id: string;
          student_id: string;
          type: 'ID' | 'Theoriecertificaat';
          file_name: string | null;
          uploaded_at: string | null;
          status: 'idle' | 'uploading' | 'uploaded' | 'rejected' | 'replace';
          rejection_reason: string | null;
        };
        Insert: Partial<Database['public']['Tables']['documents']['Row']>;
        Update: Partial<Database['public']['Tables']['documents']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          student_id: string;
          invoice_number: string;
          period: string;
          amount: number;
          due_date: string;
          status: 'Betaald' | 'Openstaand' | 'Verlopen' | 'In behandeling';
          download_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['invoices']['Row']>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      progress_items: {
        Row: {
          id: string;
          student_id: string;
          skill: string;
          level: 'Beginner' | 'Voldoende' | 'Goed' | 'Examenklaar';
          trend: 'stijgend' | 'stabiel' | 'dalend';
          updated_at: string;
          note: string;
        };
        Insert: Partial<Database['public']['Tables']['progress_items']['Row']>;
        Update: Partial<Database['public']['Tables']['progress_items']['Row']>;
      };
      checklist_items: {
        Row: {
          id: string;
          student_id: string;
          requirement: string;
          status: 'Voltooid' | 'In behandeling' | 'Blokkerend';
          blocker: string | null;
          advice: string | null;
        };
        Insert: Partial<Database['public']['Tables']['checklist_items']['Row']>;
        Update: Partial<Database['public']['Tables']['checklist_items']['Row']>;
      };
      message_threads: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          type: 'Algemeen' | 'Planning' | 'Betaling' | 'Voortgang' | 'Systeem';
          priority: 'Normaal' | 'Belangrijk';
          unread_count: number;
          pinned: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['message_threads']['Row']>;
        Update: Partial<Database['public']['Tables']['message_threads']['Row']>;
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender: 'Leerling' | 'Rijschool';
          body: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['messages']['Row']>;
        Update: Partial<Database['public']['Tables']['messages']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          body: string;
          created_at: string;
          read: boolean;
          kind: 'Algemeen' | 'Planning' | 'Betaling' | 'Voortgang' | 'Systeem';
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      reminder_settings: {
        Row: {
          student_id: string;
          email: boolean;
          sms: boolean;
          push: boolean;
          calendar_sync: boolean;
        };
        Insert: Partial<Database['public']['Tables']['reminder_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['reminder_settings']['Row']>;
      };
      booking_preferences: {
        Row: {
          student_id: string;
          preferred_time_windows: string[];
          preferred_location: string;
          preferred_instructor: string | null;
          waitlist_enabled: boolean;
        };
        Insert: Partial<Database['public']['Tables']['booking_preferences']['Row']>;
        Update: Partial<Database['public']['Tables']['booking_preferences']['Row']>;
      };
      calendar_sync_state: {
        Row: {
          id: boolean;
          connected: boolean;
          last_sync_at: string | null;
          status: 'Actief' | 'Niet gekoppeld' | 'Storing';
          pending_items: number;
          external_calendar_name: string;
        };
        Insert: Partial<Database['public']['Tables']['calendar_sync_state']['Row']>;
        Update: Partial<Database['public']['Tables']['calendar_sync_state']['Row']>;
      };
      school_alerts: {
        Row: {
          id: string;
          title: string;
          description: string;
          severity: 'info' | 'warning' | 'critical';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['school_alerts']['Row']>;
        Update: Partial<Database['public']['Tables']['school_alerts']['Row']>;
      };
      sync_events: {
        Row: {
          id: string;
          student_id: string | null;
          entity: 'lesson' | 'invoice' | 'progress' | 'document' | 'calendar' | 'profile';
          action: 'create' | 'update' | 'delete';
          updated_at: string;
          version: number;
        };
        Insert: Partial<Database['public']['Tables']['sync_events']['Row']>;
        Update: Partial<Database['public']['Tables']['sync_events']['Row']>;
      };
      payment_attempts: {
        Row: {
          id: string;
          student_id: string;
          product_id: string;
          label: string;
          amount: number;
          payment_method: 'iDEAL' | 'Kaart';
          status: 'pending' | 'succeeded' | 'failed';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['payment_attempts']['Row']>;
        Update: Partial<Database['public']['Tables']['payment_attempts']['Row']>;
      };
      school_settings: {
        Row: {
          id: string;
          school_name: string;
          school_timezone: string;
          instructors: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['school_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['school_settings']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_student_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
