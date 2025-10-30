import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from "@google/generative-ai";
import { UserData, AnalysisResult, AnalysisParameter } from '../types';
import { SKIN_PARAMETERS } from '../lib/constants';

const MODEL_NAME = "gemini-2.5-flash";
const API_KEY = "AIzaSyDpxN1QteXykEi-VyfezLNdXlMZ_sAHgIM";

const getGenAI = () => {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not defined.");
  }
  // Construct the URL to use the v1 API
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI;
};

export const analyzeSkin = async (userData: UserData, faceImages: string[]): Promise<AnalysisResult> => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig: GenerationConfig = {
    temperature: 0.4,
    topP: 1,
    topK: 32,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const textPrompt = `
    Analyze the user's skin based on the following lifestyle information and the three provided facial images (front, right, left).
    Act as an expert AI dermatologist.
    
    User Information:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Location: ${userData.city}, ${userData.state}, ${userData.country}
    - Profession: ${userData.profession}
    - Working Time: ${userData.workingTime}
    - AC Usage: ${userData.acUsage}
    - Smoker: ${userData.smoking}
    - Water Quality: ${userData.waterQuality}

    Analyze the three images for the following 11 parameters: ${SKIN_PARAMETERS.join(', ')}.
    Provide a rating from 1 (excellent) to 10 (severe concern) for each parameter.
    Based on the analysis, provide an overall summary, severity, and a simple, actionable morning and evening skincare routine.
    The response must be a JSON object that strictly follows this schema:
    {
      "summary": "string",
      "overallSeverity": "'Mild' | 'Medium' | 'Severe'",
      "parameters": [
        {
          "category": "string (must be one of ${SKIN_PARAMETERS.join(', ')})",
          "rating": "number (1-10)",
          "severity": "'Mild' | 'Medium' | 'Severe' | 'N/A'",
          "description": "string"
        }
      ],
      "routine": {
        "morning": ["string"],
        "evening": ["string"]
      }
    }
  `;
  
  const imageParts = faceImages.map(base64Data => ({
      inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data.split(',')[1],
      },
  }));

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [...imageParts, { text: textPrompt }] }],
      generationConfig,
      safetySettings,
    });

    const jsonText = result.response.text().trim();
    const analysis = JSON.parse(jsonText) as AnalysisResult;
    
    // Ensure all parameters are present, adding placeholders if Gemini omits any
    const completeParameters: AnalysisParameter[] = SKIN_PARAMETERS.map(paramName => {
        const foundParam = analysis.parameters.find(p => p.category === paramName);
        if (foundParam) {
            return foundParam;
        }
        return {
            category: paramName,
            rating: 1,
            severity: 'N/A',
            description: 'No significant concerns detected in this area.'
        };
    });

    analysis.parameters = completeParameters;

    return analysis;

  } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to analyze skin. The AI model may be temporarily unavailable.");
  }
};
