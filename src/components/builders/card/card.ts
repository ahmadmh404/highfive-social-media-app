import { Button } from "@/components/ui/button";

export type CardVariant = "default" | "elevated" | "soft" | "outline";
export type CardRadius = "none" | "md" | "xl";
export type CardAlign = "left" | "center" | "right";

export interface CardAction {
  label: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface CardMedia {
  enabled?: boolean;
  src?: string;
  alt?: string;
  height?: number;
  radius?: CardRadius;
}

export interface CardBadge {
  enabled?: boolean;
  text?: string;
}

export interface CardAvatar {
  enabled?: boolean;
  src?: string;
  fallback?: string;
}

export interface CardBuilderConfig {
  // Appearance
  variant?: CardVariant;
  radius?: CardRadius;
  padding?: number; // 0..8 -> Tailwind p-{n}
  headerAlign?: CardAlign;

  // Sections
  media?: CardMedia;
  badge?: CardBadge;
  avatar?: CardAvatar;
  showFooter?: boolean;

  // Content renderers (override default render)
  headerRenderer?: (ctx: CardBuilderRenderContext) => React.ReactNode;
  contentRenderer?: (ctx: CardBuilderRenderContext) => React.ReactNode;
  footerRenderer?: (ctx: CardBuilderRenderContext) => React.ReactNode;

  // classNames
  headerClassName?: string;
  bodyClassName?: string;
}

export interface CardBuilderProps extends React.HTMLAttributes<HTMLDivElement> {
  // Simple content API
  title?: string;
  description?: string;
  body?: React.ReactNode;

  // Actions
  primaryAction?: CardAction;
  secondaryAction?: CardAction;

  // Config
  config?: CardBuilderConfig;

  // Controlled UI toggles via config override
  className?: string;
}

export interface CardBuilderRenderContext {
  title?: string;
  description?: string;
  body?: React.ReactNode;
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  config: RequiredCardBuilderConfig;
}

export type RequiredCardBuilderConfig = Required<
  Pick<CardBuilderConfig, "variant" | "radius" | "padding" | "headerAlign">
> & {
  media: Required<CardMedia>;
  badge: Required<CardBadge>;
  avatar: Required<CardAvatar>;
  showFooter: boolean;
  headerClassName: CardBuilderConfig["headerClassName"];
  bodyClassName: CardBuilderConfig["bodyClassName"];
  headerRenderer?: CardBuilderConfig["headerRenderer"];
  contentRenderer?: CardBuilderConfig["contentRenderer"];
  footerRenderer?: CardBuilderConfig["footerRenderer"];
};
