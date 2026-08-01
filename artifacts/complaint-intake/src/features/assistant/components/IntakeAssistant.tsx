import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, Send, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function IntakeAssistant({ chatInput, setChatInput, isChatting, lastChatResponse, onSend, onSuggest }: any) {
  return (
    <div className="space-y-5">
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5" /> AI Intake Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2 text-sm text-slate-200">
              <Sparkles className="w-4 h-4" /> Suggested follow-ups
            </div>
            <div className="flex flex-wrap gap-2">
              {['Ask for batch details', 'Summarize complaint severity', 'Request customer contact info'].map((tip) => (
                <Button key={tip} variant="secondary" size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/10" onClick={() => onSuggest(tip)}>
                  {tip}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask the assistant to help review the complaint..." className="min-h-24 bg-white/10 border-white/10 text-white placeholder:text-slate-300" />
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-300">Use the assistant to gather missing context or clarify risk details.</div>
              <Button onClick={onSend} disabled={isChatting} className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                {isChatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {lastChatResponse && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-slate-800">
              <MessageCircle className="w-4 h-4" /> Assistant Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">Live</Badge>
              <span className="text-xs text-slate-500">The latest AI guidance generated for this complaint</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm leading-6 text-slate-700">
              {lastChatResponse}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
