// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import * as path from 'path';

dotenv.config({path: path.resolve(__dirname, `../../.env`)});


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post('/generate-dream-content', async (req: Request, res: Response) => {
  console.log("dream content requested");

  try {
    console.log(req.body);
    const { title, description } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
          { role: "developer", content: `Your job is to rewrite a dream you are given to add more detail. Please do not rewrite the title. \n \n Rewrite this dream to be more descriptive: \n\n Title of the dream: ${title} \n\n Description of the dream: ${description} \n\n Respond with only the rewritten description and no other text. Then, add '||' to the end of your response, and provide a one sentence description of the dream that will be fed into an AI Image generation model.` },
      ],
      max_tokens: 4000,
    });

    const response = completion?.choices[0]?.message?.content?.trim();  
    if(!response) {
      console.error("No response from OpenAI");
      throw Error;
    }

    res.status(201).json({ response });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/generate-image', async (req: Request, res: Response) => {
  try{
    console.log('image requested');
    const { prompt }: { prompt: string } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    })

    const imageURL = response.data[0].url;
    imageURL? res.status(201).json({ imageURL }) : res.status(500).send("Internal Server Error");

    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});