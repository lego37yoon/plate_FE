export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dictionary: {
        Row: {
          approved: boolean
          id: number
          lang_code: string
          origin: string
          result: string
        }
        Insert: {
          approved: boolean
          id?: number
          lang_code: string
          origin: string
          result: string
        }
        Update: {
          approved?: boolean
          id?: number
          lang_code?: string
          origin?: string
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictionary_lang_code_fkey"
            columns: ["lang_code"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      docs: {
        Row: {
          for: string
          id: number
          lang: string | null
          related: number
          src: string
          title: string
        }
        Insert: {
          for: string
          id?: number
          lang?: string | null
          related: number
          src: string
          title: string
        }
        Update: {
          for?: string
          id?: number
          lang?: string | null
          related?: number
          src?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "docs_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "docs_related_fkey"
            columns: ["related"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "docs_related_fkey1"
            columns: ["related"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          id: number
          last_updated: string
          name: string
          project_id: number
          src: string
        }
        Insert: {
          id?: number
          last_updated?: string
          name: string
          project_id: number
          src: string
        }
        Update: {
          id?: number
          last_updated?: string
          name?: string
          project_id?: number
          src?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lang_codes: {
        Row: {
          code: string
          eng_name: string
          origin_name: string
        }
        Insert: {
          code?: string
          eng_name: string
          origin_name: string
        }
        Update: {
          code?: string
          eng_name?: string
          origin_name?: string
        }
        Relationships: []
      }
      langs: {
        Row: {
          code: string
          created_at: string
          id: number
          manager: number | null
          project_id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          manager?: number | null
          project_id: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          manager?: number | null
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "langs_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "langs_manager_fkey"
            columns: ["manager"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "langs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          default_lang: string
          desc: string | null
          id: number
          last_updated: string
          manager: number
          name: string
          version: string | null
        }
        Insert: {
          default_lang: string
          desc?: string | null
          id?: number
          last_updated?: string
          manager: number
          name: string
          version?: string | null
        }
        Update: {
          default_lang?: string
          desc?: string | null
          id?: number
          last_updated?: string
          manager?: number
          name?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_manager_fkey"
            columns: ["manager"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string | null
          context: string | null
          file_id: number
          group_idx: number | null
          id: number
          last_updated: string
          origin: string
          parent_id: number | null
        }
        Insert: {
          category?: string | null
          context?: string | null
          file_id: number
          group_idx?: number | null
          id?: number
          last_updated?: string
          origin: string
          parent_id?: number | null
        }
        Update: {
          category?: string | null
          context?: string | null
          file_id?: number
          group_idx?: number | null
          id?: number
          last_updated?: string
          origin?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          approved: boolean
          author: number | null
          id: number
          lang_code: string | null
          last_updated: string
          origin_id: number | null
          result: string
        }
        Insert: {
          approved: boolean
          author?: number | null
          id?: number
          lang_code?: string | null
          last_updated?: string
          origin_id?: number | null
          result: string
        }
        Update: {
          approved?: boolean
          author?: number | null
          id?: number
          lang_code?: string | null
          last_updated?: string
          origin_id?: number | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_lang_code_fkey"
            columns: ["lang_code"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "results_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
        Row: {
          category: number
          from: number | null
          global: boolean
          id: number
          lang_code: string | null
          type: number
        }
        Insert: {
          category: number
          from?: number | null
          global: boolean
          id?: number
          lang_code?: string | null
          type: number
        }
        Update: {
          category?: number
          from?: number | null
          global?: boolean
          id?: number
          lang_code?: string | null
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "rules_from_fkey"
            columns: ["from"]
            isOneToOne: false
            referencedRelation: "docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rules_lang_code_fkey"
            columns: ["lang_code"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      user: {
        Row: {
          avatar: string | null
          id: number
          nick: string | null
          pref_lang: string | null
          role: Database["public"]["Enums"]["user_role"]
          uid: string | null
        }
        Insert: {
          avatar?: string | null
          id?: number
          nick?: string | null
          pref_lang?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          uid?: string | null
        }
        Update: {
          avatar?: string | null
          id?: number
          nick?: string | null
          pref_lang?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_pref_lang_fkey"
            columns: ["pref_lang"]
            isOneToOne: false
            referencedRelation: "lang_codes"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role:
        | "super_admin"
        | "project_manager"
        | "l10n_manager"
        | "l10n_reviewer"
        | "l10n_contributor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "super_admin",
        "project_manager",
        "l10n_manager",
        "l10n_reviewer",
        "l10n_contributor",
      ],
    },
  },
} as const
