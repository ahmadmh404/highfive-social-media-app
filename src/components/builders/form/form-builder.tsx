"use client";

import * as React from "react";
import Link from "next/link";

import {
  ChevronDown,
  Upload,
  X,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  MinusCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SocialLoginButtons } from "@/components/builders/form/social-login-buttons";
import { CompactFormMessage } from "@/components/builders/form/form-message";

import { cn } from "@/lib/utils";

import type {
  FormBuilderProps,
  FieldGroup,
  FormSection,
  SocialLoginConfig,
  FieldWidth,
  FieldRow as FieldRowType,
  SelectField as SelectFieldType,
  FormField as FormFieldType,
  TextField as TextFieldType,
  NumberField as NumberFieldType,
  TextareaField as TextAreaFieldType,
  CheckboxField as CheckboxFieldType,
  RadioField as RadioFieldType,
  SwitchField as SwitchFieldType,
  DateField as DateFieldType,
  FileField as FileFieldType,
  AvatarField as AvatarFieldType,
  ColorField as ColorFieldType,
  MultiSentencesField as MultiSentencesFieldType,
} from "./types";

import { useWatch } from "react-hook-form";
import type {
  DeepPartialSkipArrayKey,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import { useFormSteps } from "./hooks/use-form-steps";
import {
  StepProgress,
  StepNavigation,
} from "@/components/builders/form/steps-navigation";
import { BackButton } from "@/components/shared/back-button";

import {
  SelectBuilderConfig,
  SelectBuilderProps,
  SelectOption,
} from "../select/select";
import { SelectBuilder } from "../select/select-builder";

import { CardBuilderConfig, CardBuilderProps } from "../card/card";
import { CardBuilder } from "../card/card-builder";
import { UserAvatar } from "@/components/shared/avatar";

function TextField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: TextFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  formData: TFieldValues;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = field.type === "password";

  const link = field.link;
  const linkClassName = field.link?.className || "";

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                id={field.id}
                type={isPassword && showPassword ? "text" : field.type}
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                }}
                onBlur={() => {
                  formField.onBlur();
                }}
                disabled={field.disabled}
                readOnly={field.readonly}
                className={cn(field.inputClassName, isPassword && "pr-10")}
                {...(field.type === "text" && {
                  autoComplete: field.autoComplete,
                  maxLength: field.maxLength,
                  minLength: field.minLength,
                  pattern: field.pattern,
                  spellCheck: field.spellCheck,
                })}
              />
              {isPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          {field.description && (
            <FormDescription
              className={cn("text-sm", field.descriptionClassName)}
            >
              {field.description}
            </FormDescription>
          )}

          {link && (
            <Link
              href={link.linkHref}
              className={cn("text-sm hover:text-primary", linkClassName)}
            >
              {link.linkLabel}
            </Link>
          )}

          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function NumberField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: NumberFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            {field.type === "range" ? (
              <div className="space-y-2">
                <Slider
                  value={[formField.value || field.min || 0]}
                  onValueChange={(values) => {
                    formField.onChange(values[0]);
                  }}
                  min={field.min}
                  max={field.max}
                  step={field.step || 1}
                  className={field.inputClassName}
                  disabled={field.disabled}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{field.min || 0}</span>
                  <span className="font-medium">
                    {formField.value || field.min || 0}
                  </span>
                  <span>{field.max || 100}</span>
                </div>
              </div>
            ) : (
              <Input
                id={field.id}
                type="number"
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={(e) => {
                  const numValue = e.target.value
                    ? Number(e.target.value)
                    : undefined;
                  formField.onChange(numValue);
                }}
                onBlur={() => {
                  formField.onBlur();
                }}
                disabled={field.disabled}
                readOnly={field.readonly}
                min={field.min}
                max={field.max}
                step={field.step}
                className={field.inputClassName}
              />
            )}
          </FormControl>
          {field.description && (
            <FormDescription className={field.descriptionClassName}>
              {field.description}
            </FormDescription>
          )}
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function TextareaField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: TextAreaFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formField.value || ""}
              onChange={(e) => {
                formField.onChange(e.target.value);
              }}
              onBlur={() => {
                formField.onBlur();
              }}
              disabled={field.disabled}
              readOnly={field.readonly}
              rows={field.rows}
              className={cn(
                field.inputClassName,
                field.resize === "none" && "resize-none",
                field.resize === "horizontal" && "resize-x",
                field.resize === "vertical" && "resize-y"
              )}
              maxLength={field.maxLength}
            />
          </FormControl>
          {field.description && (
            <FormDescription className={field.descriptionClassName}>
              {field.description}
            </FormDescription>
          )}
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function SelectField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: SelectFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        const selectedValues =
          field.type === "multiselect"
            ? Array.isArray(formField.value)
              ? formField.value
              : [formField.value]
            : formField.value;

        const config: SelectBuilderConfig = {
          clearable: field.clearable,
          searchable: field.searchable,
          creatable: field.creatable,
          emptyMessage: field.emptyMessage,
          multiple: field.type === "multiselect",
          maxSelections: field.maxSelections,
        };

        const props: SelectBuilderProps = {
          config,
          defaultValue: field.defaultValue,
          options: field.options,
          value: selectedValues,
          onChange: formField.onChange,
          className: field.className,
        };

        return (
          <FormItem className={field.className}>
            {field.label && (
              <FormLabel className={field.labelClassName}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <SelectBuilder {...props} />
            </FormControl>
            {field.description && (
              <FormDescription className={field.descriptionClassName}>
                {field.description}
              </FormDescription>
            )}
            <FormMessage className={field.errorClassName} />
          </FormItem>
        );
      }}
    />
  );
}

