import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Chapter } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          text: { type: Type.STRING, description: "The question text in Hindi." },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of 4 possible answers in Hindi."
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of the correct option." },
          explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct in Hindi." }
        },
        required: ["id", "text", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["questions"]
};

const model = "gemini-2.5-flash";

const fetchQuestions = async (prompt: string): Promise<Question[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.4,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data received from AI");

    const parsed = JSON.parse(jsonText);
    
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions.map((q: any, index: number) => ({
        ...q,
        id: index + 1
      }));
    } else {
      throw new Error("Invalid format received from AI");
    }
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw error;
  }
};

export const generateQuiz = async (chapter: Chapter): Promise<Question[]> => {
  const prompt = `
    Create a 10-question Multiple Choice Quiz (MCQ) for the IC38 Insurance Agents Exam in Hindi.
    
    Topic: Chapter ${chapter.id} - ${chapter.title}
    Description: ${chapter.description}
    Context: This is for Indian Life Insurance Agents. Ensure questions align with the Insurance Institute of India syllabus.
    Language: Hindi (Devanagari script).
    Difficulty: Mix of Easy, Medium, and Hard.
    
    Requirements:
    - Exactly 10 questions.
    - Question text must be in Hindi.
    - Options must be in Hindi.
    - Explanation must be in Hindi.
    - 4 options per question.
    - Indicate the correct answer index (0-3).
  `;
  return fetchQuestions(prompt);
};

export const generateMockQuiz = async (): Promise<Question[]> => {
  const prompt = `
    Create a Comprehensive Mock Exam (MCQ) for the IC38 Insurance Agents Syllabus in Hindi.
    
    Scope: All 21 Chapters (Common, Life, and Health Insurance sections).
    Context: This is a full practice test for the IRDAI IC38 exam.
    Language: Hindi (Devanagari script).
    
    Requirements:
    - Generate 30 high-quality questions.
    - Select questions randomly distributed across all 21 chapters to cover the entire syllabus.
    - Ensure a mix of theoretical and practical scenario-based questions.
    - Question text, options, and explanations must be in Hindi.
    - 4 options per question.
    - Indicate the correct answer index (0-3).
  `;
  return fetchQuestions(prompt);
};
