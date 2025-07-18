import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Brand } from '@/components/logo';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { RiTwitterFill } from '@remixicon/react';
import { AiParticlesBackground } from '@/components/ui/ai-particles-background';

const navItems = [
  { label: 'Twitter', href: 'https://x.com/ask_Dara', icon: RiTwitterFill },
  { label: 'Github', href: 'https://github.com/Infinitiespro/dara-app', icon: GitHubLogoIcon },
  { label: 'Docs', href: 'https://docs.dara.sh', icon: require('lucide-react').BookOpenIcon },
];

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="rounded-xl border border-border/50 bg-background/80 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="relative">
              <Brand className="scale-95 transition-opacity hover:opacity-80" />
            </div>
            <nav className="hidden md:ml-auto md:mr-8 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/home"
                className="h-10 rounded-lg px-6 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-lg border border-border/50 flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-4xl px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brand />
            <p className="text-sm text-muted-foreground">
              The intelligent copilot for Solana
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://x.com/ask_Dara"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-110"
            >
              <RiTwitterFill className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/Infinitiespro/dara-app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-110"
            >
              <GitHubLogoIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-2 border-t border-border/50 pt-2 text-center text-sm text-muted-foreground">
          <p>© 2025 Dara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AiParticlesBackground />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-32 overflow-hidden">
        {/* Blurred/gradient background for depth */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="h-[560px] w-[1200px] rounded-3xl bg-gradient-to-br from-primary/10 via-background/80 to-secondary/10 blur-2xl opacity-70" />
        </div>
        <div className="mb-8 z-10 text-center">
          <h1 className="text-3xl font-bold md:text-5xl mb-2">Dara Demo</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See Dara in action. This is a live preview of the actual user interface you’ll use to manage Solana with AI.
          </p>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-primary/30">
            <Image
              src="/demo-screenshot.png"
              alt="Dara App Demo Screenshot"
              width={1200}
              height={800}
              className="object-contain rounded-2xl"
              priority
            />
            <BorderBeam size={320} borderWidth={2.5} colorFrom="#ffb86c" colorTo="#8be9fd" duration={8} delay={9} />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 