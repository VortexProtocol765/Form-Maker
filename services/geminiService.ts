
import { GoogleGenAI, Type } from "@google/genai";
import { FieldType, FormField } from "../types";

// Initialize AI lazily to avoid top-level ReferenceErrors during initial bundle load
const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateFormFromPrompt = async (prompt: string): Promise<{ title: string; fields: Partial<FormField>[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional form schema based on this description: "${prompt}". 
    Return a JSON object with a 'title' and an array of 'fields'. 
    Each field must have 'label', 'description' (a short instruction or context for the user filling it), 'type' (one of: ${Object.values(FieldType).join(', ')}), and 'required' (boolean).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                required: { type: Type.BOOLEAN }
              },
              required: ["label", "type", "required"]
            }
          }
        },
        required: ["title", "fields"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const extractDataFromImage = async (base64Image: string, fields: FormField[]) => {
  const ai = getAI();
  const fieldNames = fields.map(f => f.label).join(", ");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: `Analyze this image and extract information for these form fields: ${fieldNames}. Return as a JSON object mapping labels to extracted values.` }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
};
