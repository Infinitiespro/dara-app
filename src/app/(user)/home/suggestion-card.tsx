import { motion } from 'framer-motion';

import type { Suggestion } from './data/suggestions';

interface SuggestionCardProps extends Suggestion {
  /** @default 0 */
  delay?: number;
  /** @default false */
  useSubtitle?: boolean;
  onSelect: (text: string) => void;
}

export function SuggestionCard({
  title,
  subtitle,
  delay = 0,
  useSubtitle = false,
  onSelect,
}: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg"
    >
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect(useSubtitle ? subtitle : title)}
        className="w-full text-left"
      >
        <div className="mb-2 truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="truncate text-xs text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
          {subtitle}
        </div>
      </motion.button>
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
