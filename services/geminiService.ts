import { GoogleGenAI, Type } from "@google/genai";
import { VideoConfig, ScriptResponse } from "../types";

// Helper to get a fresh client instance with the selected key
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhancePromptWithScript = async (topic: string): Promise<ScriptResponse> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a professional video director. The user wants a video about: "${topic}".
    1. Write a highly detailed visual prompt for a video generation AI (Veo) that visualizes this concept. Focus on lighting, movement, camera angles, and photorealism.
    2. Write a short, clear text explanation of the topic (2-3 sentences) in Arabic.
    
    Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualPrompt: { type: Type.STRING, description: "The detailed English prompt for the video generator" },
          explanation: { type: Type.STRING, description: "The Arabic explanation of the topic" }
        },
        required: ["visualPrompt", "explanation"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("فشل في توليد الوصف");
  return JSON.parse(text) as ScriptResponse;
};

export const generateImagePreview = async (prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  // Iterate to find the image part
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("لم يتم العثور على صورة في استجابة النموذج");
};

export const generateVideo = async (config: VideoConfig): Promise<string> => {
  const ai = getAiClient();
  
  // 1. Start Operation
  let operation = await ai.models.generateVideos({
    model: config.model,
    prompt: config.prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio
    }
  });

  // 2. Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  // 3. Extract URL
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("فشل في استخراج رابط الفيديو");
  }

  // 4. Return URL with API Key appended (required for download/playback)
  return `${videoUri}&key=${process.env.API_KEY}`;
};