import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gold-500/20 text-gold-400 border-gold-500/30',
        secondary: 'border-transparent bg-forest-700 text-gray-300',
        destructive: 'border-transparent bg-red-900/30 text-red-400 border-red-500/30',
        outline: 'text-foreground border-forest-600',
        success: 'border-transparent bg-emerald-900/30 text-emerald-400 border-emerald-500/30',
        warning: 'border-transparent bg-amber-900/30 text-amber-400 border-amber-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
