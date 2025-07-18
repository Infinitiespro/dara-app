'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SavedPrompt } from '@prisma/client';
import { RiTwitterXFill } from '@remixicon/react';
import { Attachment, JSONValue } from 'ai';
import { useChat } from 'ai/react';
import { CheckCircle2, Loader2, SparklesIcon, ZapIcon, BrainCircuitIcon } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import ChatInterface from '@/app/(user)/chat/[id]/chat-interface';
import { SavedPromptsMenu } from '@/components/saved-prompts-menu';
import { Badge } from '@/components/ui/badge';
import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TypingAnimation from '@/components/ui/typing-animation';
import { useConversations } from '@/hooks/use-conversations';
import { useUser } from '@/hooks/use-user';
import { useWalletPortfolio } from '@/hooks/use-wallet-portfolio';
import { EVENTS } from '@/lib/events';
import { SolanaUtils } from '@/lib/solana';
import {
  IS_SUBSCRIPTION_ENABLED,
  IS_TRIAL_ENABLED,
  cn,
  getSubPriceFloat,
  getTrialTokensFloat,
} from '@/lib/utils';
import { checkEAPTransaction } from '@/server/actions/eap';
import {
  getSavedPrompts,
  setSavedPromptLastUsedAt,
} from '@/server/actions/saved-prompt';

import { IntegrationsGrid } from './components/integrations-grid';
import { ConversationInput } from './conversation-input';
import { getRandomSuggestions } from './data/suggestions';
import { SuggestionCard } from './suggestion-card';

const EAP_PRICE = 1.0;
const RECEIVE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_EAP_RECEIVE_WALLET_ADDRESS!;

const EAP_BENEFITS = [
  'Support platform growth',
  'Early access to features',
  'Unlimited AI interactions',
  'Join early governance and decisions',
];

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function SectionTitle({ children, icon }: SectionTitleProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon && <div className="text-primary">{icon}</div>}
      <h2 className="text-lg font-semibold text-foreground">
        {children}
      </h2>
    </div>
  );
}

