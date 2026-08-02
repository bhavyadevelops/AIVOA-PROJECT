import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Save, RotateCcw, AlertTriangle, Activity, ListChecks, CheckCircle2, Loader2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import type { ComplaintFields } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FormField = ({ label, value, field, isAiGenerated, isVerified, isAnimating, onChange, multiline = false, isDateField = false }: any) => {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [open, setOpen] = React.useState(false);

  const getBorderClass = () => {
    if (isVerified) return 'border-emerald-300 focus-visible:ring-emerald-500';
    if (isAiGenerated) return 'border-cyan-300 focus-visible:ring-cyan-500';
    return 'border-slate-300 focus-visible:ring-primary';
  };

  const getBgClass = () => {
    if (isAnimating) return 'bg-cyan-100 animate-pulse';
    if (isVerified) return 'bg-emerald-50/30';
    if (isAiGenerated) return 'bg-cyan-50/30';
    return 'bg-white';
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange(field, selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    setOpen(false);
  };

  return (
    <div className={`flex flex-col space-y-1.5 ${isDateField ? 'mb-3' : 'mb-2'}`}>
      <div className="flex justify-between items-center min-h-5">
        <label className="text-[13px] font-semibold text-slate-700 tracking-tight">{label}</label>
        {isVerified ? (
          <Badge variant="verified" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 pl-1.5 text-[10px] py-0">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </Badge>
        ) : isAiGenerated ? (
          <Badge variant="ai" className="bg-cyan-50 text-cyan-700 border-cyan-200 gap-1 pl-1.5 text-[10px] py-0">
            <Activity className="w-3 h-3" /> AI
          </Badge>
        ) : null}
      </div>
      {multiline ? (
        <Textarea 
          className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm min-h-25 transition-all duration-500`} 
          value={value || ''} 
          onChange={(e) => onChange(field, e.target.value)} 
        />
      ) : isDateField ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm h-9 transition-all duration-500 w-full justify-start text-left font-normal`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString() : <span className="text-slate-400">Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input 
          className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm h-9 transition-all duration-500`} 
          value={value || ''} 
          onChange={(e) => onChange(field, e.target.value)} 
        />
      )}
    </div>
  );
};

export function ComplaintForm({ complaint, aiPopulatedFields, editedFields, animatingFields, onFieldChange, onSave, onReset, isSaving }: any) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-white z-10 shadow-sm shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Complaint Form</h1>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
              Pending Triage
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">Review and verify extracted information before submission.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onReset} className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="gap-2 shadow-md px-6 py-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Record
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 max-w-4xl mx-auto space-y-10 pb-20">
          <section>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <ListChecks className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">General Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField label="Complaint Source" field="complaintSource" value={complaint.complaintSource} isAiGenerated={aiPopulatedFields.has('complaintSource')} isVerified={editedFields.has('complaintSource')} isAnimating={animatingFields.has('complaintSource')} onChange={onFieldChange} />
              <FormField label="Customer Name" field="customerName" value={complaint.customerName} isAiGenerated={aiPopulatedFields.has('customerName')} isVerified={editedFields.has('customerName')} isAnimating={animatingFields.has('customerName')} onChange={onFieldChange} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Product Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField label="Product Name" field="productName" value={complaint.productName} isAiGenerated={aiPopulatedFields.has('productName')} isVerified={editedFields.has('productName')} isAnimating={animatingFields.has('productName')} onChange={onFieldChange} />
              <FormField label="Strength" field="strength" value={complaint.strength} isAiGenerated={aiPopulatedFields.has('strength')} isVerified={editedFields.has('strength')} isAnimating={animatingFields.has('strength')} onChange={onFieldChange} />
              <FormField label="Batch Number" field="batch" value={complaint.batch} isAiGenerated={aiPopulatedFields.has('batch')} isVerified={editedFields.has('batch')} isAnimating={animatingFields.has('batch')} onChange={onFieldChange} />
              <FormField label="Quantity" field="quantity" value={complaint.quantity} isAiGenerated={aiPopulatedFields.has('quantity')} isVerified={editedFields.has('quantity')} isAnimating={animatingFields.has('quantity')} onChange={onFieldChange} />
              <FormField label="Manufacturing Date" field="manufacturingDate" value={complaint.manufacturingDate} isAiGenerated={aiPopulatedFields.has('manufacturingDate')} isVerified={editedFields.has('manufacturingDate')} isAnimating={animatingFields.has('manufacturingDate')} onChange={onFieldChange} isDateField />
              <FormField label="Expiry Date" field="expiryDate" value={complaint.expiryDate} isAiGenerated={aiPopulatedFields.has('expiryDate')} isVerified={editedFields.has('expiryDate')} isAnimating={animatingFields.has('expiryDate')} onChange={onFieldChange} isDateField />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Issue Description</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField label="Complaint Type" field="complaintType" value={complaint.complaintType} isAiGenerated={aiPopulatedFields.has('complaintType')} isVerified={editedFields.has('complaintType')} isAnimating={animatingFields.has('complaintType')} onChange={onFieldChange} />
              <FormField label="Complaint Date" field="complaintDate" value={complaint.complaintDate} isAiGenerated={aiPopulatedFields.has('complaintDate')} isVerified={editedFields.has('complaintDate')} isAnimating={animatingFields.has('complaintDate')} onChange={onFieldChange} isDateField />
            </div>
            <div className="mt-5">
              <FormField label="Description" field="description" value={complaint.description} isAiGenerated={aiPopulatedFields.has('description')} isVerified={editedFields.has('description')} isAnimating={animatingFields.has('description')} onChange={onFieldChange} multiline />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-slate-800">Classification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField label="Initial Severity" field="severity" value={complaint.severity} isAiGenerated={aiPopulatedFields.has('severity')} isVerified={editedFields.has('severity')} isAnimating={animatingFields.has('severity')} onChange={onFieldChange} />
              <FormField label="Priority" field="priority" value={complaint.priority} isAiGenerated={aiPopulatedFields.has('priority')} isVerified={editedFields.has('priority')} isAnimating={animatingFields.has('priority')} onChange={onFieldChange} />
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
