"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CardAlign,
  CardBuilderConfig,
  CardBuilderProps,
  CardBuilderRenderContext,
  CardRadius,
  CardVariant,
  RequiredCardBuilderConfig,
} from "./card";

import Image from "next/image";

const radiusMap: Record<CardRadius, string> = {
  none: "rounded-none",
  md: "rounded-md",
  xl: "rounded-xl",
};

const imageRadiusMap: Record<CardRadius, string> = {
  none: "rounded-none",
  md: "rounded-md",
  xl: "rounded-xl",
};

const alignMap: Record<CardAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

function toPad(p: number) {
  const n = Math.max(0, Math.min(8, Math.round(p)));
  return `p-${n}`;
}

function toVariant(variant: CardVariant) {
  switch (variant) {
    case "elevated":
      return "shadow-lg";
    case "soft":
      return "bg-muted/40";
    case "outline":
      return "border-2";
    default:
      return "";
  }
}

// Optional hook to manage/derive config state
export function useCardBuilder(initialConfig: CardBuilderConfig = {}) {
  const [config, setConfig] = React.useState<CardBuilderConfig>(initialConfig);
  const updateConfig = React.useCallback((next: Partial<CardBuilderConfig>) => {
    setConfig((prev) => ({ ...prev, ...next }));
  }, []);
  return { config, updateConfig };
}

function withDefaults(config?: CardBuilderConfig): RequiredCardBuilderConfig {
  return {
    variant: config?.variant ?? "default",
    radius: config?.radius ?? "xl",
    padding: config?.padding ?? 4,
    headerAlign: config?.headerAlign ?? "left",
    media: {
      enabled: config?.media?.enabled ?? false,
      src: config?.media?.src ?? "/placeholder.svg?height=160&width=640",
      alt: config?.media?.alt ?? "Card header image",
      height: config?.media?.height ?? 160,
      radius: config?.media?.radius ?? "md",
    },
    badge: {
      enabled: config?.badge?.enabled ?? false,
      text: config?.badge?.text ?? "New",
    },
    avatar: {
      enabled: config?.avatar?.enabled ?? false,
      src: config?.avatar?.src ?? "/placeholder.svg?height=40&width=40",
      fallback: config?.avatar?.fallback ?? "AB",
    },
    showFooter: config?.showFooter ?? false,
    headerRenderer: config?.headerRenderer,
    contentRenderer: config?.contentRenderer,
    footerRenderer: config?.footerRenderer,
    headerClassName: config?.headerClassName,
    bodyClassName: config?.bodyClassName,
  };
}

export const CardBuilder = React.forwardRef<HTMLDivElement, CardBuilderProps>(
  (
    {
      title = undefined,
      description = undefined,
      body = (
        <p className="text-sm text-muted-foreground">
          Includes unlimited projects, priority support, and advanced analytics.
          Cancel anytime.
        </p>
      ),
      primaryAction = { label: "Get Started" },
      secondaryAction = { label: "Learn More", variant: "outline" },
      config: userConfig,
      className,
      ...props
    },
    ref
  ) => {
    const config = withDefaults(userConfig);
    const ctx: CardBuilderRenderContext = {
      title,
      description,
      body,
      primaryAction,
      secondaryAction,
      config,
    };

    const cardClasses = cn(
      radiusMap[config.radius],
      toVariant(config.variant),
      className
    );

    const pad = toPad(config.padding);
    const headerAlignClass = alignMap[config.headerAlign];

    return (
      <Card ref={ref} className={cardClasses} {...props}>
        {config.media.enabled && (
          <Image
            width={50}
            height={50}
            src={config.media.src || "/placeholder.svg"}
            alt={config.media.alt}
            className={cn(
              "w-full object-cover",
              imageRadiusMap[config.media.radius]
            )}
            style={{ height: config.media.height }}
          />
        )}

        {config.headerRenderer ? (
          <>{config.headerRenderer(ctx)}</>
        ) : (
          <CardHeader
            className={cn(
              pad,
              headerAlignClass,
              "gap-2",
              config.headerClassName
            )}
          >
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex-1">
                {title && (
                  <CardTitle className="leading-tight">{title}</CardTitle>
                )}
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </div>

              <div className="flex items-center gap-2">
                {config.badge.enabled && <Badge>{config.badge.text}</Badge>}
                {config.avatar.enabled && (
                  <Avatar>
                    <AvatarImage
                      src={config.avatar.src || "/placeholder.svg"}
                      alt="Avatar"
                    />
                    <AvatarFallback>{config.avatar.fallback}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </CardHeader>
        )}

        {config.contentRenderer ? (
          <>{config.contentRenderer(ctx)}</>
        ) : (
          <CardContent className={pad}>{body}</CardContent>
        )}

        {config.showFooter && (primaryAction || secondaryAction) && (
          <>
            <Separator />
            {config.footerRenderer ? (
              <>{config.footerRenderer(ctx)}</>
            ) : (
              <CardFooter className={cn(pad, "gap-2")}>
                {primaryAction && (
                  <Button
                    className="flex-1"
                    variant={primaryAction.variant ?? "default"}
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    className="flex-1"
                    variant={secondaryAction.variant ?? "outline"}
                    onClick={secondaryAction.onClick}
                    disabled={secondaryAction.disabled}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </CardFooter>
            )}
          </>
        )}
      </Card>
    );
  }
);
CardBuilder.displayName = "CardBuilder";

// Presets
export const CardBuilderPresets = {
  simple: (): CardBuilderConfig => ({
    media: { enabled: false },
    badge: { enabled: false },
    avatar: { enabled: false },
    showFooter: false,
    radius: "md",
    padding: 5,
  }),
  product: (): CardBuilderConfig => ({
    media: { enabled: true, height: 220, radius: "xl" },
    badge: { enabled: true, text: "Hot" },
    avatar: { enabled: false },
    variant: "elevated",
    showFooter: true,
    padding: 6,
  }),
  profile: (): CardBuilderConfig => ({
    media: { enabled: false },
    badge: { enabled: false },
    avatar: { enabled: true, fallback: "JD" },
    headerAlign: "center",
    radius: "xl",
    variant: "soft",
  }),
  pricing: (): CardBuilderConfig => ({
    media: { enabled: false },
    badge: { enabled: true, text: "Best Value" },
    avatar: { enabled: false },
    headerAlign: "center",
    showFooter: true,
    radius: "xl",
    variant: "outline",
    padding: 6,
  }),
};