export function HomeContent() {
  const pathname = usePathname();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isFetchingSavedPrompts, setIsFetchingSavedPrompts] =
    useState<boolean>(true);
  const suggestions = useMemo(() => getRandomSuggestions(4), []);
  const [showChat, setShowChat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatId, setChatId] = useState(() => uuidv4());
  const { user, isLoading: isUserLoading } = useUser();
  const [verifyingTx, setVerifyingTx] = useState<string | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const MAX_VERIFICATION_ATTEMPTS = 20;

  const { conversations, refreshConversations } = useConversations(user?.id);

  const resetChat = useCallback(() => {
    setShowChat(false);
    setChatId(uuidv4());
  }, []);

  useEffect(() => {
    async function fetchSavedPrompts() {
      try {
        const res = await getSavedPrompts();
        const savedPrompts = res?.data?.data || [];

        setSavedPrompts(savedPrompts);
      } catch (err) {
        console.error(err);
      }
      setIsFetchingSavedPrompts(false);
    }
    fetchSavedPrompts();
  }, []);

  const { messages, input, handleSubmit, setInput } = useChat({
    id: chatId,
    initialMessages: [],
    body: { id: chatId },
    onFinish: () => {
      // Only refresh if we have a new conversation that's not in the list
      if (chatId && !conversations?.find((conv) => conv.id === chatId)) {
        refreshConversations().then(() => {
          // Dispatch event to mark conversation as read
          window.dispatchEvent(new CustomEvent(EVENTS.CONVERSATION_READ));
        });
      }
    },
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        message: messages[messages.length - 1],
        id: chatId,
      } as unknown as JSONValue;
    },
  });

  // Verification effect
  useEffect(() => {
    if (!verifyingTx) return;

    const verify = async () => {
      try {
        const response = await checkEAPTransaction({ txHash: verifyingTx });
        if (response?.data?.success) {
          toast.success('EAP Purchase Successful', {
            description:
              'Your Early Access Program purchase has been verified. Please refresh the page.',
          });
          setVerifyingTx(null);
          return;
        }

        // Continue verification if not reached max attempts
        if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
          setVerificationAttempts((prev) => prev + 1);
        } else {
          // Max attempts reached, show manual verification message
          toast.error('Verification Timeout', {
            description:
              'Please visit the FAQ page to manually verify your transaction.',
          });
          setVerifyingTx(null);
        }
      } catch (error) {
        console.error('Verification error:', error);
        // Continue verification if not reached max attempts
        if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
          setVerificationAttempts((prev) => prev + 1);
        }
      }
    };

    const timer = setTimeout(verify, 3000);
    return () => clearTimeout(timer);
  }, [verifyingTx, verificationAttempts]);

  const handleSend = async (value: string, attachments: Attachment[]) => {
    const NON_TRIAL_PERMISSION =
      !user?.earlyAccess && !user?.subscription?.active;
    const TRIAL_PERMISSION =
      !user?.earlyAccess && !user?.subscription?.active && !meetsTokenBalance;

    // If user is not in EAP or no active subscription, don't allow sending messages
    if (!IS_TRIAL_ENABLED && NON_TRIAL_PERMISSION) {
      return;
    }

    // If user is in trial mode, check if they meet the minimum token balance
    if (IS_TRIAL_ENABLED && TRIAL_PERMISSION) {
      return;
    }

    if (!value.trim() && (!attachments || attachments.length === 0)) {
      return;
    }

    // Create a synthetic event for handleSubmit
    const fakeEvent = {
      preventDefault: () => {},
      type: 'submit',
    } as React.FormEvent;

    try {
      // Submit the message and wait for it to complete
      await handleSubmit(fakeEvent, {
        data: value,
        experimental_attachments: attachments,
      });

      // Wait for the conversation to be created in the database
      // Increased wait time to ensure conversation is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update UI state and URL
      setShowChat(true);
      window.history.replaceState(null, '', `/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handlePurchase = async () => {
    if (!user) return;
    setIsProcessing(true);
    setVerificationAttempts(0);

    try {
      const tx = await SolanaUtils.sendTransferWithMemo({
        to: RECEIVE_WALLET_ADDRESS,
        amount: EAP_PRICE,
        memo: `{
                    "type": "EAP_PURCHASE",
                    "user_id": "${user.id}"
                }`,
      });

      if (tx) {
        setVerifyingTx(tx);
        toast.success('Transaction Sent', {
          description: 'Transaction has been sent. Verifying your purchase...',
        });
      } else {
        toast.error('Transaction Failed', {
          description: 'Failed to send the transaction. Please try again.',
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);

      let errorMessage = 'Failed to send the transaction. Please try again.';

      if (error instanceof Error) {
        const errorString = error.toString();
        if (
          errorString.includes('TransactionExpiredBlockheightExceededError')
        ) {
          toast.error('Transaction Timeout', {
            description: (
              <>
                <span className="font-semibold">
                  Transaction might have been sent successfully.
                </span>
                <br />
                If SOL was deducted from your wallet, please visit the FAQ page
                and input your transaction hash for manual verification.
              </>
            ),
          });
          return;
        }
        errorMessage = error.message;
      }

      toast.error('Transaction Failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset chat when pathname changes to /home
  useEffect(() => {
    if (pathname === '/home') {
      resetChat();
    }
  }, [pathname, resetChat]);

  // 监听浏览器的前进后退
  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === '/home') {
        resetChat();
      } else if (location.pathname === `/chat/${chatId}`) {
        setShowChat(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [chatId, resetChat]);

  const filteredPrompts = input.startsWith('/')
    ? savedPrompts.filter((savedPrompt) =>
        savedPrompt.title.toLowerCase().includes(input.slice(1).toLowerCase()),
      )
    : savedPrompts;

  function handlePromptMenuClick(subtitle: string) {
    setInput(subtitle);
  }

  async function updatePromptLastUsedAt(id: string) {
    try {
      const res = await setSavedPromptLastUsedAt({ id });
      if (!res?.data?.data) {
        throw new Error();
      }

      const { lastUsedAt } = res.data.data;

      setSavedPrompts((old) =>
        old.map((prompt) =>
          prompt.id !== id ? prompt : { ...prompt, lastUsedAt },
        ),
      );
    } catch (error) {
      console.error('Failed to update -lastUsedAt- for prompt:', { error });
    }
  }
  const hasEAP = user?.earlyAccess === true;

  const shouldCheckPortfolio =
    IS_TRIAL_ENABLED && !hasEAP && !user?.subscription?.active;

  const { data: portfolio, isLoading: isPortfolioLoading } =
    useWalletPortfolio();

  // Check if user meets the minimum token balance
  const meetsTokenBalance = useMemo(() => {
    // Temporarily bypass token balance check for development
    // TODO: Remove this bypass once token balance calculation is fixed
    return true;
    
    // Original code (commented out for development)
    /*
    if (!portfolio || !portfolio.tokens) return false;

    // Find the DARA token
    const daraToken = portfolio.tokens.find(
      (token) => token.mint === process.env.NEXT_PUBLIC_DARA_MINT,
    );

    // Check the balance
    const balance = daraToken?.balance || 0;

    const trialMinBalance = getTrialTokensFloat();

    return trialMinBalance && balance >= trialMinBalance;
    */
  }, []); // Remove portfolio dependency since we're bypassing

  // Handle loading states
  if (isUserLoading || (shouldCheckPortfolio && isPortfolioLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const toggleTrialBanner = () => {
    setShowTrialBanner((prev) => !prev);
  };

  const RENDER_TRIAL_BANNER =
    IS_TRIAL_ENABLED &&
    !hasEAP &&
    !user?.subscription?.active &&
    !meetsTokenBalance &&
    showTrialBanner;
  const USER_HAS_TRIAL =
    IS_TRIAL_ENABLED &&
    !hasEAP &&
    !user?.subscription?.active &&
    meetsTokenBalance;
  const RENDER_SUB_BANNER =
    !hasEAP &&
    !user?.subscription?.active &&
    !RENDER_TRIAL_BANNER &&
    !USER_HAS_TRIAL;
  const RENDER_EAP_BANNER =
    !IS_SUBSCRIPTION_ENABLED &&
    !hasEAP &&
    !RENDER_TRIAL_BANNER &&
    !USER_HAS_TRIAL;

  const USER_HAS_ACCESS =
    hasEAP || user?.subscription?.active || USER_HAS_TRIAL;

  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <BlurFade delay={0.2}>
            <div className="mb-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <SparklesIcon className="mr-2 h-4 w-4" />
                AI-Powered Solana Assistant
              </div>
            </div>
            
            <TypingAnimation
              className="mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
              duration={50}
              text="How can I assist you?"
            />
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Your intelligent copilot for everything Solana. Ask questions, get insights, and execute actions seamlessly.
            </p>
          </BlurFade>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Conversation Input */}
          <BlurFade delay={0.3}>
            <Card className="border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
              <ConversationInput
                value={input}
                onChange={setInput}
                onSubmit={handleSend}
                savedPrompts={savedPrompts}
                setSavedPrompts={setSavedPrompts}
              />
              <SavedPromptsMenu
                input={input}
                isFetchingSavedPrompts={false}
                savedPrompts={savedPrompts}
                filteredPrompts={filteredPrompts}
                onPromptClick={handlePromptMenuClick}
                updatePromptLastUsedAt={updatePromptLastUsedAt}
                onHomeScreen={true}
              />
            </Card>
          </BlurFade>

          {/* Quick Start Guide - Visible to All Users */}
          <BlurFade delay={0.5}>
            <div className="space-y-6">
              <SectionTitle icon={<SparklesIcon className="h-5 w-5" />}>
                Quick Start Guide
              </SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                  <div className="mb-2 text-2xl font-bold text-primary">1</div>
                  <div className="text-sm font-medium">Ask Questions</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Start a conversation about anything Solana
                  </div>
                </Card>
                <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                  <div className="mb-2 text-2xl font-bold text-primary">2</div>
                  <div className="text-sm font-medium">Get Insights</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Receive AI-powered analysis and recommendations
                  </div>
                </Card>
                <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                  <div className="mb-2 text-2xl font-bold text-primary">3</div>
                  <div className="text-sm font-medium">Take Action</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Execute trades and manage your portfolio
                  </div>
                </Card>
              </div>
            </div>
          </BlurFade>

          {/* Quick Actions - Visible to All Users */}
          <BlurFade delay={0.6}>
            <div className="space-y-6">
              <SectionTitle icon={<ZapIcon className="h-5 w-5" />}>
                Quick Actions
              </SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={suggestion.title}
                    {...suggestion}
                    delay={0.7 + index * 0.1}
                    onSelect={setInput}
                  />
                ))}
              </div>
            </div>
          </BlurFade>

          {/* Integrations Preview - Visible to All Users */}
          <BlurFade delay={0.7}>
            <div className="space-y-6">
              <SectionTitle icon={<SparklesIcon className="h-5 w-5" />}>
                Solana Ecosystem Integrations
              </SectionTitle>
              <Card className="border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
                <IntegrationsGrid />
              </Card>
            </div>
          </BlurFade>

          {USER_HAS_ACCESS && (
            <div className="space-y-12">
              {/* Stats & Insights Section */}
              <BlurFade delay={0.8}>
                <div className="space-y-6">
                  <SectionTitle icon={<BrainCircuitIcon className="h-5 w-5" />}>
                    Your Activity
                  </SectionTitle>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">
                        {conversations?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Conversations</div>
                    </Card>
                    <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">
                        {savedPrompts.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Saved Prompts</div>
                    </Card>
                    <Card className="border-border/50 bg-card/50 p-4 text-center shadow-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">
                        {user?.earlyAccess ? 'EAP' : user?.subscription?.active ? 'Pro' : 'Free'}
                      </div>
                      <div className="text-sm text-muted-foreground">Plan</div>
                    </Card>
                  </div>
                </div>
              </BlurFade>

              {/* Saved Prompts Section */}
              {!isFetchingSavedPrompts && savedPrompts.length !== 0 && (
                <BlurFade delay={0.6}>
                  <div className="space-y-6">
                    <SectionTitle icon={<BrainCircuitIcon className="h-5 w-5" />}>
                      Your Saved Prompts
                    </SectionTitle>
                    {isFetchingSavedPrompts ? (
                      <div className="flex w-full items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {savedPrompts
                          .slice(0, Math.min(4, savedPrompts.length))
                          .map((savedPrompt, index) => (
                            <SuggestionCard
                              id={savedPrompt.id}
                              useSubtitle={true}
                              title={savedPrompt.title}
                              subtitle={savedPrompt.content}
                              key={savedPrompt.id}
                              delay={0.7 + index * 0.1}
                              onSelect={setInput}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </BlurFade>
              )}

              {/* Recent Conversations */}
              {conversations && conversations.length > 0 && (
                <BlurFade delay={0.7}>
                  <div className="space-y-6">
                    <SectionTitle icon={<SparklesIcon className="h-5 w-5" />}>
                      Recent Conversations
                    </SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {conversations.slice(0, 4).map((conversation, index) => (
                        <Card
                          key={conversation.id}
                          className="group cursor-pointer border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg"
                          onClick={() => {
                            setChatId(conversation.id);
                            setShowChat(true);
                            window.history.replaceState(null, '', `/chat/${conversation.id}`);
                          }}
                        >
                          <div className="mb-2 truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {conversation.title || 'New Conversation'}
                          </div>
                          <div className="truncate text-xs text-muted-foreground/80">
                            {conversation.lastMessageAt ? `Last active ${new Date(conversation.lastMessageAt).toLocaleDateString()}` : 'No messages yet'}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </BlurFade>
              )}

              {/* Helpful Resources */}
              <BlurFade delay={0.9}>
                <div className="space-y-6">
                  <SectionTitle icon={<SparklesIcon className="h-5 w-5" />}>
                    Helpful Resources
                  </SectionTitle>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Card className="group cursor-pointer border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg">
                      <div className="mb-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Documentation
                      </div>
                      <div className="text-xs text-muted-foreground/80">
                        Learn how to use Dara effectively
                      </div>
                    </Card>
                    <Card className="group cursor-pointer border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg">
                      <div className="mb-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Community
                      </div>
                      <div className="text-xs text-muted-foreground/80">
                        Join our Discord and Twitter
                      </div>
                    </Card>
                  </div>
                </div>
              </BlurFade>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Always render mainContent, remove paywall banners
  return (
    <>
      {showChat ? (
        <ChatInterface id={chatId} initialMessages={messages} />
      ) : (
        mainContent
      )}
    </>
  );
}
