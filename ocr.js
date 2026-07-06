import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const imagePath = 'download - 2026-07-05T195218.496.jpg';

async function main() {
  const imagePart = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
      mimeType: "image/jpeg"
    }
  };
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { role: 'user', parts: [{ text: 'Extract all the text from this image, particularly any Firebase configuration code.' }, imagePart] }
    ]
  });
  console.log(response.text);
}
main().catch(console.error);
