import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useExtractComplaint, useCreateComplaint } from '@workspace/api-client-react';
import type { ComplaintFields, RiskAssessment } from '@workspace/api-client-react';

export function useComplaintForm() {
  const { toast } = useToast();
  const { mutate: extractComplaint, isPending: isExtracting } = useExtractComplaint();
  const { mutate: saveComplaint, isPending: isSaving } = useCreateComplaint();

  const [complaint, setComplaint] = useState<Partial<ComplaintFields>>({});
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [aiPopulatedFields, setAiPopulatedFields] = useState<Set<keyof ComplaintFields>>(new Set());
  const [editedFields, setEditedFields] = useState<Set<keyof ComplaintFields>>(new Set());

  const handleFieldChange = (field: keyof ComplaintFields, value: string) => {
    setComplaint((prev) => ({ ...prev, [field]: value }));
    if (aiPopulatedFields.has(field)) {
      setEditedFields((prev) => {
        const next = new Set(prev);
        next.add(field);
        return next;
      });
    }
  };

  const handleExtract = (text: string) => {
    extractComplaint(
      { data: { text } },
      {
        onSuccess: (result: { complaint: Partial<ComplaintFields>; riskAssessment: RiskAssessment | null; missingFields?: string[] }) => {
          setComplaint(result.complaint);
          setRiskAssessment(result.riskAssessment);
          setMissingFields(result.missingFields || []);

          const populated = new Set<keyof ComplaintFields>();
          (Object.keys(result.complaint) as Array<keyof ComplaintFields>).forEach((key) => {
            if (result.complaint[key]) populated.add(key);
          });
          setAiPopulatedFields(populated);
          setEditedFields(new Set());

          toast({ title: 'Extraction Complete', description: 'Complaint fields have been populated by AI.' });
        },
        onError: () => {
          toast({ title: 'Extraction Failed', description: 'Failed to extract complaint data.', variant: 'destructive' });
        },
      },
    );
  };

  const handleSave = () => {
    if (!complaint.customerName || !complaint.productName) {
      toast({ title: 'Validation Error', description: 'Customer Name and Product Name are required.', variant: 'destructive' });
      return;
    }

    saveComplaint(
      { data: { complaint: complaint as ComplaintFields, riskAssessment: riskAssessment! } },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Complaint saved successfully.' });
          handleReset();
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to save complaint.', variant: 'destructive' });
        },
      },
    );
  };

  const handleReset = () => {
    setComplaint({});
    setRiskAssessment(null);
    setMissingFields([]);
    setAiPopulatedFields(new Set());
    setEditedFields(new Set());
  };

  return {
    complaint,
    riskAssessment,
    missingFields,
    aiPopulatedFields,
    editedFields,
    isExtracting,
    isSaving,
    handleFieldChange,
    handleExtract,
    handleSave,
    handleReset,
  };
}
