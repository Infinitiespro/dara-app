import Image from 'next/image';

import { motion } from 'framer-motion';

import type { Integration } from '../data/integrations';

interface IntegrationCardProps {
  item: Integration;
  index: number;
  onClick?: () => void;
}

export function IntegrationCard({
  item,
  index,
  onClick,
}: IntegrationCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-border/50 
        bg-card/50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg"
    >
      <motion.div
        initial={false}
        whileHover={{
          scale: 1.1,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50"
        style={{
          background: `linear-gradient(135deg, ${item.theme.primary}15, ${item.theme.secondary}10)`,
        }}
      >
        <Image
          src={item.icon}
          alt={item.label}
          width={28}
          height={28}
          className="z-10 transition-transform duration-300 group-hover:scale-110"
        />
      </motion.div>

      <div className="z-10 flex-1 space-y-1 text-left">
        <motion.div
          className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary"
          initial={false}
        >
          {item.label}
        </motion.div>
        {item.description && (
          <motion.div
            className="line-clamp-1 text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors"
            initial={false}
          >
            {item.description}
          </motion.div>
        )}
      </div>

      {/* Theme color overlay on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${item.theme.primary}05, ${item.theme.secondary}03)`,
        }}
      />
    </motion.button>
  );
}
