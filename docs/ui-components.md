# UI Components

Dara uses a modular, reusable component system built with Shadcn UI, Radix UI, and Tailwind CSS.

---


## Key Components
- **Button**: Primary, outline, ghost, etc. (`/components/ui/button`)
- **Card**: Surface container for content (`/components/ui/card`)
- **BlurFade**: Animated fade-in effect for sections
- **BorderBeam**: Animated border effect for surfaces
- **Brand**: App logo and branding
- **RainbowButton**: Animated gradient button
- **SectionTitle**: Section headers with icons
- **Marquee**: Scrolling text/brand bar
- **IntegrationsBackground**: Animated integrations section
- **AiParticlesBackground**: Mouse/cursor/particle background effect

## Patterns
- **Functional, declarative components**
- **TypeScript interfaces** for props
- **Tailwind CSS** for layout, spacing, and responsiveness
- **Radix UI** for accessible primitives (dialogs, popovers, etc.)
- **Shadcn UI** for design system and theming

## Usage Example
```tsx
import { Button } from '@/components/ui/button';

<Button variant="outline">Click Me</Button>
```

---

See the `/components` directory for more. 