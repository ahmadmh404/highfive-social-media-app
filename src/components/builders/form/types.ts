import type React from "react";
import type { ReactNode } from "react";
import type {
  FieldValues,
  Path,
  Control,
  FieldError,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import { SelectOption } from "./../select/select";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "switch"
  | "date"
  | "datetime-local"
  | "time"
  | "file"
  | "avatar"
  | "range"
  | "color"
  | "hidden"
  | "multi-sentences"
  | "custom";

export type FieldWidth = "full" | "half" | "third" | "quarter" | "auto";

type FieldLinkProps = {
  linkHref: string;
  linkLabel: string;
  className?: string;
};

// NEW: Message types
export type MessageType = "error" | "success" | "warning" | "info";

// conditoin value type
export type Value =
  | string
  | string[]
  | number
  | number[]
  | bigint
  | undefined
  | unknown;

export interface FormMessage {
  type: MessageType;
  text: string;
  dismissible?: boolean;
  duration?: number;
}

export interface MessageComponentProps {
  message: FormMessage;
  onDismiss?: () => void;
  className?: string;
}

export interface BaseField<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  name: Path<TFieldValues>;
  type: FieldType;
  label?: string | ReactNode;
  description?: string | ReactNode;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;

  // Layout properties
  width?: FieldWidth;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;

  conditional?: {
    field: Path<TFieldValues>;
    value: TFieldValues[Path<TFieldValues>];
    operator?:
      | "equals"
      | "not-equals"
      | "includes"
      | "not-includes"
      | "greater"
      | "less";
  };
}

export interface TextField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "text" | "email" | "password" | "tel" | "url" | "search";
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  spellCheck?: boolean;

  // additionla children
  link?: FieldLinkProps;
}

export interface NumberField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "number" | "range";
  min?: number;
  max?: number;
  step?: number;
  showSteppers?: boolean;
}

export interface TextareaField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "textarea";
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autoResize?: boolean;
  maxLength?: number;
}

export interface SelectField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "select" | "multiselect";
  defaultValue?: string;
  options: SelectOption[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  creatable?: boolean;
  emptyMessage?: string;
  maxSelections?: number;
}

export interface CheckboxField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "checkbox";
  options?: SelectOption[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

export interface RadioField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "radio";
  options: SelectOption[];
  defaultValue?: string;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
}

export interface SwitchField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "switch";
  size?: "sm" | "md" | "lg";
}

export interface DateField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "date" | "datetime-local" | "time";
  min?: string;
  max?: string;
  showCalendar?: boolean;
}

export interface FileField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  uploadUrl?: string;
}

export interface AvatarField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "avatar";
  fallbackText?: string;
  maxSize?: number;
  accept?: string;
  previewUrl?: string;
}

export interface ColorField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "color";
  format?: "hex" | "rgb" | "hsl";
  presets?: string[];
}

export interface CustomField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "custom";
  component: ReactNode;
  props?: Record<string, Value>;
}

export interface HiddenField<TFieldValues extends FieldValues = FieldValues>
  extends BaseField<TFieldValues> {
  type: "hidden";
}

export interface MultiSentencesField<
  TFieldValues extends FieldValues = FieldValues
> extends BaseField<TFieldValues> {
  type: "multi-sentences";
  senInputLabel?: string;
  deleteButtonIcon?: string;
  addButtonLabel?: string;
}

export type FormField<TFieldValues extends FieldValues = FieldValues> =
  | TextField<TFieldValues>
  | NumberField<TFieldValues>
  | TextareaField<TFieldValues>
  | SelectField<TFieldValues>
  | CheckboxField<TFieldValues>
  | RadioField<TFieldValues>
  | SwitchField<TFieldValues>
  | DateField<TFieldValues>
  | FileField<TFieldValues>
  | AvatarField<TFieldValues>
  | ColorField<TFieldValues>
  | CustomField<TFieldValues>
  | HiddenField<TFieldValues>
  | MultiSentencesField<TFieldValues>;

// Field Row for explicit row grouping
export interface FieldRow<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  fields: FormField<TFieldValues>[];
  className?: string;
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
}

export interface FieldGroup<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  fields: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  conditional?: {
    field: Path<TFieldValues>;
    value: Value;
    operator?: "equals" | "not-equals" | "includes" | "not-includes";
  };
}

export interface FormSection<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  groups: FieldGroup<TFieldValues>[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Enhanced FormStep with Zod integration
export interface FormStep<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  title?: string | ReactNode;
  description?: string | ReactNode;

  // Content
  fields?: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  groups?: FieldGroup<TFieldValues>[];
  sections?: FormSection<TFieldValues>[];

  // Step behavior
  optional?: boolean;
  skippable?: boolean;

  // Conditional rendering
  conditional?: {
    field: Path<TFieldValues>;
    value: Value;
    operator?:
      | "equals"
      | "not-equals"
      | "includes"
      | "not-includes"
      | "greater"
      | "less";
  };

  // Validation
  validateOnEnter?: boolean;
  validateOnLeave?: boolean;

  // Lifecycle callbacks
  onEnter?: (data: TFieldValues) => void | Promise<void>;
  onLeave?: (data: TFieldValues) => void | Promise<void>;
  onNext?: (data: TFieldValues) => boolean | Promise<boolean>;
  onPrevious?: (data: TFieldValues) => boolean | Promise<boolean>;
  onValidate?: (data: Partial<TFieldValues>) => Promise<Record<string, string>>;

  // Styling
  className?: string;
}

