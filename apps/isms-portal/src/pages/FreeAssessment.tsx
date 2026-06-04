import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Printer, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';
import {
  allQuestionsAnswered,
  answerOptions,
  assessmentDomains,
  assessmentQuestions,
  createAssessmentReport,
  type AssessmentContext,
} from '@/lib/freeAssessment';

const initialContext: AssessmentContext = {
  organisationName: '',
  sector: 'diamond mining, sorting, trading or high-value mineral operations',
};

const FreeAssessment = () => {
  const navigate = useNavigate();
  const [context, setContext] = useState<AssessmentContext>(initialContext);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showReport, setShowReport] = useState(false);

  const report = useMemo(() => createAssessmentReport(answers, context), [answers, context]);
  const completedCount = Object.keys(answers).length;
  const completionPercentage = Math.round((completedCount / assessmentQuestions.length) * 100);
  const canSubmit = allQuestionsAnswered(answers);

  const updateAnswer = (questionId: string, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleExportReport = () => {
    const domainText = report.domainResults
      .map((result) => `${result.domainName}: ${result.score}/5 (${result.level})\n${result.improvementParagraph}`)
      .join('\n\n');
    const reportText = [
      'Free Operational Maturity Assessment Report',
      `Organisation: ${context.organisationName || 'Not provided'}`,
      `Sector: ${context.sector}`,
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      `Overall score: ${report.overallScore}/5 (${report.overallLevel})`,
      '',
      report.executiveSummary,
      '',
      domainText,
      '',
      report.resilienceSummary,
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'isms-free-maturity-assessment-report.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const domainQuestionCounts = assessmentDomains.map((domain) => ({
    ...domain,
    total: assessmentQuestions.filter((question) => question.domainId === domain.id).length,
    answered: assessmentQuestions.filter((question) => question.domainId === domain.id && answers[question.id]).length,
  }));

  if (showReport) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 print:max-w-none print:px-0">
        <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={() => setShowReport(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to answers
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export text
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print report
            </Button>
            <Button onClick={() => navigate(`${ROUTES.SUBSCRIBE}?source=free-assessment`)}>
              Subscribe now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Free Operational Maturity Assessment Report</CardTitle>
                <CardDescription>
                  Indicative ESCO-facing maturity baseline for {context.organisationName || 'your organisation'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Overall score</p>
                <p className="text-3xl font-bold">{report.overallScore}/5</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Indicative level</p>
                <p className="text-3xl font-bold">{report.overallLevel}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Assessment basis</p>
                <p className="text-lg font-semibold">{assessmentQuestions.length} LDCS-aligned indicators</p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Executive summary</h2>
              <p className="leading-7 text-muted-foreground">{report.executiveSummary}</p>
            </section>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {report.domainResults.map((result) => (
            <Card key={result.domainId}>
              <CardHeader>
                <CardTitle>{result.domainName}</CardTitle>
                <CardDescription>
                  Score {result.score}/5 - {result.level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">{result.improvementParagraph}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-primary/30">
          <CardHeader>
            <CardTitle>How the Maturity Roadmap helps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-7 text-muted-foreground">{report.resilienceSummary}</p>
            <div className="flex flex-wrap gap-3 print:hidden">
              <Button asChild variant="outline">
                <Link to={ROUTES.HOME}>Main ISMS page</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={ROUTES.JOURNEY}>Subject knowledge and loss prevention philosophy</Link>
              </Button>
              <Button asChild>
                <Link to={`${ROUTES.SUBSCRIBE}?source=free-assessment`}>Sign up now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">Free Operational Maturity Assessment</h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Complete a short LDCS-aligned diagnostic across five maturity domains. The questions are phrased as operating-state choices so the assessment is harder to game than a simple compliance checklist.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assessment context</CardTitle>
          <CardDescription>This context appears in the printable report.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Organisation name</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2"
              value={context.organisationName}
              onChange={(event) => setContext((current) => ({ ...current, organisationName: event.target.value }))}
              placeholder="Example: Karowe Diamond Mine"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">Sector or operating context</span>
            <input
              className="w-full rounded-md border bg-background px-3 py-2"
              value={context.sector}
              onChange={(event) => setContext((current) => ({ ...current, sector: event.target.value }))}
            />
          </label>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Five LDCS maturity domains</CardTitle>
          <CardDescription>
            {completedCount} of {assessmentQuestions.length} questions answered ({completionPercentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          {domainQuestionCounts.map((domain) => (
            <div key={domain.id} className="rounded-lg border p-3">
              <p className="font-semibold">{domain.name}</p>
              <p className="text-sm text-muted-foreground">{domain.answered}/{domain.total} answered</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-5">
        {assessmentQuestions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardDescription>
                Question {index + 1} of {assessmentQuestions.length} - {question.mps}
              </CardDescription>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset className="grid gap-3">
                <legend className="sr-only">{question.question}</legend>
                {answerOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => updateAnswer(question.id, option.value)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold">{option.value}. {option.label}</span>
                      <span className="block text-sm text-muted-foreground">{option.descriptor}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Assessment progress: {completionPercentage}%</p>
            <p className="text-sm text-muted-foreground">Answer all indicators to generate the report.</p>
          </div>
          <Button disabled={!canSubmit} onClick={() => setShowReport(true)}>
            Generate report
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreeAssessment;
