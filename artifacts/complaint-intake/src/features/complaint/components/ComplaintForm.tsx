import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Save, RotateCcw, AlertTriangle, Activity, ShieldCheck, ListChecks, CheckCircle2, Loader2 } from 'lucide-react';
import type { ComplaintFields, RiskAssessment } from '@workspace/api-client-react';

const FormField = ({ label, value, field, isAiGenerated, isVerified, onChange, multiline = false }: any) => {
  return (
    <div className="flex flex-col space-y-1.5 mb-2">
      <div className="flex justify-between items-center min-h-5">
        <label className="text-[13px] font-semibold text-slate-700 tracking-tight">{label}</label>
        {isVerified ? (
          <Badge variant="verified" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 pl-1.5 text-[10px] py-0">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </Badge>
        ) : isAiGenerated ? (
          <Badge variant="ai" className="bg-cyan-50 text-cyan-700 border-cyan-200 gap-1 pl-1.5 text-[10px] py-0">
            <Activity className="w-3 h-3" /> AI Generated
          </Badge>
        ) : null}
      </div>
      {multiline ? (
        <Textarea className="bg-white focus-visible:ring-primary shadow-sm min-h-25" value={value || ''} onChange={(e) => onChange(field, e.target.value)} />
      ) : (
        <Input className="bg-white focus-visible:ring-primary shadow-sm h-9" value={value || ''} onChange={(e) => onChange(field, e.target.value)} />
      )}
    </div>
  );
};

export function ComplaintForm({ complaint, riskAssessment, aiPopulatedFields, editedFields, onFieldChange, onSave, onReset, isSaving }: any) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-white z-10 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Complaint Form</h1>
          <p className="text-xs text-slate-500 mt-1">Review and verify extracted information before submission.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onReset} className="gap-2 text-slate-600">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="gap-2 shadow-md">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Record
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <ListChecks className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">General Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="Complaint Source" field="complaintSource" value={complaint.complaintSource} isAiGenerated={aiPopulatedFields.has('complaintSource')} isVerified={editedFields.has('complaintSource')} onChange={onFieldChange} />
              <FormField label="Complaint Date" field="complaintDate" value={complaint.complaintDate} isAiGenerated={aiPopulatedFields.has('complaintDate')} isVerified={editedFields.has('complaintDate')} onChange={onFieldChange} />
              <FormField label="Complaint Type" field="complaintType" value={complaint.complaintType} isAiGenerated={aiPopulatedFields.has('complaintType')} isVerified={editedFields.has('complaintType')} onChange={onFieldChange} />
              <FormField label="Customer Name" field="customerName" value={complaint.customerName} isAiGenerated={aiPopulatedFields.has('customerName')} isVerified={editedFields.has('customerName')} onChange={onFieldChange} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Product Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="Product Name" field="productName" value={complaint.productName} isAiGenerated={aiPopulatedFields.has('productName')} isVerified={editedFields.has('productName')} onChange={onFieldChange} />
              <FormField label="Strength" field="strength" value={complaint.strength} isAiGenerated={aiPopulatedFields.has('strength')} isVerified={editedFields.has('strength')} onChange={onFieldChange} />
              <FormField label="Batch Number" field="batch" value={complaint.batch} isAiGenerated={aiPopulatedFields.has('batch')} isVerified={editedFields.has('batch')} onChange={onFieldChange} />
              <FormField label="Quantity" field="quantity" value={complaint.quantity} isAiGenerated={aiPopulatedFields.has('quantity')} isVerified={editedFields.has('quantity')} onChange={onFieldChange} />
              <FormField label="Manufacturing Date" field="manufacturingDate" value={complaint.manufacturingDate} isAiGenerated={aiPopulatedFields.has('manufacturingDate')} isVerified={editedFields.has('manufacturingDate')} onChange={onFieldChange} />
              <FormField label="Expiry Date" field="expiryDate" value={complaint.expiryDate} isAiGenerated={aiPopulatedFields.has('expiryDate')} isVerified={editedFields.has('expiryDate')} onChange={onFieldChange} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Issue Description</h2>
            </div>
            <FormField label="Description" field="description" value={complaint.description} isAiGenerated={aiPopulatedFields.has('description')} isVerified={editedFields.has('description')} onChange={onFieldChange} multiline />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Classification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField label="Severity" field="severity" value={complaint.severity} isAiGenerated={aiPopulatedFields.has('severity')} isVerified={editedFields.has('severity')} onChange={onFieldChange} />
              <FormField label="Priority" field="priority" value={complaint.priority} isAiGenerated={aiPopulatedFields.has('priority')} isVerified={editedFields.has('priority')} onChange={onFieldChange} />
            </div>
          </section>

          {riskAssessment && (
            <div className="mt-8 border-t border-slate-200 pt-8 pb-12">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">AI Risk Assessment</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="bg-slate-50/50 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${riskAssessment.overallRisk?.toLowerCase() === 'high' ? 'bg-red-500' : riskAssessment.overallRisk?.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-green-500'} shadow-sm`} />
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{riskAssessment.overallRisk}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50/50 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-lg font-bold text-slate-800">{riskAssessment.confidenceNotes}</span>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Patient Safety Impact</h4>
                        <p className="text-slate-600 leading-relaxed">{riskAssessment.patientSafetyImpact}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Product Quality Impact</h4>
                        <p className="text-slate-600 leading-relaxed">{riskAssessment.productQualityImpact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 text-sm">
                    <h4 className="font-semibold text-slate-900 mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      {riskAssessment.recommendedActions?.map((action: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