// Social login configuration
export interface SocialLoginConfig {
  providers?: SocialProvider[];
  position?: "top" | "bottom" | "both";
  layout?: "horizontal" | "vertical" | "grid";
  columns?: number;
  showDivider?: boolean;
  dividerText?: string;
  className?: string;
  buttonClassName?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onProviderClick?: (providerId: string) => void | Promise<void>;
  loading?: Record<string, boolean>;
}

export interface FormBuilderProps<
  TFieldValues extends FieldValues = FieldValues
> {
  // Form metadata
  title?: string | ReactNode;
  description?: string | ReactNode;

  // Form structure
  fields?: FormField<TFieldValues>[];
  rows?: FieldRow<TFieldValues>[];
  groups?: FieldGroup<TFieldValues>[];
  sections?: FormSection<TFieldValues>[];
  steps?: FormStep<TFieldValues>[];

  // Step configuration
  currentStep?: number;
  onStepChange?: (step: number, data: TFieldValues) => void;
  showStepNavigation?: boolean;
  showStepProgress?: boolean;
  stepNavigationPosition?: "top" | "bottom" | "both";
  allowStepNavigation?: boolean;
  validateAllStepsOnSubmit?: boolean;

  // Social login integration
  socialLogin?: SocialLoginConfig;

  // NEW: Message configuration
  message?: FormMessage;
  messageComponent?: React.ComponentType<MessageComponentProps>;
  messagePosition?: "top" | "bottom";
  onMessageDismiss?: () => void;

  // React Hook Form integration
  form: UseFormReturn<TFieldValues>;

  // Form handlers
  onSubmit: (data: TFieldValues) => void | Promise<Value>;

  // Layout
  layout?: "vertical" | "horizontal" | "grid";
  columns?: number;
  spacing?: "sm" | "md" | "lg";

  // Styling
  className?: string;
  formClassName?: string;
  stepClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;

  // Behavior
  disabled?: boolean;
  loading?: boolean;

  // Actions
  showSubmit?: boolean;
  showReset?: boolean;
  submitText?: string;
  resetText?: string;
  nextText?: string;
  previousText?: string;
  submitButtonProps?: Record<string, string | number>;
  resetButtonProps?: Record<string, string | number>;
  nextButtonProps?: Record<string, string | number>;
  previousButtonProps?: Record<string, string | number>;
  customActions?: ReactNode;

  // Default values
  defaultValues?: DefaultValues<TFieldValues>;

  // show back button
  backButtonConfig?: BackButtonConfig;
}

// Utility types for better TypeScript inference

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues
> {
  field: FormField<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  formData: TFieldValues;
}

export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => Promise<boolean>;
  onPrevious: () => Promise<boolean>;
  loading?: boolean;
}

export interface UseFormStepsOptions<
  TFieldValues extends FieldValues = FieldValues
> {
  steps: FormStep<TFieldValues>[];
  form: UseFormReturn<TFieldValues>;
  validateStepOnNext?: boolean;
  onStepChange?: (step: number, data: TFieldValues) => void;
}

export interface UseFormStepsReturn<
  TFieldValues extends FieldValues = FieldValues
> {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepData: FormStep<TFieldValues> | undefined;
  goToStep: (step: number) => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  previousStep: () => Promise<boolean>;
  validateCurrentStep: () => Promise<StepValidationResult>;
  getStepProgress: () => number;
  getCompletedSteps: () => number[];
  isStepValid: (stepIndex: number) => boolean;
  isStepAccessible: (stepIndex: number) => boolean;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, Value>;
}

export interface SocialProvider {
  id: string;
  name: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void | Promise<void>;
}

export interface SocialLoginButtonsProps {
  providers: SocialProvider[];
  className?: string;
  buttonClassName?: string;
  dividerClassName?: string;
  showDivider?: boolean;
  dividerText?: string;
  layout?: "horizontal" | "vertical" | "grid";
  columns?: number;
  size?: "default" | "sm" | "lg" | "icon";
  loading?: Record<string, boolean>;
  onProviderClick?: (providerId: string) => void | Promise<void>;
  disableAll?: boolean;
}

export type BackButtonConfig = {
  backButtonLabel: string;
  backButtonHref: string;
  className?: string;
};

// form steps types
export interface UseFormStepsProps<
  TFieldValues extends FieldValues = FieldValues
> {
  steps: FormStep<TFieldValues>[];
  form: UseFormReturn<TFieldValues>;
  onStepChange?: (step: number, data: TFieldValues) => void;
}
