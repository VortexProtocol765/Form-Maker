
import { FormTemplate, FieldType } from './types';

export const INITIAL_TEMPLATES: FormTemplate[] = [
    { 
        id: '1', 
        title: "Site Inspection", 
        image: "https://picsum.photos/seed/inspection/400/300", 
        lastEdited: "2h ago", 
        icon: "cloud_done",
        fields: [
            { id: 'f1', label: 'Project Name', type: FieldType.SHORT_TEXT, required: true },
            { id: 'f2', label: 'Inspection Date', type: FieldType.DATE, required: true },
            { id: 'f3', label: 'Site Status', type: FieldType.SHORT_TEXT, required: false },
            { id: 'f4', label: 'Site Photo', type: FieldType.IMAGE, required: true }
        ]
    },
    { 
        id: '2', 
        title: "Patient Intake", 
        image: "https://picsum.photos/seed/patient/400/300", 
        lastEdited: "Yesterday", 
        icon: "save",
        fields: [
            { id: 'f5', label: 'Patient Name', type: FieldType.SHORT_TEXT, required: true },
            { id: 'f6', label: 'Birth Date', type: FieldType.DATE, required: true }
        ]
    }
];
