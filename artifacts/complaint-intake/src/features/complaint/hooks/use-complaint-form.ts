import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  extractComplaint,
  saveComplaint,
  editComplaint,
  setComplaint,
  setRiskAssessment,
  setAiPopulatedFields,
  setEditedFields,
  setAnimatingFields,
  addEditedField,
  addAnimatingField,
  removeAnimatingField,
  reset,
  clearError,
} from '@/store/complaintSlice';
import type { ComplaintFields, RiskAssessment } from '@/store/complaintSlice';

export function useComplaintForm() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    complaint,
    riskAssessment,
    missingFields,
    aiPopulatedFields,
    editedFields,
    animatingFields,
    isExtracting,
    isSaving,
    error,
  } = useSelector((state: RootState) => state.complaint);

  const handleFieldChange = (field: keyof ComplaintFields, value: string) => {
    dispatch(setComplaint({ [field]: value }));
    if (aiPopulatedFields.includes(field)) {
      dispatch(addEditedField(field));
    }
  };

  const animateFieldPopulation = useCallback((fields: Array<keyof ComplaintFields>) => {
    fields.forEach((field, index) => {
      setTimeout(() => {
        dispatch(addAnimatingField(field));
        
        setTimeout(() => {
          dispatch(removeAnimatingField(field));
        }, 500);
      }, index * 100);
    });
  }, [dispatch]);

  const handleExtract = (text: string, documentName?: string, documentType?: string, file?: File) => {
    // For PDF/DOCX files, pass the file directly; for text files, pass the text
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      dispatch(extractComplaint({ text: '', documentName: file.name, documentType: file.name.split('.').pop(), file }))
        .unwrap()
        .then((result) => {
          animateFieldPopulation(Object.keys(result.complaint) as Array<keyof ComplaintFields>);
          toast({ title: 'Extraction Complete', description: 'Complaint fields have been populated by AI.' });
        })
        .catch((err) => {
          console.error('Extraction error:', err);
          if (err?.response?.status === 503) {
            toast({ 
              title: 'Service Unavailable', 
              description: 'AI service is temporarily unavailable. Please try again later.', 
              variant: 'destructive' 
            });
          } else if (err?.response?.status === 401) {
            toast({ 
              title: 'Authentication Error', 
              description: 'Invalid API key configuration.', 
              variant: 'destructive' 
            });
          } else if (err?.code === 'ECONNREFUSED' || err?.code === 'NETWORK_ERROR') {
            toast({ 
              title: 'Connection Error', 
              description: 'Unable to connect to the server. Please check your connection.', 
              variant: 'destructive' 
            });
          } else {
            toast({ 
              title: 'Extraction Failed', 
              description: err?.message || 'Failed to extract complaint data.', 
              variant: 'destructive' 
            });
          }
        });
    } else {
      dispatch(extractComplaint({ text, documentName, documentType }))
        .unwrap()
        .then((result) => {
          animateFieldPopulation(Object.keys(result.complaint) as Array<keyof ComplaintFields>);
          toast({ title: 'Extraction Complete', description: 'Complaint fields have been populated by AI.' });
        })
        .catch((err) => {
          console.error('Extraction error:', err);
          if (err?.response?.status === 503) {
            toast({ 
              title: 'Service Unavailable', 
              description: 'AI service is temporarily unavailable. Please try again later.', 
              variant: 'destructive' 
            });
          } else if (err?.response?.status === 401) {
            toast({ 
              title: 'Authentication Error', 
              description: 'Invalid API key configuration.', 
              variant: 'destructive' 
            });
          } else if (err?.code === 'ECONNREFUSED' || err?.code === 'NETWORK_ERROR') {
            toast({ 
              title: 'Connection Error', 
              description: 'Unable to connect to the server. Please check your connection.', 
              variant: 'destructive' 
            });
          } else {
            toast({ 
              title: 'Extraction Failed', 
              description: err?.message || 'Failed to extract complaint data.', 
              variant: 'destructive' 
            });
          }
        });
    }
  };

  const handleSave = () => {
    if (!complaint.customerName || !complaint.productName) {
      toast({ title: 'Validation Error', description: 'Customer Name and Product Name are required.', variant: 'destructive' });
      return;
    }

    dispatch(saveComplaint({ complaint: complaint as ComplaintFields, riskAssessment: riskAssessment! }))
      .unwrap()
      .then(() => {
        toast({ title: 'Success', description: 'Complaint saved successfully.' });
        dispatch(reset());
      })
      .catch((err) => {
        console.error('Save error:', err);
        if (err?.response?.status === 503) {
          toast({ 
            title: 'Service Unavailable', 
            description: 'Database service is temporarily unavailable. Please try again later.', 
            variant: 'destructive' 
          });
        } else if (err?.code === 'ECONNREFUSED' || err?.code === 'NETWORK_ERROR') {
          toast({ 
            title: 'Connection Error', 
            description: 'Unable to connect to the server. Please check your connection.', 
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Error', 
            description: err?.message || 'Failed to save complaint.', 
            variant: 'destructive' 
          });
        }
      });
  };

  const handleReset = () => {
    dispatch(reset());
  };

  const handleEdit = (editMessage: string) => {
    dispatch(editComplaint({ complaint: complaint as ComplaintFields, editMessage }))
      .unwrap()
      .then((result) => {
        animateFieldPopulation(Object.keys(result.updatedComplaint) as Array<keyof ComplaintFields>);
        toast({ title: 'Edit Complete', description: result.explanation });
      })
      .catch((err) => {
        console.error('Edit error:', err);
        toast({ 
          title: 'Edit Failed', 
          description: err?.message || 'Failed to edit complaint data.', 
          variant: 'destructive' 
        });
      });
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error, dispatch]);

  return {
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
    handleEdit,
  };
}
