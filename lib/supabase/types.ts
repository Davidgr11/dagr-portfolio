export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          subtitle: string;
          description: string;
          badge_text: string;
          profile_image_url: string | null;
          resume_url: string | null;
          email: string;
          linkedin_url: string | null;
          github_url: string | null;
          twitter_url: string | null;
          location: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      about: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          content_en: string;
          content_es: string | null;
        };
        Insert: Omit<Database['public']['Tables']['about']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['about']['Insert']>;
      };
      education: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          level: string;
          degree_en: string;
          degree_es: string | null;
          institution_en: string;
          institution_es: string | null;
          logo_url: string | null;
          start_date: string;
          end_date: string | null;
          gpa: string | null;
          show_gpa: boolean;
          subjects: string[];
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['education']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['education']['Insert']>;
      };
      experience: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          position_en: string;
          position_es: string | null;
          company_en: string;
          company_es: string | null;
          logo_url: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          location: string | null;
          type: 'internship' | 'full-time' | 'freelance' | 'contract';
          description_en: string;
          description_es: string | null;
          responsibilities: string[];
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['experience']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['experience']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          is_featured: boolean;
          title_en: string;
          title_es: string | null;
          description_en: string;
          description_es: string | null;
          image_url: string | null;
          video_url: string | null;
          demo_url: string | null;
          repo_url: string | null;
          technologies: string[];
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      certifications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          name_en: string;
          name_es: string | null;
          description_en: string | null;
          description_es: string | null;
          issuer_en: string;
          issuer_es: string | null;
          logo_url: string | null;
          certificate_url: string | null;
          issue_date: string;
          is_verified: boolean;
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>;
      };
      skills_categories: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          name_en: string;
          name_es: string | null;
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['skills_categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['skills_categories']['Insert']>;
      };
      skills: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          category_id: string;
          order: number;
          name: string;
          logo_url: string | null;
          proficiency: number;
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['skills']['Insert']>;
      };
      awards: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order: number;
          title_en: string;
          title_es: string | null;
          description_en: string | null;
          description_es: string | null;
          issuer_en: string;
          issuer_es: string | null;
          icon_url: string | null;
          certificate_url: string | null;
          date: string;
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['awards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['awards']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
        };
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
        };
      };
      translations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          source_text: string;
          source_lang: string;
          target_lang: string;
          translated_text: string;
        };
        Insert: {
          source_text: string;
          source_lang: string;
          target_lang: string;
          translated_text: string;
        };
        Update: {
          source_text?: string;
          source_lang?: string;
          target_lang?: string;
          translated_text?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
