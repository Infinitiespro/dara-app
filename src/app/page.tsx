'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@privy-io/react-auth';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { RiTwitterFill } from '@remixicon/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ActivityIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  LinkIcon,
  ShieldIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  SparklesIcon,
} from 'lucide-react';

import { Brand } from '@/components/logo';
import { AiParticlesBackground } from '@/components/ui/ai-particles-background';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import BlurFade from '@/components/ui/blur-fade';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { IntegrationsBackground } from '@/components/ui/integrations-background';
import Marquee from '@/components/ui/marquee';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Twitter', href: 'https://x.com/ask_Dara', icon: RiTwitterFill },
  { label: 'Github', href: 'https://git.new/dara', icon: GitHubLogoIcon },
  { label: 'Docs', href: 'https://docs.dara.sh', icon: BookOpenIcon },
];

const Header = ({ handleLogin }: { handleLogin: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BlurFade delay={0.1} className="relative z-50">
      <header className="fixed left-0 right-0 top-0">
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
                <Button
                  variant="outline"
                  className="h-10 rounded-lg px-6 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute left-4 right-4 top-full mt-2 rounded-lg border border-border/50 bg-background/95 p-4 shadow-lg backdrop-blur-md md:hidden">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </BlurFade>
  );
};

const Hero = ({ handleLogin }: { handleLogin: () => void }) => {
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);

  return (
    <section className="relative pt-[6rem]" ref={productRef}>
      {/* Content */}
      <div className="relative mx-auto max-w-screen-xl px-6 pb-12 pt-16 text-center md:pb-16 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <BlurFade delay={0.3} className="pointer-events-none select-none">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2 shadow-lg backdrop-blur-sm">
              <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Introducing Dara Agent
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              The{' '}
              <AnimatedShinyText className="inline">
                <span>Intelligent Copilot</span>
              </AnimatedShinyText>{' '}
              for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Solana</span>
            </h1>

            <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
              Elevate your Solana experience with AI-powered insights, automated trading, and intelligent portfolio management
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <RainbowButton
                onClick={handleLogin}
                className="h-14 min-w-[200px] text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Building
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </RainbowButton>
              
              <Button
                variant="outline"
                className="h-14 px-8 text-lg font-medium transition-all duration-200 hover:bg-primary/5"
                asChild
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </BlurFade>

          {/* Social Proof */}
          <BlurFade delay={0.5}>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

const ValueProps = () => {
  const valueProps = [
    {
      icon: BrainCircuitIcon,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and market analysis powered by advanced AI models"
    },
    {
      icon: ZapIcon,
      title: "Lightning Fast",
      description: "Execute trades and manage your portfolio with sub-second response times"
    },
    {
      icon: ShieldIcon,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with multi-signature support and audit trails"
    }
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Why Choose Dara?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for the modern Solana ecosystem
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <BlurFade key={index} delay={0.2 + index * 0.1}>
                <div className="group rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{prop.title}</h3>
                  <p className="text-muted-foreground">{prop.description}</p>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <BlurFade delay={0.5} className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tailored for Solana
          </h2>
          <p className="text-lg text-muted-foreground">
            Seamless integration with the world&apos;s leading AI-models
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="relative h-[400px] w-full max-w-3xl">
            <IntegrationsBackground />
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

const CTA = ({ handleLogin }: { handleLogin: () => void }) => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <BlurFade delay={0.3}>
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Transform Your Solana Experience?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of users who are already leveraging AI to maximize their Solana potential
          </p>
          <RainbowButton
            onClick={handleLogin}
            className="h-14 min-w-[200px] text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Get Started Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </RainbowButton>
        </BlurFade>
      </div>
    </section>
  );
};

const Footer = () => {
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
              href="https://git.new/dara"
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
};

export default function Home() {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const router = useRouter();
  let { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    ) => {
      router.push('/home');
    },
  });

  if (isMaintenanceMode) {
    login = () => {
      window.location.href = 'https://x.com/ask_Dara';
    };
  }

  return (
    <div className="flex flex-col">
      <AiParticlesBackground />
      <Header handleLogin={login} />
      <main className="flex-1">
        <Hero handleLogin={login} />
        <ValueProps />
        <Features />
        <CTA handleLogin={login} />
      </main>
      <Footer />
    </div>
  );
}
