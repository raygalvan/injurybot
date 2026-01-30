import { GoogleGenAI } from "@google/genai";
import { MockDB } from "./storage";
import { Language } from "../types";

// Function to stream chat responses from InjuryBot with history memory
export const streamExpertChat = async (
  message: string, 
  attorneyName: string, 
  lang: Language = 'en',
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Directly pull the prompt from database (with default fallbacks)
  let systemPrompt = MockDB.getPrompt('chatbot');
  
  // Inject dynamic variables
  systemPrompt = systemPrompt.replace(/{attorneyName}/g, attorneyName);

  const langInstruction = lang === 'es' 
    ? "\n\nResponde siempre en ESPAÑOL. Utiliza un tono profesional y empático." 
    : "\n\nAlways respond in ENGLISH. Use a professional and empathetic tone.";
  
  systemPrompt += langInstruction;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: systemPrompt,
      thinkingConfig: { thinkingBudget: 0 }
    },
  });

  return await chat.sendMessageStream({ message });
};

export interface CaseFile {
  id?: string;
  data: string;
  mimeType: string;
  category: 'official' | 'medical' | 'financial' | 'media';
  name: string;
}

// Function to analyze case evidence and generate an executive memorandum
export const analyzeCaseEvidence = async (
  files: CaseFile[],
  userFacts: string,
  attorneyName: string,
  lang: Language = 'en'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = 'gemini-3-flash-preview';
  
  let textPrompt = MockDB.getPrompt('analyzer');
  textPrompt = textPrompt
    .replace(/{attorneyName}/g, attorneyName.toUpperCase())
    .replace(/{language}/g, lang === 'es' ? 'SPANISH' : 'ENGLISH');

  const parts = [
    { text: textPrompt },
    { text: `CONTEXTUAL USER TESTIMONY: ${userFacts}` },
    ...files.map(file => ({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text;
};
