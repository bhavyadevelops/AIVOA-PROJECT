import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Bot, Sparkles, Send, MessageCircle, Loader2, CheckCircle2, Upload, AlertTriangle, ShieldCheck, Activity, Clock, FileText, X } from 'lucide-react';
import type { ComplaintFields, RiskAssessment } from '@/types';

interface IntakeAssistantProps {
  onExtract: (text: string, documentName?: string, documentType?: string, file?: File) => void;
  isExtracting: boolean;
  hasExtractedData: boolean;
  missingFields: string[];
  complaint: Partial<ComplaintFields>;
  riskAssessment: RiskAssessment | null;
}

const EXTRACTION_STAGES = [
  'Parsing Input',
  'Extracting Fields',
  'Classifying Risk',
  'Generating Summary',
  'Checking Completeness',
  'Finalizing',
];

const COPILOT_SUGGESTIONS = [
  'Summarize Complaint',
  'Explain Severity',
  'Why High Priority?',
  'Recommend Next Steps',
];

export function IntakeAssistant({ onExtract, isExtracting, hasExtractedData, missingFields, complaint, riskAssessment }: IntakeAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [lastChatResponse, setLastChatResponse] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtract = () => {
    if (!inputText.trim() && !file) {
      alert('Please enter complaint text or upload a file');
      return;
    }
    
    // Validate text length (prevent extremely large inputs)
    if (inputText.length > 100000) {
      alert('Text is too long. Please provide a shorter text or split into multiple files.');
      return;
    }
    
    simulateProgress();
    
    // Pass everything to the parent component to handle via Redux
    onExtract(inputText, file?.name, file?.name.split('.').pop(), file || undefined);
  };

  const simulateProgress = () => {
    setCurrentStage(0);
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= EXTRACTION_STAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setIsChatting(true);
    
    // Simulate chat response
    setTimeout(() => {
      setLastChatResponse(`Based on the complaint analysis, here's my assessment: The customer reported ${complaint.description || 'an issue'} with ${complaint.productName || 'a product'}. The risk level is ${riskAssessment?.overallRisk || 'being assessed'}.`);
      setIsChatting(false);
      setChatInput('');
    }, 1500);
  };

  const handleSuggestion = (suggestion: string) => {
    setChatInput(suggestion);
    handleChatSend();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }

      // Validate file type
      const allowedTypes = ['.txt', '.eml', '.csv', '.pdf', '.docx'];
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert('Unsupported file type. Please upload TXT, EML, CSV, PDF, or DOCX files.');
        return;
      }

      setFile(selectedFile);
      // For text files, read directly; for PDF/DOCX, will be sent to backend
      if (['.txt', '.eml', '.csv'].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setInputText(text);
        };
        reader.onerror = () => {
          console.error('Error reading file');
          alert('Error reading file. Please try again.');
        };
        reader.readAsText(selectedFile);
      } else {
        // For PDF/DOCX, just show the file name and let backend handle extraction
        setInputText(`File uploaded: ${selectedFile.name}`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Simulate file upload
      const event = { target: { files: [droppedFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setInputText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-slate-900">AI Intake Assistant</h2>
      </div>

      {/* Upload/Input Section */}
      {!hasExtractedData && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Upload Complaint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="flex items-center gap-3"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                accept=".txt,.eml,.csv,.pdf,.docx"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 cursor-pointer" 
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
              {file && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4" />
                  {file.name}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={handleCancelFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <div 
              className="relative border-2 border-dashed border-slate-300 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste complaint text here or upload a file..."
                className="min-h-32 resize-none border-0 focus-visible:ring-0"
              />
            </div>
            <Button 
              onClick={handleExtract} 
              disabled={isExtracting || !inputText.trim()} 
              className="w-full gap-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Extract Information
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress Stages */}
      {isExtracting && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={(currentStage / (EXTRACTION_STAGES.length - 1)) * 100} className="h-1.5" />
            <div className="space-y-2">
              {EXTRACTION_STAGES.map((stage, index) => (
                <div
                  key={stage}
                  className={`flex items-center gap-2 text-sm ${
                    index <= currentStage ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {index < currentStage ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : index === currentStage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {stage}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Copilot Risk Assessment Panel */}
      {hasExtractedData && riskAssessment && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              AI Copilot Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Risk */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-slate-700">Overall Risk</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  riskAssessment.overallRisk?.toLowerCase() === 'high' ? 'bg-red-500' :
                  riskAssessment.overallRisk?.toLowerCase() === 'medium' ? 'bg-amber-500' :
                  'bg-green-500'
                }`} />
                <span className="text-lg font-bold text-slate-900">{riskAssessment.overallRisk}</span>
              </div>
            </div>

            {/* Rationales */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Severity Reason</span>
                </div>
                <p className="text-sm text-slate-600">{riskAssessment.severityReason || 'Not provided'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Priority Reason</span>
                </div>
                <p className="text-sm text-slate-600">{riskAssessment.priorityReason || 'Not provided'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Patient Safety</span>
                </div>
                <p className="text-sm text-slate-600">{riskAssessment.patientSafety || 'Not provided'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">Product Quality</span>
                </div>
                <p className="text-sm text-slate-600">{riskAssessment.productQuality || 'Not provided'}</p>
              </div>
            </div>

            {/* Recommended Actions */}
            {riskAssessment.recommendedActions && riskAssessment.recommendedActions.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700">Recommended Actions</span>
                </div>
                <ul className="space-y-1">
                  {riskAssessment.recommendedActions.map((action, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence Notes */}
            {riskAssessment.confidenceNotes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Confidence Notes</span>
                </div>
                <p className="text-sm text-slate-600">{riskAssessment.confidenceNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State for Risk Assessment */}
      {hasExtractedData && !riskAssessment && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              AI Copilot Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Risk assessment will be available after extraction completes.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Section */}
      {hasExtractedData && (
        <Card className="border-slate-200 shadow-sm mt-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Copilot Suggestions */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4" />
                Suggested prompts
              </div>
              <div className="flex flex-wrap gap-2">
                {COPILOT_SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="space-y-3">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask the assistant about this complaint..."
                className="min-h-20 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleChatSend}
                  disabled={isChatting || !chatInput.trim()}
                  size="sm"
                  className="gap-2"
                >
                  {isChatting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Chat Response */}
            {lastChatResponse && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Response
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{lastChatResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
