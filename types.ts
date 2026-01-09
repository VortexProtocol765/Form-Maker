
export enum FieldType {
  SHORT_TEXT = 'Short Text',
  DATE = 'Date Picker',
  CHECKBOX = 'Checkbox Group',
  IMAGE = 'Image Upload',
  SIGNATURE = 'Signature',
  TABLE = 'Data Table',
  FORM_TEXT = 'Form Text'
}

export enum PriorityLevel {
  FLASH = 'FLASH',
  IMMEDIATE = 'IMMEDIATE',
  PRIORITY = 'PRIORITY',
  ROUTINE = 'ROUTINE'
}

export interface Schedule {
  time: string; // 24hr format
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Once';
  dayOfWeek?: string;
}

export interface Recipient {
  name: string;
  image?: string;
}

export interface TextStyle {
  bold: boolean;
  italic: boolean;
}

export interface FormField {
  id: string;
  label: string;
  description?: string; 
  type: FieldType;
  required: boolean;
  value?: any;
  options?: string[];
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export interface FormTemplate {
  id: string;
  title: string;
  image: string;
  lastEdited: string;
  icon: string;
  fields: FormField[];
  // New metadata fields
  recipient?: Recipient;
  schedule?: Schedule;
  priority?: PriorityLevel;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface FilledForm {
  id: string;
  templateId: string;
  title: string;
  timestamp: string;
  data: Record<string, any>;
  status: 'Draft' | 'Completed';
  inputStyles?: Record<string, TextStyle>;
}
