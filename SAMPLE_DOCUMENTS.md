# Sample Pharmaceutical Complaint Documents

This directory contains sample pharmaceutical complaint documents for testing the AIVOA-CMS document extraction and AI processing features.

## Available Sample Documents

### 1. sample_pharmaceutical_complaint.txt
A text-based complaint from Apollo Pharmacy regarding discolored Amoxicylin capsules.

**Content:**
- Customer: Apollo Pharmacy
- Product: Amoxicylin Capsules 500 mg
- Batch: BMX24602
- Issue: Discolored capsules
- Quantity: 48 capsules
- Severity: High
- Priority: High

**Usage:** Upload this file via the AI assistant's drag-and-drop or file upload feature to test text document extraction.

### 2. sample_complaint.eml
An email format complaint from Metformin Laboratories regarding API quality issues.

**Content:**
- Customer: Metformin Laboratories
- Product: Metformin Hydrochloride API
- Grade: IP/BP
- Batch: MFH260712A
- Issue: Assay below specification (98.5% vs required 99.0-101.0%)
- Quantity: 50 kg in 2 HDPE drums
- Severity: High
- Priority: High

**Usage:** Upload this .eml file to test email extraction. The system will parse the email headers and extract the body content for AI processing.

### 3. sample_complaint_pdf_content.txt
This is the text content that would be in a PDF complaint from Regional Medical Center.

**Content:**
- Customer: Regional Medical Center
- Product: Metformin Hydrochloride API
- Grade: IP/BP
- Batch: CHG260712A
- Issue: Assay 97.8% (spec 99.0-101.0%), related substances 1.2% (spec ≤0.5%)
- Quantity: 50 kg in 2 HDPE drums
- Severity: High
- Priority: High

**Usage:** To create a PDF for testing:
1. Copy the content from this file
2. Paste into a document editor
3. Save as PDF
4. Upload the PDF to test PDF extraction

## Testing Scenarios

### Scenario 1: Log Complaint Tool (Text Input)
1. Copy the text from any sample document
2. Paste it into the AI assistant text input area
3. The system will auto-extract after 1.5 seconds or click "Extract Information"
4. Observe the form being populated with extracted data
5. Check the AI co-pilot risk assessment section

### Scenario 2: Document Extraction Tool (File Upload)
1. Upload any of the sample files (TXT, EML, or created PDF)
2. The system will automatically extract text and process it
3. Verify that all fields are correctly populated
4. Check the risk assessment and recommended actions

### Scenario 3: Edit Complaint Tool (Natural Language Editing)
1. After extracting a complaint, use the chat interface to edit
2. Try: "Sorry, the batch number is CHG260712A and affected quantity is 50 kg 2 HDPE drums"
3. Verify that the form updates with the new batch number and quantity
4. Check that the risk assessment is recalculated if needed

### Scenario 4: Sequential Editing
1. Extract initial complaint using sample data
2. Make first edit: "The batch number is BMX24602"
3. Make second edit: "The affected quantity is 48 capsules"
4. Verify that both edits are applied and previous data is preserved

## Expected Behavior

### AI Extraction Should:
- Extract all key fields: customer name, product name, strength, batch, dates, quantity
- Classify severity based on complaint content (High for safety/quality issues)
- Assign appropriate priority based on severity
- Generate comprehensive risk assessment
- Provide recommended actions based on complaint type

### Natural Language Editing Should:
- Parse correction statements like "the batch number is X"
- Update only the mentioned fields
- Preserve all other complaint information
- Recalculate risk assessment if severity/priority changes
- Provide explanation of what was updated

### Document Processing Should:
- Handle TXT files directly
- Parse EML files and extract email body
- Extract text from PDF files
- Process DOCX files
- Handle various encodings (UTF-8, Latin-1)

## Troubleshooting

If document extraction fails:
1. Check that the file is one of the supported types (.txt, .eml, .csv, .pdf, .docx)
2. Ensure file size is under 10MB
3. Verify the backend server is running
4. Check that GROQ_API_KEY is configured in backend/.env

If natural language editing doesn't work:
1. Ensure you have extracted data first
2. Use clear correction phrases like "the batch number is X"
3. Check that the backend edit endpoint is accessible
4. Verify the AI model is responding correctly

## Custom Sample Creation

To create your own test documents:

1. **Text Files:** Simply create a .txt file with complaint details in any format
2. **Email Files:** Create .eml files with proper email headers and body
3. **PDF Files:** Use any document editor to create a PDF with complaint information
4. **Word Documents:** Create .docx files with structured complaint data

The AI system is designed to handle various document formats and extract relevant pharmaceutical complaint information.