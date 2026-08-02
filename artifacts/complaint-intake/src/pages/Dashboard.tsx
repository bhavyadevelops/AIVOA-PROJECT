import React from 'react';
import { ComplaintForm } from '@/features/complaint/components/ComplaintForm';
import { IntakeAssistant } from '@/features/assistant/components/IntakeAssistant';
import { useComplaintForm } from '@/features/complaint/hooks/use-complaint-form';

export default function Dashboard() {
  const {
    complaint,
    riskAssessment,
    missingFields,
    aiPopulatedFields,
    editedFields,
    animatingFields,
    isExtracting,
    isSaving,
    handleFieldChange,
    handleExtract,
    handleSave,
    handleReset,
  } = useComplaintForm();

  return (
    <div className="flex flex-col lg:flex-row h-dvh w-full bg-[#f4f7f9] overflow-hidden">
      <div className="w-full lg:w-[60%] h-[50dvh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col relative z-10 shadow-sm">
        <ComplaintForm 
          complaint={complaint}
          aiPopulatedFields={aiPopulatedFields}
          editedFields={editedFields}
          animatingFields={animatingFields}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
        />
      </div>
      <div className="w-full lg:w-[40%] h-[50dvh] lg:h-full bg-slate-50 flex flex-col relative">
        <IntakeAssistant 
          onExtract={handleExtract}
          isExtracting={isExtracting}
          hasExtractedData={aiPopulatedFields.size > 0}
          missingFields={missingFields}
          complaint={complaint}
          riskAssessment={riskAssessment}
        />
      </div>
    </div>
  );
}
