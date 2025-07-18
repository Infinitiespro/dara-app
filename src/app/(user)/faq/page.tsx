import { EAPTransactionChecker } from '@/components/eap-transaction-checker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Wallet, Zap, Shield, Users, BookOpen, Sparkles } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  category: 'general' | 'wallet';
  icon: React.ReactNode;
}

const faqItems: FaqItem[] = [
  {
    id: 'item-1',
    question: 'What is Dara and how does it work?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Dara is an AI-powered Solana assistant that helps you interact with the Solana blockchain through natural language conversations.
          </p>
          <p className="mb-3">
            You can ask questions about your portfolio, execute trades, analyze market trends, and automate DeFi strategies - all through simple text commands.
          </p>
          <p>
            Dara integrates with major Solana protocols and provides real-time insights to help you make informed decisions in the DeFi ecosystem.
          </p>
        </div>
      </div>
    ),
    category: 'general',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'item-2',
    question: 'Can I export my embedded wallet?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Currently, we do not support exporting embedded wallets to ensure maximum security for our users.
          </p>
          <p>
            We are actively working on integrating with leading embedded wallet providers to give you absolute control over your wallet while maintaining security standards.
          </p>
        </div>
      </div>
    ),
    category: 'wallet',
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    id: 'item-3',
    question: 'How do I connect my Solana wallet to Dara?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click on the wallet icon in the bottom left corner</li>
            <li>Choose "Connect Wallet" from the options</li>
            <li>Select your preferred wallet (Phantom, Solflare, etc.)</li>
            <li>Approve the connection in your wallet</li>
            <li>You're now ready to use Dara with your wallet!</li>
          </ol>
          <p className="mt-4">
            Dara supports all major Solana wallets including Phantom, Solflare, Backpack, and more.
          </p>
        </div>
      </div>
    ),
    category: 'wallet',
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    id: 'item-4',
    question: 'What can I do with Dara?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Dara can help you with a wide range of Solana and DeFi activities:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Portfolio Analysis:</strong> Get insights about your token holdings and performance</li>
            <li><strong>Market Research:</strong> Discover new tokens and analyze market trends</li>
            <li><strong>Trading:</strong> Execute swaps and trades through integrated DEXs</li>
            <li><strong>Automation:</strong> Set up automated strategies and alerts</li>
            <li><strong>NFT Management:</strong> View and manage your NFT collections</li>
            <li><strong>DeFi Operations:</strong> Interact with lending protocols, staking, and yield farming</li>
          </ul>
        </div>
      </div>
    ),
    category: 'general',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'item-5',
    question: 'Is my data and wallet information secure?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Yes, we prioritize security above all else. Your wallet information is encrypted and stored securely using industry-standard protocols.
          </p>
          <p className="mb-3">
            We use Privy for authentication and wallet management, which provides enterprise-grade security for your digital assets.
          </p>
          <p>
            Your private keys are never stored on our servers, and all transactions require your explicit approval through your connected wallet.
          </p>
        </div>
      </div>
    ),
    category: 'general',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: 'item-6',
    question: 'How can I get help or report an issue?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            We offer multiple support channels to help you:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Discord:</strong> Join our community server for real-time support</li>
            <li><strong>Documentation:</strong> Check our comprehensive docs for detailed guides</li>
            <li><strong>Email:</strong> Contact our support team for urgent issues</li>
          </ul>
          <p className="mt-4">
            Our support team is available 24/7 to help you with any questions or issues you may encounter.
          </p>
        </div>
      </div>
    ),
    category: 'general',
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: 'item-7',
    question: 'Which Solana protocols does Dara integrate with?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Dara integrates with the most popular and trusted Solana protocols:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Jupiter:</strong> For the best token swaps and routing</li>
            <li><strong>Raydium:</strong> For liquidity pools and yield farming</li>
            <li><strong>Solend:</strong> For lending and borrowing</li>
            <li><strong>Marinade Finance:</strong> For SOL staking and liquid staking</li>
            <li><strong>Magic Eden:</strong> For NFT trading and marketplace</li>
            <li><strong>DexScreener:</strong> For real-time market data and charts</li>
          </ul>
          <p className="mt-4">
            We're constantly adding new integrations to provide you with the best DeFi experience on Solana.
          </p>
        </div>
      </div>
    ),
    category: 'general',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'item-8',
    question: 'How do I save and reuse my favorite prompts?',
    answer: (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">
            Dara makes it easy to save and reuse your favorite prompts:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Type your prompt in the chat interface</li>
            <li>After getting a response, click the bookmark icon next to the message</li>
            <li>Give your prompt a memorable title</li>
            <li>Access your saved prompts from the "Saved Prompts" section in the sidebar</li>
          </ol>
          <p className="mt-4">
            You can also organize your prompts by creating custom categories and tags for better organization.
          </p>
        </div>
      </div>
    ),
    category: 'general',
    icon: <BookOpen className="h-4 w-4" />,
  },
];

const categoryColors = {
  general: 'bg-blue-500/10 text-blue-600 border-blue-200',
  wallet: 'bg-green-500/10 text-green-600 border-green-200',
};

const categoryLabels = {
  general: 'General',
  wallet: 'Wallet',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-4">
            <HelpCircle className="mr-2 h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Dara, wallet management, features, and more.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-muted-foreground">Common Questions</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Click on any question to expand and view the detailed answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-border/50">
                  <AccordionTrigger className="text-left hover:no-underline group">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className="text-primary">{item.icon}</div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${categoryColors[item.category]}`}
                        >
                          {categoryLabels[item.category]}
                        </Badge>
                      </div>
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://discord.gg/dara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Discord
                </a>
                <a
                  href="https://docs.dara.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <BookOpen className="h-4 w-4" />
                  View Documentation
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
