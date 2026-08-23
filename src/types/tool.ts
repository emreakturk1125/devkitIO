// ─── Tool System Type Definitions ─────────────────────────────────────────

export type ToolOptionType = 'text' | 'number' | 'boolean' | 'select';

export interface SelectOption {
  label: string;
  value: string;
}

export interface ToolOption {
  id: string;
  label: string;
  type: ToolOptionType;
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  inputType: 'text' | 'code' | 'json' | 'xml' | 'sql' | 'dual';
  outputType?: 'text' | 'code' | 'json' | 'xml' | 'sql';
  options?: ToolOption[];
  detect?: (input: string) => boolean;
  process: (
    input: string,
    options?: Record<string, unknown>
  ) => string | Promise<string>;
  autoTransform?: boolean;
  /** When false, the tool generates from options only — input panel is inactive. Default: true. */
  requiresInput?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: ToolDefinition[];
}

// ─── State Types ──────────────────────────────────────────────────────────

export interface ToolboxState {
  selectedCategoryId: string | null;
  selectedToolId: string | null;
  toolOptions: Record<string, unknown>;
  input: string;
  secondaryInput: string; // For dual-input tools (Diff)
  output: string;
  error: string | null;
  isProcessing: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  favoriteToolIds: string[];
  editorSettings: {
    tabSize: number;
    wordWrap: boolean;
    fontSize: number;
  };
}
