import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAi from "openai"
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";
import OpenAI from "openai";
import { error } from "console";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams['voice'],
      input,
    });

    const buffer = await mp3.arrayBuffer();
    
    return buffer;
  },
});
export const generateThumbnailAction = action({
  args: {prompt: v.string()},
  handler: async(_, {prompt}) => {
    const respone = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'hd',
      n: 1,
    })
    const url = respone.data[0].url
    if(!url){
      throw new Error('Error generating thumbnail')
    }
    const imageRes = await fetch(url)
    const buffer = await imageRes.arrayBuffer();
    return buffer
  }
})