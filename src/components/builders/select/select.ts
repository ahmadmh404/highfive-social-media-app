import { IconType } from "@/types";

// Base option interface that can be extended
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  group?: string;
}

type AnySelectConfig = {
  enable: boolean;
  label: string;
  icon: IconType;
  description?: string;
};

// Configuration for the select builder
export interface SelectBuilderConfig {
  // Appearance
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;

  // Behavior
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  creatable?: boolean;
  anySelect?: AnySelectConfig;

  // Grouping
  groupBy?: boolean;
  groupLabels?: Record<string, string>;

  // Styling
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";

  // Limits
  maxSelections?: number;

  // Custom renderers
  optionRenderer?: (option: SelectOption) => React.ReactNode;
  valueRenderer?: (option: SelectOption) => React.ReactNode;
  groupRenderer?: (group: string, options: SelectOption[]) => React.ReactNode;

  // Callbacks
  onCreate?: (value: string) => SelectOption | Promise<SelectOption>;
  onSelectionChange?: (selected: SelectOption[]) => void;
}

export interface SelectBuilderProps {
  options: SelectOption[];
  defaultValue?: string;
  value?: string | string[];
  onChange?: (value: string | string[] | undefined) => void;
  config?: SelectBuilderConfig;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}
