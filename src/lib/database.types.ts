
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
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          photo_url: string | null
          url_link: string | null
          owner_id: string
          parent_task_id: string | null
          pinned: boolean
          status: string
          assignee_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          photo_url?: string | null
          url_link?: string | null
          owner_id: string
          parent_task_id?: string | null
          pinned?: boolean
          status?: string
          assignee_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          photo_url?: string | null
          url_link?: string | null
          owner_id?: string
          parent_task_id?: string | null
          pinned?: boolean
          status?: string
          assignee_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          pin_hash: string | null
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          pin_hash?: string | null
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          pin_hash?: string | null
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
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
  }
}
