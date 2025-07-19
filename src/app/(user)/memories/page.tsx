import { Brain, Shield, Cloud, Sparkles, Settings2, Lock } from 'lucide-react';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import TypingAnimation from '@/components/ui/typing-animation';
import { AiParticlesBackground } from '@/components/ui/ai-particles-background';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { BorderBeam } from '@/components/ui/border-beam';
import { RainbowButton } from '@/components/ui/rainbow-button';
import DotPattern from '@/components/ui/dot-pattern';
import ShineBorder from '@/components/ui/shine-border';

export default function MemoriesPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      <AiParticlesBackground />
      <DotPattern className="z-0 opacity-20" width={32} height={32} cr={1.2} />
      <div className="relative z-10 w-full max-w-5xl px-4 py-24 flex flex-col items-center">
        <div className="mb-8 w-full flex flex-col items-center">
          <TypingAnimation
            text="Agent's Personalized Memory"
            duration={40}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
          />
          <AnimatedShinyText className="mt-4 text-lg md:text-2xl max-w-2xl text-center">
            Your AI copilot remembers, learns, and evolves with you. Experience the next generation of intelligent, persistent memory—secure, private, and always at your service.
          </AnimatedShinyText>
        </div>
        <div className="relative w-full">
          <BorderBeam size={420} borderWidth={2.5} colorFrom="#8be9fd" colorTo="#ffb86c" duration={10} delay={2} />
          <BentoGrid className="z-10">
            <BentoCard
              name="Contextual Recall"
              className=""
              background={<ShineBorder color={["#8be9fd", "#ffb86c"]} borderRadius={18} borderWidth={2} duration={12} />}
              Icon={Brain}
              description="Remembers your preferences, conversations, and workflows for seamless, personalized experiences."
            />
            <BentoCard
              name="Secure & Private"
              className=""
              background={<ShineBorder color={["#50fa7b", "#ff79c6"]} borderRadius={18} borderWidth={2} duration={14} />}
              Icon={Lock}
              description="Your memories are end-to-end encrypted. Only you and your agent can access them—never shared, always protected."
            />
            <BentoCard
              name="Cross-Session Intelligence"
              className=""
              background={<ShineBorder color={["#bd93f9", "#ffb86c"]} borderRadius={18} borderWidth={2} duration={16} />}
              Icon={Cloud}
              description="Persistent memory across devices and sessions. Pick up where you left off, anywhere, anytime."
            />
            <BentoCard
              name="Customizable"
              className=""
              background={<ShineBorder color={["#f1fa8c", "#8be9fd"]} borderRadius={18} borderWidth={2} duration={18} />}
              Icon={Settings2}
              description="You control what’s remembered. Fine-tune, edit, or erase memories with intuitive controls."
            />
            <BentoCard
              name="Evolving Intelligence"
              className=""
              background={<ShineBorder color={["#ff79c6", "#50fa7b"]} borderRadius={18} borderWidth={2} duration={20} />}
              Icon={Sparkles}
              description="Your agent learns and adapts, becoming smarter and more helpful with every interaction."
            />
            <BentoCard
              name="Coming Soon"
              className=""
              background={<ShineBorder color={["#ffb86c", "#bd93f9"]} borderRadius={18} borderWidth={2} duration={22} />}
              Icon={Shield}
              description="Next-gen memory features are on the horizon. Stay tuned for even more powerful, futuristic capabilities."
            />
          </BentoGrid>
        </div>
        <div className="mt-12 flex flex-col items-center">
          <RainbowButton className="text-lg px-8 py-3 shadow-xl">
            Get Notified When Memory Launches
          </RainbowButton>
          <p className="mt-3 text-muted-foreground text-sm text-center max-w-md">
            Memory is coming soon to Dara. Sign up to be the first to experience persistent, intelligent, and private AI memory for Solana.
          </p>
        </div>
      </div>
    </div>
  );
}
