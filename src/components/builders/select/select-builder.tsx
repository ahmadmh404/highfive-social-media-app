"use client";

import * as React from "react";
import { Check, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SelectBuilderConfig,
  SelectBuilderProps,
  SelectOption,
} from "./select";

// Hook for managing select state
export function useSelectBuilder(
  initialOptions: SelectOption[] = [],
  initialConfig: SelectBuilderConfig = {}
) {
  const [options, setOptions] = React.useState<SelectOption[]>(initialOptions);
  const [config, setConfig] =
    React.useState<SelectBuilderConfig>(initialConfig);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const groupedOptions = React.useMemo(() => {
    if (!config.groupBy) return { ungrouped: filteredOptions };

    return filteredOptions.reduce((groups, option) => {
      const group = option.group || "ungrouped";
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    }, {} as Record<string, SelectOption[]>);
  }, [filteredOptions, config.groupBy]);

  const addOption = React.useCallback((option: SelectOption) => {
    setOptions((prev) => [...prev, option]);
  }, []);

  const removeOption = React.useCallback((value: string) => {
    setOptions((prev) => prev.filter((opt) => opt.value !== value));
  }, []);

  const updateConfig = React.useCallback(
    (newConfig: Partial<SelectBuilderConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }));
    },
    []
  );

  const handleCreate = React.useCallback(
    async (value: string) => {
      if (!config.onCreate) return;

      setIsCreating(true);
      try {
        const newOption = await config.onCreate(value);
        addOption(newOption);
        setSearchQuery("");
        return newOption;
      } finally {
        setIsCreating(false);
      }
    },
    [config, addOption]
  );

  return {
    options,
    config,
    searchQuery,
    setSearchQuery,
    filteredOptions,
    groupedOptions,
    isCreating,
    addOption,
    removeOption,
    updateConfig,
    handleCreate,
  };
}

const ANY_VALUE = "ANY_VALUE";
const NON_SELECT_VALUE = "NON_SELECT_VALUE";

// Main SelectBuilder component
export const SelectBuilder = React.forwardRef<
  React.ComponentRef<typeof Select>,
  SelectBuilderProps
