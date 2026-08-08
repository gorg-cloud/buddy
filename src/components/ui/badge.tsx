import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "board inline-flex items-center gap-1 rounded-none border px-2 py-0.5 text-[10px] font-medium transition-colors [&_svg]:size-3 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-ink bg-ink text-paper",
        secondary: "border-ink/30 bg-muted text-ink",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-ink/40 text-ink",
        success: "border-signal bg-signal text-paper",
        sky: "border-amber bg-amber/15 text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