function CheckboxField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: CheckboxFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        if (field.options) {
          const selectedValues = (
            Array.isArray(formField.value) ? formField.value : []
          ) as string[];
          const layout = field.layout || "vertical";
          const columns = field.columns || 1;

          return (
            <FormItem className={field.className}>
              {field.label && (
                <FormLabel className={field.labelClassName}>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
              )}
              <FormControl>
                <div
                  className={cn(
                    "space-y-2",
                    layout === "horizontal" && "flex flex-wrap gap-4",
                    layout === "grid" && `grid gap-2 grid-cols-${columns}`
                  )}
                >
                  {field.options.map((option: SelectOption) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${field.id}-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter(
                                (v: string) => v !== option.value
                              );
                          formField.onChange(newValues);
                        }}
                        disabled={field.disabled || option.disabled}
                      />
                      <label
                        htmlFor={`${field.id}-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              {field.description && (
                <FormDescription className={field.descriptionClassName}>
                  {field.description}
                </FormDescription>
              )}
              <FormMessage className={field.errorClassName} />
            </FormItem>
          );
        }

        return (
          <FormItem
            className={cn(
              "flex flex-row items-start space-x-3 space-y-0",
              field.className
            )}
          >
            <FormControl>
              <Checkbox
                id={field.id}
                checked={!!formField.value}
                onCheckedChange={(checked) => formField.onChange(checked)}
                disabled={field.disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              {field.label && (
                <FormLabel
                  htmlFor={field.id}
                  className={cn(
                    "text-sm font-normal cursor-pointer",
                    field.labelClassName
                  )}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
              )}
              {field.description && (
                <FormDescription className={field.descriptionClassName}>
                  {field.description}
                </FormDescription>
              )}
            </div>
            <FormMessage className={field.errorClassName} />
          </FormItem>
        );
      }}
    />
  );
}

function RadioField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: RadioFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  const layout = field.layout || "vertical";
  const columns = field.columns || 1;

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              value={formField.value || ""}
              onValueChange={(val) => formField.onChange(val)}
              disabled={field.disabled}
              defaultValue={field.defaultValue}
              className={cn(
                layout === "horizontal" && "flex flex-wrap gap-4",
                layout === "grid" && `grid gap-2 grid-cols-${columns}`
              )}
            >
              {field.options.map((option: SelectOption) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.id}-${option.value}`}
                    disabled={option.disabled}
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {field.description && (
            <FormDescription className={field.descriptionClassName}>
              {field.description}
            </FormDescription>
          )}
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function SwitchField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: SwitchFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-4",
            field.className
          )}
        >
          <div className="space-y-0.5">
            {field.label && (
              <FormLabel className={field.labelClassName}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FormLabel>
            )}
            {field.description && (
              <FormDescription className={field.descriptionClassName}>
                {field.description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={!!formField.value}
              onCheckedChange={(checked) => {
                formField.onChange(checked);
              }}
              disabled={field.disabled}
            />
          </FormControl>
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function DateField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: DateFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                id={field.id}
                type={field.type}
                value={formField.value || ""}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                }}
                onBlur={() => {
                  formField.onBlur();
                }}
                disabled={field.disabled}
                readOnly={field.readonly}
                min={field.min}
                max={field.max}
                className={field.inputClassName}
              />
              {field.type === "date" && (
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}
              {field.type === "time" && (
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}
            </div>
          </FormControl>
          {field.description && (
            <FormDescription className={field.descriptionClassName}>
              {field.description}
            </FormDescription>
          )}
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function FileField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: FileFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        const handleFileChange = (files: FileList | null) => {
          if (!files) return;

          const fileArray = Array.from(files);
          if (field.maxFiles && fileArray.length > field.maxFiles) {
            return; // Handle error
          }

          if (field.maxSize) {
            const oversized = fileArray.some(
              (file) => file.size > field.maxSize!
            );
            if (oversized) return; // Handle error
          }

          const newValue = field.multiple ? fileArray : fileArray[0];
          formField.onChange(newValue);
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setDragOver(false);
          handleFileChange(e.dataTransfer.files);
        };

        const files = Array.isArray(formField.value)
          ? formField.value
          : formField.value
          ? [formField.value]
          : [];

        return (
          <FormItem className={field.className}>
            {field.label && (
              <FormLabel className={field.labelClassName}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-2">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or{" "}
                    <label
                      htmlFor={field.id}
                      className="text-primary cursor-pointer hover:underline"
                    >
                      browse
                    </label>
                  </div>
                  <Input
                    id={field.id}
                    type="file"
                    accept={field.accept}
                    multiple={field.multiple}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                    disabled={field.disabled}
                  />
                  {field.maxSize && (
                    <div className="text-xs text-muted-foreground">
                      Max file size: {Math.round(field.maxSize / 1024 / 1024)}MB
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file: File, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(file.size / 1024)}KB
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newFiles = files.filter(
                              (_: File, i: number) => i !== index
                            );
                            const newValue = field.multiple ? newFiles : null;
                            formField.onChange(newValue);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            {field.description && (
              <FormDescription className={field.descriptionClassName}>
                {field.description}
              </FormDescription>
            )}
            <FormMessage className={field.errorClassName} />
          </FormItem>
        );
      }}
    />
  );
}

function AvatarField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: AvatarFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  formData: TFieldValues;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => {
        const handleFileChange = (file: File | null) => {
          if (file) {
            formField.onChange(URL.createObjectURL(file));
          }
        };

        return (
          <FormItem
            className={cn("flex flex-col items-center", field.className)}
          >
            {field.label && (
              <FormLabel className={field.labelClassName}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <UserAvatar
                src={formField.value}
                onUpload={handleFileChange}
                showUpload
                name={field.name}
                size={200}
              />
            </FormControl>
            {field.description && (
              <FormDescription className={field.descriptionClassName}>
                {field.description}
              </FormDescription>
            )}
            <FormMessage className={field.errorClassName} />
          </FormItem>
        );
      }}
    />
  );
}

function ColorField<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: ColorFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.className}>
          {field.label && (
            <FormLabel className={field.labelClassName}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={formField.value || "#000000"}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                }}
                onBlur={() => {
                  formField.onBlur();
                }}
                disabled={field.disabled}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                id={field.id}
                type="text"
                value={formField.value || ""}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                }}
                placeholder="#000000"
                className={cn("flex-1", field.inputClassName)}
                disabled={field.disabled}
              />
            </div>
          </FormControl>
          {field.description && (
            <FormDescription className={field.descriptionClassName}>
              {field.description}
            </FormDescription>
          )}
          <FormMessage className={field.errorClassName} />
        </FormItem>
      )}
    />
  );
}

