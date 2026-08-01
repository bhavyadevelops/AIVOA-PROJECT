import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RiskSummary({ riskAssessment }: any) {
  if (!riskAssessment) return null;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <ShieldCheck className="w-4 h-4" /> Risk Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${riskAssessment.overallRisk?.toLowerCase() === 'high' ? 'bg-red-500' : riskAssessment.overallRisk?.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
          <span className="text-lg font-semibold text-slate-900">{riskAssessment.overallRisk}</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p className="font-medium text-slate-900 mb-2">Recommended actions</p>
          <ul className="space-y-2">
            {riskAssessment.recommendedActions?.map((action: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
