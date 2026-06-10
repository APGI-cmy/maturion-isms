import { useId, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useIsms } from '@/context/IsmsContext';
import { buildAskMaturionResponse } from '@/lib/askMaturionAdapter';
import type { IsmsModuleKey } from '@/lib/entitlements';

interface AskMaturionButtonProps {
  moduleKey?: IsmsModuleKey;
  organisationName?: string | null;
  sector?: string | null;
  primaryGoal?: string | null;
}

export const AskMaturionButton = ({ moduleKey, organisationName, sector, primaryGoal }: AskMaturionButtonProps) => {
  const { user } = useAuth();
  const { entitlement } = useIsms();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);

  const askMaturion = () => {
    const response = buildAskMaturionResponse({
      question,
      context: {
        isAuthenticated: Boolean(user),
        moduleKey,
        entitlement,
        organisationName,
        sector,
        primaryGoal,
      },
    });

    setAnswer(response.answer);
  };

  return (
    <div className="print:hidden">
      <Button
        variant="outline"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Ask Maturion
      </Button>

      {open && (
        <Card id={panelId} role="region" aria-label="Ask Maturion preview panel" className="mt-4 border-primary/30">
          <CardHeader>
            <CardTitle>Ask Maturion</CardTitle>
            <CardDescription>
              W5 safe adapter preview. It prepares deterministic educational or filtered-context guidance without calling a live AI provider.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2 block">
              <span className="text-sm font-medium">Question</span>
              <textarea
                className="min-h-24 w-full rounded-md border bg-background px-3 py-2"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about maturity, controls, evidence, resilience or the next improvement step."
              />
            </label>
            <Button onClick={askMaturion}>
              <Send className="mr-2 h-4 w-4" />
              Prepare safe preview
            </Button>
            {answer && (
              <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
                {answer}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AskMaturionButton;