>(
  (
    {
      options,
      defaultValue,
      value,
      onChange,
      config = {},
      className,
      disabled,
      loading,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const {
      placeholder = "Select an option...",
      emptyMessage = "No options found",
      searchPlaceholder = "Search options...",
      searchable = false,
      clearable = false,
      multiple = false,
      creatable = false,
      anySelect,
      groupBy = false,
      groupLabels = {},
      variant = "default",
      size = "md",
      maxSelections,
      optionRenderer,
      valueRenderer,
      groupRenderer,
      onCreate,
      onSelectionChange,
    } = config;

    // Filter options based on search
    const filteredOptions =
      searchQuery.trim() === ""
        ? options
        : options.filter(
            (option) =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              option.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

    // Group options if needed
    const groupedOptions = groupBy
      ? { ungrouped: filteredOptions }
      : filteredOptions.reduce((groups, option) => {
          const group = option.group || "ungrouped";
          if (!groups[group]) groups[group] = [];
          groups[group].push(option);
          return groups;
        }, {} as Record<string, SelectOption[]>);

    // Handle selection
    const selectedOptions = options.filter((opt) =>
      (value != null ? (Array.isArray(value) ? value : [value]) : []).includes(
        opt.value
      )
    );

    const handleSelect = (optionValue: string) => {
      if (optionValue === ANY_VALUE || optionValue === NON_SELECT_VALUE) {
        onChange?.(undefined);
      }
      if (multiple) {
        const currentValues = Array.isArray(value)
          ? value
          : value
          ? [value]
          : [];

        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : maxSelections && currentValues.length >= maxSelections
          ? currentValues
          : [...currentValues, optionValue];

        onChange?.(newValues);
        onSelectionChange?.(
          options.filter((opt) => newValues.includes(opt.value))
        );
      } else {
        onChange?.(optionValue);
        onSelectionChange?.(options.filter((opt) => opt.value === optionValue));
        setOpen(false);
      }
    };

    const handleCreate = async () => {
      if (!onCreate || !searchQuery.trim()) return;

      try {
        const newOption = await onCreate(searchQuery.trim());
        handleSelect(newOption.value);
        setSearchQuery("");
      } catch (error) {
        console.error("Failed to create option:", error);
      }
    };

    // Size variants
    const sizeClasses = {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    };

    // Render option content
    const renderOption = (option: SelectOption) => {
      if (optionRenderer) return optionRenderer(option);

      const Icon = option.icon;
      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <div className="flex-1 min-w-0">
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-muted-foreground truncate">
                {option.description}
              </div>
            )}
          </div>
          {multiple && Array.isArray(value) && value.includes(option.value) && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
      );
    };

    // Render selected value
    const renderValue = () => {
      if (!selectedOptions.length) return placeholder;

      if (multiple) {
        return (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.slice(0, 3).map((option) => (
              <Badge key={option.value} variant="secondary" className="text-xs">
                {valueRenderer ? valueRenderer(option) : option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                ></Button>
              </Badge>
            ))}
            {selectedOptions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{selectedOptions.length - 3} more
              </Badge>
            )}
          </div>
        );
      }

      const option = selectedOptions[0];
      return valueRenderer ? valueRenderer(option) : option.label;
    };

    return (
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={defaultValue}
        value={multiple ? undefined : (value as string)}
        onValueChange={multiple ? undefined : handleSelect}
        disabled={disabled || loading}
        {...props}
      >
        <SelectTrigger
          ref={ref}
          className={cn(
            sizeClasses[size],
            variant === "outline" && "border-2",
            variant === "ghost" && "border-0 bg-transparent",
            className
          )}
        >
          <div className="flex items-center justify-between w-full">
            {value == null ? (
              <span>{placeholder}</span>
            ) : (
              <SelectValue asChild>
                <div className="flex-1 text-left">{renderValue()} </div>
              </SelectValue>
            )}
          </div>
        </SelectTrigger>

        <SelectContent className="min-w-(--radix-select-trigger-width)">
          {searchable && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
          )}

          <ScrollArea className="max-h-[300px]">
            {anySelect && (
              <>
                <SelectItem value={ANY_VALUE}>
                  {renderOption({ ...anySelect, value: ANY_VALUE })}
                </SelectItem>
                <Separator />
              </>
            )}

            {Object.keys(groupedOptions).length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              Object.entries(groupedOptions).map(
                ([group, groupOptions], groupIndex) => (
                  <div key={group}>
                    {groupBy && group !== "ungrouped" && (
                      <>
                        {groupIndex > 0 && <Separator />}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {groupRenderer
                            ? groupRenderer(group, groupOptions)
                            : groupLabels[group] || group}
                        </div>
                      </>
                    )}

                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer"
                      >
                        {renderOption(option)}
                      </SelectItem>
                    ))}
                  </div>
                )
              )
            )}

            {clearable && selectedOptions.length > 0 && (
              <SelectItem value={NON_SELECT_VALUE}>Clear</SelectItem>
            )}

            {creatable &&
              searchQuery &&
              !filteredOptions.some(
                (opt) => opt.label.toLowerCase() === searchQuery.toLowerCase()
              ) && (
                <>
                  <Separator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleCreate}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create &quot;{searchQuery}&quot;
                    </Button>
                  </div>
                </>
              )}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }
);

SelectBuilder.displayName = "SelectBuilder";

// Preset configurations for common use cases
export const SelectBuilderPresets = {
  // Simple dropdown
  simple: (): SelectBuilderConfig => ({
    placeholder: "Choose an option",
    clearable: true,
  }),

  // Searchable dropdown
  searchable: (): SelectBuilderConfig => ({
    searchable: true,
    placeholder: "Search and select...",
    clearable: true,
  }),

  // Multi-select with tags
  multiSelect: (maxSelections?: number): SelectBuilderConfig => ({
    multiple: true,
    searchable: true,
    clearable: true,
    maxSelections,
    placeholder: "Select multiple options...",
  }),

  // Creatable dropdown
  creatable: (): SelectBuilderConfig => ({
    searchable: true,
    creatable: true,
    clearable: true,
    placeholder: "Type to search or create...",
  }),

  // Grouped options
  grouped: (): SelectBuilderConfig => ({
    groupBy: true,
    searchable: true,
    clearable: true,
  }),

  // User/People selector
  userSelector: (): SelectBuilderConfig => ({
    searchable: true,
    multiple: true,
    clearable: true,
    placeholder: "Select users...",
    optionRenderer: (option) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {option.label.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-xs text-muted-foreground">
              {option.description}
            </div>
          )}
        </div>
      </div>
    ),
  }),
};
