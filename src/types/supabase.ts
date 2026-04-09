export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          tax_id: string | null
          plan_type: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          tax_id?: string | null
          plan_type?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          tax_id?: string | null
          plan_type?: string | null
          status?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'super_admin' | 'company_admin' | 'employee' | 'individual_user' | null
          company_id: string | null
          pin: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'super_admin' | 'company_admin' | 'employee' | 'individual_user' | null
          company_id?: string | null
          pin?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'super_admin' | 'company_admin' | 'employee' | 'individual_user' | null
          company_id?: string | null
          pin?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          company_id: string | null
          status: string | null
          mp_preference_id: string | null
          next_billing: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          status?: string | null
          mp_preference_id?: string | null
          next_billing?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          status?: string | null
          mp_preference_id?: string | null
          next_billing?: string | null
          created_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string | null
          doctor_id: string | null
          company_id: string | null
          content: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string
        }
      }
    }
  }
}
