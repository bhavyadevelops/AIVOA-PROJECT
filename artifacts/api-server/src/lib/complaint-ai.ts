/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type ComplaintSeverity =
  | "Critical"
  | "Major"
  | "Minor"
  | "";

export type ComplaintPriority =
  | "High"
  | "Medium"
  | "Low"
  | "";

export type OverallRisk =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

export interface Complaint {
  complaintSource: string;
  customerName: string;

  productName: string;
  productStrengthGrade: string;
  batchLotNumber: string;

  manufacturingDate: string;
  expiryDate: string;
  quantityAffectedKg: string;

  complaintType: string;
  complaintDate: string;

  detailedComplaintDescription: string;

  initialSeverity: ComplaintSeverity;
  priority: ComplaintPriority;
}

export interface RiskAssessment {
  overallRisk: OverallRisk;

  severityRationale: string;

  priorityRationale: string;

  patientSafetyImpact: string;

  productQualityImpact: string;

  recommendedActions: string[];

  confidenceNotes: string;

  completenessWarnings: string[];
}

export interface SimilarComplaint {
  complaintId: string;
  productName: string;
  batchLotNumber: string;
  complaintType: string;
  similarity: number;
}

export type FieldSource =
  | "ai"
  | "regex"
  | "user"
  | "default";

export type FieldSourceMap = {
  [K in keyof Complaint]: FieldSource;
};

export interface AIComplaintResult {
  complaint: Complaint;

  risk: RiskAssessment;

  confidence: number;

  missingFields: string[];

  fieldSources: FieldSourceMap;

  similarComplaint?: SimilarComplaint | null;

  processingSteps: string[];
}

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_COMPLAINT: Complaint = {
  complaintSource: "",
  customerName: "",

  productName: "",
  productStrengthGrade: "",
  batchLotNumber: "",

  manufacturingDate: "",
  expiryDate: "",
  quantityAffectedKg: "",

  complaintType: "",
  complaintDate: "",

  detailedComplaintDescription: "",

  initialSeverity: "",
  priority: "",
};

export const REQUIRED_FIELDS: (keyof Complaint)[] = [
  "customerName",
  "productName",
  "productStrengthGrade",
  "batchLotNumber",
  "manufacturingDate",
  "expiryDate",
  "quantityAffectedKg",
  "complaintType",
  "detailedComplaintDescription",
];

export const AI_STEPS = [
  "Reading complaint...",
  "Extracting structured fields...",
  "Recovering missing information...",
  "Assessing quality risk...",
  "Checking complaint completeness...",
  "Looking for similar complaints...",
  "Ready for QA review.",
] as const;

export const COMPLAINT_TYPES = [
  "Packaging Integrity",
  "Product Quality",
  "Contamination",
  "Labeling Error",
  "Foreign Matter",
  "Delivery Issue",
  "Documentation Issue",
  "Customer Complaint",
] as const;

