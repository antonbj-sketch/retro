import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateVillainTaunt = async (rivalName: string, rivalEra: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `
      You are Anton, a stereotypical, cheesy 80s movie villain (think neon, synths, and shoulder pads).
      You are about to race against "${rivalName}" from the ${rivalEra}.
      Write a short, punchy, 1-sentence trash talk line directed at them. 
      Reference their era specifically. Keep it under 20 words.
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "Prepare to eat my pixelated dust!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm the bad guy, and I'm faster than you!";
  }
};

export const generateRaceCommentary = async (score: number, deathCause: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `
      You are an over-the-top 80s arcade racing announcer.
      The player, Anton (an 80s villain), just crashed.
      Score: ${score} meters.
      Cause of Death: Crashed into a ${deathCause}.
      
      Give a 2-sentence recap. Mock Anton for failing. Use 80s slang like "radical", "bogus", "wipeout".
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "Total wipeout! Try again, dude!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Game Over! Insert Coin to Try Again.";
  }
};
