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
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tax_id?: string | null
          plan_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tax_id?: string | null
          plan_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
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
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'super_admin' | 'company_admin' | 'employee' | 'individual_user' | null
          company_id?: string | null
          pin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'super_admin' | 'company_admin' | 'employee' | 'individual_user' | null
          company_id?: string | null
          pin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          amount: number
          currency: string
          status: string
          mp_preference_id: string | null
          mp_payment_id: string | null
          raw_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          amount: number
          currency?: string
          status: string
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          raw_response?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          amount?: number
          currency?: string
          status?: string
          mp_preference_id?: string | null
          mp_payment_id?: string | null
          raw_response?: Json | null
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
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          doctor_id?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