function MultiSentencesField<TFieldValues extends FieldValues>({
  field,
  form,
  formData,
}: {
  field: MultiSentencesFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  formData: TFieldValues;
}) {
  const [sens, setSens] = React.useState<string[]>([]);

  return (
    <div className="space-y-5">
      {field.label && (
        <FormLabel className={field.labelClassName}>
          {field.label}{" "}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </FormLabel>
      )}

      <div className="space-y-3">
        {sens.map((sen, index) => {
          return (
            <FormField
              key={index}
              control={form.control}
              name={`${field.name}.${index}` as Path<TFieldValues>}
              render={({ field: formField }) => {
                // const handleChange = (
                //   e: React.ChangeEvent<HTMLInputElement>
                // ) => {
                //   let temp = sens;
                //   temp = temp.map((t, i) =>
                //     i === index ? e.target.value : temp[i]
                //   );
                //   setSens(temp);
                // };

                const addSen = () => {
                  const sen = formField.value;
                  if (!sen.trim()) return;
                  const newSens = [...sens, sen];
                  setSens(newSens);
                  formField.onChange(sens, formData);
                };

                const deleteSen = (id: number) => {
                  const newSens = sens.filter((sen, index) => index !== id);
                  setSens(newSens);
                  formField.onChange(newSens, formData);
                };

                return (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="flex items-center gapx-2">
                        <Input
                          {...formField}
                          placeholder={
                            field.senInputLabel || `Sentence ${index + 1}`
                          }
                        />

                        {/* Delete sen button */}
                        {sens.length > 0 && (
                          <Button
                            type="button"
                            onClick={() => deleteSen(index)}
                            variant={"ghost"}
                            className="text-destructive hover:text-destructive/80"
                          >
                            {!field.deleteButtonIcon && (
                              <MinusCircle className="w-5 h-5" />
                            )}

                            {field.deleteButtonIcon}
                          </Button>
                        )}

                        {/* Add Sen button */}
                        <Button
                          variant={"outline"}
                          type="button"
                          onClick={addSen}
                          className="w-full gap-2 py-4"
                        >
                          <>
                            <Plus className="w-4 h-4" />{" "}
                            {field.addButtonLabel || "Add Option"}
                          </>
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get field width classes
function getFieldWidthClass(width?: FieldWidth): string {
  switch (width) {
    case "half":
      return "w-full md:w-1/2";
    case "third":
      return "w-full md:w-1/3";
    case "quarter":
      return "w-full md:w-1/4";
    case "auto":
      return "w-auto";
    case "full":
    default:
      return "w-full";
  }
}

// FieldRow component for rendering fields in rows
function FieldRow<TFieldValues extends FieldValues>({
  row,
  form,
  formData,
}: {
  row: FieldRowType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  formData: TFieldValues;
}) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row",
        gapClasses[row.gap || "md"],
        alignClasses[row.align || "stretch"],
        row.className
      )}
    >
      {row.fields.map((field) => (
        <div key={field.id} className={getFieldWidthClass(field.width)}>
          <FieldRenderer field={field} form={form} formData={formData} />
        </div>
      ))}
    </div>
  );
}

// Render the input field
function FieldRenderer<TFieldValues extends FieldValues>({
  field,
  form,
  formData,
}: {
  field: FormFieldType<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  formData: TFieldValues;
}) {
  // Check conditional rendering
  if (field.conditional) {
    const conditionValue = formData[field.conditional.field];
    const operator = field.conditional.operator || "equals";

    let shouldShow = false;
    switch (operator) {
      case "equals":
        shouldShow = conditionValue === field.conditional.value;
        break;
      case "not-equals":
        shouldShow = conditionValue !== field.conditional.value;
        break;
      case "includes":
        shouldShow =
          Array.isArray(conditionValue) &&
          conditionValue.includes(field.conditional.value);
        break;
      case "not-includes":
        shouldShow =
          Array.isArray(conditionValue) &&
          !conditionValue.includes(field.conditional.value);
        break;
      case "greater":
        shouldShow = conditionValue > field.conditional.value;
        break;
      case "less":
        shouldShow = conditionValue < field.conditional.value;
        break;
    }

    if (!shouldShow) return null;
  }

  const fieldProps = { form, formData };

  // Wrap field in width container if width is specified and not in a row
  const fieldComponent = (() => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
      case "search":
        return <TextField {...fieldProps} field={field} />;

      case "number":
      case "range":
        return <NumberField {...fieldProps} field={field} />;

      case "textarea":
        return <TextareaField {...fieldProps} field={field} />;

      case "select":
      case "multiselect":
        return <SelectField {...fieldProps} field={field} />;

      case "checkbox":
        return <CheckboxField {...fieldProps} field={field} />;

      case "radio":
        return <RadioField {...fieldProps} field={field} />;

      case "switch":
        return <SwitchField {...fieldProps} field={field} />;

      case "date":
      case "datetime-local":
      case "time":
        return <DateField {...fieldProps} field={field} />;

      case "file":
        return <FileField {...fieldProps} field={field} />;

      case "avatar":
        return <AvatarField {...fieldProps} field={field} />;

      case "color":
        return <ColorField {...fieldProps} field={field} />;

      case "multi-sentences":
        return <MultiSentencesField {...fieldProps} field={field} />;

      case "custom":
        return field.component;

      case "hidden":
        return (
          <FormField
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <input
                type="hidden"
                id={field.id}
                name={field.name as string}
                value={formField.value || ""}
              />
            )}
          />
        );
      default:
        return <TextField {...fieldProps} field={field} />;
    }
  })();

  return fieldComponent;
}

function renderFieldGroup<TFieldVlaues extends FieldValues = FieldValues>(
  group: FieldGroup<TFieldVlaues>,
  index: number,
  form: UseFormReturn<TFieldVlaues>,
  watchedValues: DeepPartialSkipArrayKey<TFieldVlaues>
) {
  const body = (
    <div className="space-y-4">
      {/* Render field rows */}
      {group.rows?.map((row) => (
        <FieldRow
          key={row.id}
          row={row}
          form={form}
          formData={(watchedValues || {}) as TFieldVlaues}
        />
      ))}

      {/* Render standalone fields */}
      {group.fields?.map((field) => (
        <div key={field.id} className={getFieldWidthClass(field.width)}>
          <FieldRenderer
            field={field}
            form={form}
            formData={(watchedValues || {}) as TFieldVlaues}
          />
        </div>
      ))}
    </div>
  );

  const config: CardBuilderConfig = {
    variant: "default",
    radius: "md",
    headerAlign: "center",
    media: { enabled: false },
    badge: { enabled: false },
    avatar: { enabled: false },
    padding: 5,
  };

  const cardProps: CardBuilderProps = {
    title: group.title as string,
    description: group.description as string,
    className: "border-none",
    body,
    config,
  };

  return <CardBuilder key={index} {...cardProps} />;
}

function renderFormSection<TFieldValue extends FieldValues = FieldValues>(
  section: FormSection<TFieldValue>,
  index: number,
  form: UseFormReturn<TFieldValue>,
  watchedValues: DeepPartialSkipArrayKey<TFieldValue>
) {
  return (
    <Collapsible
      key={index}
      className={cn("border-none shadow-sm", section.className)}
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-10 rounded-md px-2 py-1.5 flex items-center justify-between"
          >
            <span className="text-sm font-medium">{section.title}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4">
        {section.description && (
          <p className="text-sm text-muted-foreground">{section.description}</p>
        )}
        <div className="space-y-4">
          {section.groups.map((group, index) =>
            renderFieldGroup(group, index, form, watchedValues)
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Render social login buttons
function renderSocialLogin(config: SocialLoginConfig) {
  if (!config || !config.providers || config.providers.length === 0) {
    return null;
  }

  return (
    <SocialLoginButtons
      providers={config.providers}
      className={config.className}
      buttonClassName={config.buttonClassName}
      showDivider={config.showDivider !== false}
      dividerText={config.dividerText || "OR"}
      layout={config.layout || "vertical"}
      columns={config.columns || 2}
      size={config.size || "default"}
      loading={config.loading || {}}
      onProviderClick={config.onProviderClick}
    />
  );
}

// Main FormBuilder component
export function FormBuilder<TFieldValues extends FieldValues = FieldValues>({
  title,
  description,
  fields = [],
  rows = [],
  groups = [],
  sections = [],
  steps = [],
  onStepChange,
  showStepNavigation = true,
  showStepProgress = true,
  stepNavigationPosition = "bottom",
  allowStepNavigation = false,
  validateAllStepsOnSubmit = true,
  socialLogin,
  message,
  messageComponent: MessageComponent = CompactFormMessage,
  messagePosition = "top",
  onMessageDismiss,
  form,
  onSubmit,
  layout = "vertical",
  columns = 1,
  spacing = "md",
  className,
  formClassName,
  stepClassName,
  titleClassName,
  descriptionClassName,
  disabled = false,
  loading = false,
  showSubmit = true,
  showReset = false,
  submitText = "Submit",
  resetText = "Reset",
  nextText = "Next",
  previousText = "Previous",
  submitButtonProps = {},
  resetButtonProps = {},
  nextButtonProps = {},
  previousButtonProps = {},
  customActions,
  defaultValues,
  backButtonConfig,
}: FormBuilderProps<TFieldValues>) {
  // Determine if this is a multi-step form
  const isMultiStep = steps.length > 0;

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Initialize step management for multi-step forms
  const stepManager = useFormSteps({
    steps: isMultiStep ? steps : [],
    form,
    onStepChange,
  });

  // Watch all form values for conditional rendering and onChange
  // the return type os this useWatch is the same of TFieldvales but all fields are optional
  const watchedValues = useWatch({ control: form.control });

  // Get current step content for multi-step forms
  const getCurrentStepContent = () => {
    if (!isMultiStep) {
      return { fields, rows, groups, sections };
    }

    const currentStepData = stepManager.currentStepData;
    if (!currentStepData) {
      return { fields: [], rows: [], groups: [], sections: [] };
    }

    return {
      fields: currentStepData.fields || [],
      rows: currentStepData.rows || [],
      groups: currentStepData.groups || [],
      sections: currentStepData.sections || [],
    };
  };

  const {
    fields: currentFields,
    rows: currentRows,
    groups: currentGroups,
    sections: currentSections,
  } = getCurrentStepContent();

  // Handle form submission with proper validation
  const onSubmitHandler = handleSubmit(
    async (data) => {
      try {
        // For multi-step forms, handle next step or final submission
        if (isMultiStep && !stepManager.isLastStep) {
          await stepManager.nextStep();
          return;
        }

        // Validate all steps if required
        if (isMultiStep && validateAllStepsOnSubmit) {
          for (let i = 0; i < stepManager.totalSteps; i++) {
            const isStepValid = await stepManager.validateCurrentStep();
            if (!isStepValid) {
              await stepManager.goToStep(i);
              return;
            }
          }
        }

        await onSubmit(data);
      } catch (error) {
        console.error("Form submission error:", error);
        if (error instanceof Error) {
        }
      }
    },
    (errors) => {
      console.log(
        "form errors: ",
        Object.keys(errors).map((err) => errors[err]?.message as string)
      );
    }
  );

  // Handle form reset
  const handleReset = () => {
    reset(defaultValues);
    if (isMultiStep) {
      stepManager.goToStep(0);
    }
  };

  // Render message component
  const renderMessage = () => {
    if (!message) return null;

    return (
      <MessageComponent
        message={message}
        onDismiss={onMessageDismiss}
        className="mb-4"
      />
    );
  };

  // Render step progress
  const renderStepProgress = () => {
    if (!isMultiStep || !showStepProgress) return null;

    return (
      <StepProgress
        currentStep={stepManager.currentStep}
        totalSteps={stepManager.totalSteps}
        steps={steps}
        onGoToStep={allowStepNavigation ? stepManager.goToStep : undefined}
        allowStepNavigation={allowStepNavigation}
        getCompletedSteps={stepManager.getCompletedSteps}
        isStepAccessible={stepManager.isStepAccessible}
      />
    );
  };

  // Render step navigation
  const renderStepNavigation = () => {
    if (!isMultiStep || !showStepNavigation) return null;

    return (
      <StepNavigation
        currentStep={stepManager.currentStep}
        totalSteps={stepManager.totalSteps}
        canGoNext={stepManager.canGoNext}
        canGoPrevious={stepManager.canGoPrevious}
        showStepNavigation={showStepNavigation}
        isFirstStep={stepManager.isFirstStep}
        isLastStep={stepManager.isLastStep}
        onNext={stepManager.nextStep}
        onPrevious={stepManager.previousStep}
        loading={loading || isSubmitting}
        nextText={nextText}
        previousText={previousText}
        submitText={submitText}
        nextButtonProps={nextButtonProps}
        previousButtonProps={previousButtonProps}
        submitButtonProps={submitButtonProps}
      />
    );
  };

  const spacingClasses = {
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6",
  };

  const stepContent = (
    <>
      {/* Render sections */}
      {currentSections.length > 0 && (
        <div className={spacingClasses[spacing]}>
          {currentSections.map((section, index) =>
            renderFormSection(section, index, form, watchedValues)
          )}
        </div>
      )}

      {/* Render standalone groups */}
      {currentGroups.length > 0 && (
        <div className={spacingClasses[spacing]}>
          {currentGroups.map((group, index) =>
            renderFieldGroup(group, index, form, watchedValues)
          )}
        </div>
      )}

      {/* Render field rows */}
      {currentRows.length > 0 && (
        <div className={spacingClasses[spacing]}>
          {currentRows.map((row) => (
            <FieldRow
              key={row.id}
              row={row}
              form={form}
              formData={(watchedValues || {}) as TFieldValues}
            />
          ))}
        </div>
      )}

      {/* Render standalone fields */}
      {currentFields.length > 0 && (
        <div
          className={cn(
            spacingClasses[spacing],
            layout === "horizontal" && "flex flex-wrap gap-4",
            layout === "grid" && `grid gap-4 grid-cols-${columns}`
          )}
        >
          {currentFields.map((field) => (
            <div key={field.id} className={getFieldWidthClass(field.width)}>
              <FieldRenderer
                field={field}
                form={form}
                formData={(watchedValues || {}) as TFieldValues}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className={cn("p-5 border shadow-sm rounded-md space-y-6", className)}>
      {/* Form title and description for non-multi-step forms */}
      {!isMultiStep && (title || description) && (
        <div className={cn("space-y-2 mb-6 text-center", stepClassName)}>
          {title && (
            <h2 className={cn("text-2xl font-semibold", titleClassName)}>
              {title}
            </h2>
          )}
          {description && (
            <p className={cn("text-muted-foreground", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={onSubmitHandler}
          className={cn("space-y-4", formClassName)}
        >
          {/* Message at top position */}
          {messagePosition === "top" && renderMessage()}

          {/* Social login at top position */}
          {socialLogin &&
            (socialLogin.position === "top" ||
              socialLogin.position === "both") &&
            renderSocialLogin(socialLogin)}

          {/* Step progress at top */}
          {(stepNavigationPosition === "top" ||
            stepNavigationPosition === "both") &&
            renderStepProgress()}

          {/* Current step title and description for multi-step forms */}
          {isMultiStep && stepManager.currentStepData && (
            <div className={cn("space-y-2 text-center", stepClassName)}>
              {stepManager.currentStepData.title && (
                <h2 className={cn("text-2xl font-semibold", titleClassName)}>
                  {stepManager.currentStepData.title}
                </h2>
              )}
              {stepManager.currentStepData.description && (
                <p
                  className={cn("text-muted-foreground", descriptionClassName)}
                >
                  {stepManager.currentStepData.description}
                </p>
              )}
            </div>
          )}

          {/* Step content */}
          <div className="space-y-4">{stepContent}</div>

          {/* Form actions for single-step forms */}
          {!isMultiStep && (showSubmit || showReset || customActions) && (
            <div className="flex-1 items-center justify-center gap-4">
              {showReset && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={disabled || loading}
                  {...resetButtonProps}
                >
                  {resetText}
                </Button>
              )}

              {customActions}

              {showSubmit && (
                <Button
                  type="submit"
                  disabled={disabled || loading || isSubmitting}
                  {...submitButtonProps}
                >
                  {(loading || isSubmitting) && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {submitText}
                </Button>
              )}
            </div>
          )}

          {/* Step navigation at bottom */}
          {(stepNavigationPosition === "bottom" ||
            stepNavigationPosition === "both") &&
            renderStepNavigation()}

          {/* Step progress at bottom */}
          {stepNavigationPosition === "bottom" && renderStepProgress()}

          {/* Message at bottom position */}
          {messagePosition === "bottom" && renderMessage()}

          {/* Social login at bottom position */}
          {socialLogin &&
            (socialLogin.position === "bottom" ||
              socialLogin.position === "both" ||
              !socialLogin.position) &&
            renderSocialLogin(socialLogin)}

          {backButtonConfig && (
            <BackButton
              href={backButtonConfig.backButtonHref}
              label={backButtonConfig.backButtonLabel}
              className={backButtonConfig.className}
            />
          )}
        </form>
      </Form>
    </div>
  );
}