export const SEVERITY_ACTIONS = {
  Critical: [
    "Quarantine affected batch immediately",
    "Escalate to Quality Assurance",
    "Assess distribution and patient exposure",
  ],

  Major: [
    "Initiate quality investigation",
    "Review batch manufacturing records",
    "Request photographs or retained samples",
  ],

  Minor: [
    "Collect additional complaint details",
    "Complete routine quality review",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*                               REGEX LIBRARY                                */
/* -------------------------------------------------------------------------- */

type RegexDefinition = {
  patterns: RegExp[];
  transform?: (value: string) => string;
};

export const REGEX_LIBRARY: Record<
  keyof Omit<
    Complaint,
    "initialSeverity" | "priority"
  >,
  RegexDefinition
> = {
  complaintSource: {
    patterns: [
      /(?:complaint\s*source|source)\s*[:\-]\s*(.+)/i,
      /(?:received\s*via)\s*[:\-]\s*(.+)/i,
    ],
  },

  customerName: {
    patterns: [
      /customer(?:\s*name)?\s*[:\-]\s*(.+)/i,
      /client(?:\s*name)?\s*[:\-]\s*(.+)/i,
      /from\s*[:\-]\s*(.+)/i,
    ],
  },

  productName: {
    patterns: [
      /product(?:\s*name)?\s*[:\-]\s*(.+)/i,
      /material(?:\s*name)?\s*[:\-]\s*(.+)/i,
      /affected\s*product(?:\s*is)?\s*[:\-]?\s*(.+)/i,
    ],
  },

  productStrengthGrade: {
    patterns: [
      /strength\s*[:\-]\s*(.+)/i,
      /grade\s*[:\-]\s*(.+)/i,
      /dosage\s*[:\-]\s*(.+)/i,
      /dose\s*[:\-]\s*(.+)/i,
      /concentration\s*[:\-]\s*(.+)/i,
    ],
  },

  batchLotNumber: {
    patterns: [
      /batch(?:\s*number|\s*no\.?)?\s*[:#\-]?\s*([A-Z0-9\-\/]+)/i,
      /lot(?:\s*number|\s*no\.?)?\s*[:#\-]?\s*([A-Z0-9\-\/]+)/i,
      /batch\s*id\s*[:\-]?\s*([A-Z0-9\-\/]+)/i,
    ],
  },

  manufacturingDate: {
    patterns: [
      /manufacturing\s*date\s*[:\-]\s*(.+)/i,
      /manufactured\s*on\s*[:\-]\s*(.+)/i,
      /mfg(?:\s*date)?\s*[:\-]\s*(.+)/i,
      /mfd(?:\s*date)?\s*[:\-]\s*(.+)/i,
    ],
  },

  expiryDate: {
    patterns: [
      /expiry(?:\s*date)?\s*[:\-]\s*(.+)/i,
      /expiration(?:\s*date)?\s*[:\-]\s*(.+)/i,
      /exp(?:\s*date)?\s*[:\-]\s*(.+)/i,
      /expires?\s*on\s*[:\-]?\s*(.+)/i,
    ],
  },

  quantityAffectedKg: {
    patterns: [
      /quantity(?:\s*affected)?\s*[:\-]\s*([0-9.,]+\s*(?:kg|g)?)/i,
      /affected\s*quantity\s*[:\-]\s*([0-9.,]+\s*(?:kg|g)?)/i,
      /qty\s*[:\-]\s*([0-9.,]+\s*(?:kg|g)?)/i,
    ],
  },

  complaintType: {
    patterns: [
      /complaint\s*type\s*[:\-]\s*(.+)/i,
      /issue\s*type\s*[:\-]\s*(.+)/i,
    ],
  },

  complaintDate: {
    patterns: [
      /complaint\s*date\s*[:\-]\s*(.+)/i,
      /reported\s*on\s*[:\-]\s*(.+)/i,
      /date\s*received\s*[:\-]\s*(.+)/i,
    ],
  },

  detailedComplaintDescription: {
    patterns: [
      /description\s*[:\-]\s*([\s\S]+)/i,
      /complaint\s*details\s*[:\-]\s*([\s\S]+)/i,
      /issue\s*description\s*[:\-]\s*([\s\S]+)/i,
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function cleanValue(value: string): string {
  return value
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .trim();
}

function findFirstMatch(
  text: string,
  definition: RegexDefinition
): string {
  for (const pattern of definition.patterns) {
    const match = text.match(pattern);

    if (!match?.[1]) continue;

    let value = cleanValue(match[1]);

    if (definition.transform) {
      value = definition.transform(value);
    }

    if (value.length > 0) {
      return value;
    }
  }

  return "";
}

function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
}

function deepCloneComplaint(): Complaint {
  return structuredClone(DEFAULT_COMPLAINT);
}

function safeMergeComplaint(
  base: Complaint,
  incoming: Partial<Complaint>,
  sources: FieldSourceMap,
  source: FieldSource
): Complaint {

  const merged = structuredClone(base);

  for (const key of Object.keys(incoming) as (keyof Complaint)[]) {

    const value = incoming[key];

    if (isEmpty(value)) continue;

    if (isEmpty(merged[key])) {

      merged[key] = value as never;

      sources[key] = source;
    }
  }

  return merged;
}

/* -------------------------------------------------------------------------- */
/*                         AI EXTRACTION VALIDATION                           */
/* -------------------------------------------------------------------------- */

function validateExtraction(
  extracted: Partial<Complaint>
): Partial<Complaint> {

  const validated: Partial<Complaint> = {};

  const allowedSeverity: ComplaintSeverity[] = [
    "",
    "Critical",
    "Major",
    "Minor",
  ];

  const allowedPriority: ComplaintPriority[] = [
    "",
    "High",
    "Medium",
    "Low",
  ];

  for (const key of Object.keys(extracted) as (keyof Complaint)[]) {

    let value = extracted[key];

    if (typeof value !== "string") {
      continue;
    }

    value = cleanValue(value);

    switch (key) {

      case "initialSeverity":

        if (allowedSeverity.includes(value as ComplaintSeverity)) {
          validated[key] = value as Complaint[typeof key];
        }

        break;

      case "priority":

        if (allowedPriority.includes(value as ComplaintPriority)) {
          validated[key] = value as Complaint[typeof key];
        }

        break;

      case "quantityAffectedKg":

        value = value
          .replace(",", ".")
          .replace(/\s+/g, " ");

        validated[key] = value as Complaint[typeof key];

        break;

      case "manufacturingDate":
      case "expiryDate":
      case "complaintDate":

        validated[key] = value as Complaint[typeof key];

        break;

      default:

        validated[key] = value as Complaint[typeof key];
    }
  }

  return validated;
}

/* -------------------------------------------------------------------------- */
/*                    COMPATIBILITY HELPERS FOR API ROUTES                   */
/* -------------------------------------------------------------------------- */

type RouteComplaint = {
  complaintSource: string;
  customerName: string;
  productName: string;
  strength: string;
  batch: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: string;
  complaintType: string;
  complaintDate: string;
  description: string;
  severity: string;
  priority: string;
};

type RouteRiskAssessment = {
  overallRisk: string;
  severityRationale: string;
  priorityRationale: string;
  patientSafetyImpact: string;
  productQualityImpact: string;
  recommendedActions: string[];
  confidenceNotes: string;
  explanation: string[];
};

function findValue(text: string, patterns: RegExp[]): string {
  return patterns
    .map((pattern) => text.match(pattern)?.[1]?.trim())
    .find(Boolean) ?? "";
}

export function extractLocally(text: string): RouteComplaint {
  const lower = text.toLowerCase();
  const complaint: RouteComplaint = {
    complaintSource: /email|mail/.test(lower) ? "Email" : "Customer submission",
    customerName: findValue(text, [
      /customer(?:\s*name)?\s*[:\-]\s*([^\n]+)/i,
      /from\s*[:\-]\s*([^\n<]+)/i,
    ]),
    productName: findValue(text, [
      /(?:product|material)\s*(?:name)?\s*[:\-]\s*([^\n]+)/i,
    ]),
    strength: findValue(text, [/(?:strength|grade)\s*[:\-]\s*([^\n]+)/i]),
    batch: findValue(text, [/(?:batch|lot)(?:\s*number)?\s*[:#\-]\s*([A-Z0-9\-]+)/i]),
    manufacturingDate: findValue(text, [/(?:manufactur(?:ing|ed)\s*date)\s*[:\-]\s*([^\n]+)/i]),
    expiryDate: findValue(text, [/(?:expiry|expiration|exp)\s*(?:date)?\s*[:\-]\s*([^\n]+)/i]),
    quantity: findValue(text, [/(?:quantity|affected)\s*(?:\(kg\))?\s*[:\-]\s*([0-9.,]+\s*(?:kg)?)/i]),
    complaintType: /seal|package|container|leak/.test(lower)
      ? "Packaging Integrity"
      : /quality|impurit|particl|discolor/.test(lower)
        ? "Product Quality"
        : "Customer Complaint",
    complaintDate: new Date().toISOString().slice(0, 10),
    description: text.trim(),
    severity: "Minor",
    priority: "Low",
  };

  const critical = /contamin|foreign particle|adverse|patient/.test(lower);
  const major = /damaged|crack|defect|packag|discolor|out.?of.?spec/.test(lower);
  complaint.severity = critical ? "Critical" : major ? "Major" : "Minor";
  complaint.priority = critical ? "Urgent" : major ? "High" : "Low";

  return complaint;
}

export async function enrichWithGroq(
  text: string,
  fallback: RouteComplaint,
): Promise<RouteComplaint> {
  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  try {
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Extract pharmaceutical complaint fields. Return only JSON with these string keys: complaintSource, customerName, productName, strength, batch, manufacturingDate, expiryDate, quantity, complaintType, complaintDate, description. Use empty strings when unknown.",
        },
        { role: "user", content: text },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return fallback;
    }

    const extracted = JSON.parse(content) as Partial<RouteComplaint>;
    return {
      ...fallback,
      ...Object.fromEntries(
        Object.entries(extracted).filter(
          ([, value]) => typeof value === "string" && value.trim() !== "",
        ),
      ),
    } as RouteComplaint;
  } catch (error) {
    console.error("Groq enrichment failed:", error);
    return fallback;
  }
}

export function assessRisk(complaint: RouteComplaint): RouteRiskAssessment {
  const severe = complaint.severity === "Critical";
  const major = complaint.severity === "Major";
  const detected = severe
    ? "Potential contamination or patient-impact language"
    : major
      ? "Packaging or product quality defect"
      : "Customer-reported quality concern";

  return {
    overallRisk: severe ? "High" : major ? "Medium" : "Low",
    severityRationale: severe
      ? "Complaint signals a credible potential patient safety impact and requires immediate evaluation."
      : major
        ? "The reported defect could affect product integrity and should be triaged promptly."
        : "Available details indicate a limited quality concern with no stated patient impact.",
    priorityRationale: severe
      ? "Urgent review is required to protect patients and preserve affected product."
      : major
        ? "High-priority quality review is recommended before further distribution decisions."
        : "Routine quality triage is appropriate with follow-up for missing context.",
    patientSafetyImpact: severe
      ? "Potential patient safety impact — hold and assess affected material."
      : major
        ? "No confirmed patient harm; product integrity concern requires evaluation."
        : "No patient safety impact identified from the submitted information.",
    productQualityImpact: severe || major
      ? "Potential impact to product quality and packaging integrity."
      : "Limited product quality impact identified from the submitted information.",
    recommendedActions: severe
      ? [
          "Quarantine affected batch immediately",
          "Escalate to Quality Assurance",
          "Assess distribution and patient exposure",
        ]
      : major
        ? [
            "Open quality assessment",
            "Review batch and packaging records",
            "Request supporting photographs or samples",
          ]
        : [
            "Confirm missing complaint details",
            "Complete routine quality review",
          ],
    confidenceNotes:
      "Assessment is generated from the supplied complaint text. Verify all fields and conclusions before disposition.",
    explanation: [detected, complaint.complaintType, severe ? "Potential Patient Risk" : "Quality Evaluation Required", `Severity ${complaint.severity}`],
  };
}

/* -------------------------------------------------------------------------- */
/*                            GROQ AI EXTRACTION                              */
/* -------------------------------------------------------------------------- */

export async function extractWithGroq(
  text: string
): Promise<Partial<Complaint>> {

  if (!process.env.GROQ_API_KEY) {
    return {};
  }

  try {

    const { default: Groq } = await import("groq-sdk");

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion =
      await groq.chat.completions.create({

        model: "gemma2-9b-it",

        temperature: 0,

        response_format: {
          type: "json_object",
        },

        messages: [

          {
            role: "system",

            content: `
You are an AI Quality Management assistant for a pharmaceutical manufacturer.

Your job is to extract structured complaint information.

Return ONLY valid JSON.

Never explain.

Never use markdown.

Never invent missing values.

Unknown values must be "".

Recognize equivalent terminology.

Examples

Batch Number
Batch No.
Batch ID
Lot
Lot Number
Lot No.

Manufacturing Date
Manufactured On
MFG
MFD

Expiry Date
Expiration Date
EXP
Expires On

Strength
Dosage
Dose
Grade
Concentration

Quantity
Qty
Affected Quantity

Return ONLY these keys:

{
"complaintSource":"",
"customerName":"",
"productName":"",
"productStrengthGrade":"",
"batchLotNumber":"",
"manufacturingDate":"",
"expiryDate":"",
"quantityAffectedKg":"",
"complaintType":"",
"complaintDate":"",
"detailedComplaintDescription":"",
"initialSeverity":"",
"priority":""
}

Do not add extra keys.
`,
          },

          {
            role: "user",
            content: text,
          },
        ],
      });

    const content =
      completion.choices[0]?.message?.content;

    if (!content) {
      return {};
    }

    const parsed =
      JSON.parse(content) as Partial<Complaint>;

    return validateExtraction(parsed);

  } catch (error) {

    console.error(
      "Groq extraction failed:",
      error
    );

    return {};
  }
}

/* -------------------------------------------------------------------------- */
/*                           REGEX RECOVERY ENGINE                            */
/* -------------------------------------------------------------------------- */

export function regexRecovery(
  text: string,
  complaint: Complaint,
  fieldSources: FieldSourceMap
): Complaint {

  const recovered: Partial<Complaint> = {};

  for (const key of Object.keys(REGEX_LIBRARY) as (keyof typeof REGEX_LIBRARY)[]) {

    // Skip fields already populated by AI

    if (!isEmpty(complaint[key])) {
      continue;
    }

    const value = findFirstMatch(
      text,
      REGEX_LIBRARY[key]
    );

    if (!value) {
      continue;
    }

    recovered[key] = value as never;
  }

  return safeMergeComplaint(
    complaint,
    recovered,
    fieldSources,
    "regex"
  );
}

/* -------------------------------------------------------------------------- */
/*                            RISK CLASSIFICATION                             */
/* -------------------------------------------------------------------------- */

export function classifyRisk(
  complaint: Complaint
): RiskAssessment {

  const text = [
    complaint.complaintType,
    complaint.detailedComplaintDescription,
  ]
    .join(" ")
    .toLowerCase();

  /* --------------------------- Critical --------------------------- */

  const critical =
    /contamin/i.test(text) ||
    /foreign\s*matter/i.test(text) ||
    /foreign\s*particle/i.test(text) ||
    /wrong\s*label/i.test(text) ||
    /mix.?up/i.test(text) ||
    /patient/i.test(text) ||
    /adverse/i.test(text);

  /* ----------------------------- Major ---------------------------- */

  const major =
    /broken\s*seal/i.test(text) ||
    /tamper/i.test(text) ||
    /package/i.test(text) ||
    /packaging/i.test(text) ||
    /crack/i.test(text) ||
    /leak/i.test(text) ||
    /discolor/i.test(text) ||
    /out.?of.?spec/i.test(text) ||
    /failed\s*assay/i.test(text);

  let severity: ComplaintSeverity;
  let priority: ComplaintPriority;
  let overallRisk: OverallRisk;

  if (critical) {
    severity = "Critical";
    priority = "High";
    overallRisk = "Critical";
  }
  else if (major) {
    severity = "Major";
    priority = "High";
    overallRisk = "High";
  }
  else {
    severity = "Minor";
    priority = "Low";
    overallRisk = "Low";
  }

  complaint.initialSeverity = severity;
  complaint.priority = priority;

  return {

    overallRisk,

    severityRationale:
      severity === "Critical"
        ? "Potential patient safety impact or product contamination detected."
        : severity === "Major"
        ? "Product integrity or pharmaceutical quality may be compromised."
        : "Limited quality concern identified from available complaint information.",

    priorityRationale:
      priority === "High"
        ? "Immediate QA review is recommended before further product disposition."
        : "Routine quality triage is appropriate.",

    patientSafetyImpact:
      severity === "Critical"
        ? "Potential patient safety impact."
        : severity === "Major"
        ? "No confirmed patient harm, but product integrity requires evaluation."
        : "No patient safety impact identified.",

    productQualityImpact:
      severity === "Critical" || severity === "Major"
        ? "Potential impact to pharmaceutical product quality."
        : "Limited quality impact.",

    recommendedActions:
      [...SEVERITY_ACTIONS[severity]],

    confidenceNotes:
      "This assessment is generated from complaint information and should be verified by Quality Assurance.",

    completenessWarnings: [],
  };
}

/* -------------------------------------------------------------------------- */
/*                          EXTRACTION CONFIDENCE                             */
/* -------------------------------------------------------------------------- */

const FIELD_WEIGHTS: Partial<Record<keyof Complaint, number>> = {
  customerName: 10,

  productName: 20,

  productStrengthGrade: 10,

  batchLotNumber: 20,

  manufacturingDate: 10,

  expiryDate: 10,

  quantityAffectedKg: 10,

  complaintType: 5,

  complaintDate: 5,

  detailedComplaintDescription: 10,
};

const TOTAL_WEIGHT = Object.values(FIELD_WEIGHTS)
  .reduce((a, b) => a + b, 0);

export function calculateConfidence(
  complaint: Complaint
): number {

  let score = 0;

  for (const key of Object.keys(FIELD_WEIGHTS) as (keyof Complaint)[]) {

    if (!isEmpty(complaint[key])) {

      score += FIELD_WEIGHTS[key] ?? 0;

    }

  }

  return Math.round(
    (score / TOTAL_WEIGHT) * 100
  );
}

/* -------------------------------------------------------------------------- */
/*                        COMPLAINT COMPLETENESS CHECKER                      */
/* -------------------------------------------------------------------------- */

const FIELD_MESSAGES: Partial<
  Record<
    keyof Complaint,
    {
      label: string;
      recommendation: string;
      priority: "High" | "Medium" | "Low";
    }
  >
> = {
  customerName: {
    label: "Customer Name",
    recommendation:
      "Identify the reporting customer before initiating the investigation.",
    priority: "Medium",
  },

  productName: {
    label: "Product Name",
    recommendation:
      "The affected product must be identified before QA review.",
    priority: "High",
  },

  productStrengthGrade: {
    label: "Product Strength / Grade",
    recommendation:
      "Request the product strength or grade from the customer.",
    priority: "Medium",
  },

  batchLotNumber: {
    label: "Batch / Lot Number",
    recommendation:
      "Batch traceability is required before investigation.",
    priority: "High",
  },

  manufacturingDate: {
    label: "Manufacturing Date",
    recommendation:
      "Manufacturing date helps determine affected production lots.",
    priority: "Medium",
  },

  expiryDate: {
    label: "Expiry Date",
    recommendation:
      "Expiry information is needed to evaluate product quality.",
    priority: "Medium",
  },

  quantityAffectedKg: {
    label: "Quantity Affected",
    recommendation:
      "Request the affected quantity to estimate product impact.",
    priority: "Medium",
  },

  complaintType: {
    label: "Complaint Type",
    recommendation:
      "Categorize the complaint before triage.",
    priority: "Low",
  },

  detailedComplaintDescription: {
    label: "Complaint Description",
    recommendation:
      "Additional complaint details are required for assessment.",
    priority: "High",
  },
};

export function findMissingFields(
  complaint: Complaint
): string[] {

  const warnings: string[] = [];

  for (const key of REQUIRED_FIELDS) {

    if (!isEmpty(complaint[key])) {
      continue;
    }

    const field = FIELD_MESSAGES[key];

    if (!field) continue;

    warnings.push(
      `${field.priority}: ${field.label} missing. ${field.recommendation}`
    );
  }

  return warnings;
}