import { GoogleGenerativeAI, GoogleGenerativeAIError, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// route.ts
const SYSTEM_PROMPT = `
You are a coding tutor. Give a brief, simple, accurate explanation.
If needed, then output code ONLY between the markers:
***CODE_START***
\`\`\`<language>
<code>
\`\`\`
***CODE_END***
`;


export async function POST (req: Request) {
    try {
        const { prompt, model_name } = await req.json();

        if(!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            )
        }

        const model =  genAI.getGenerativeModel({model: model_name});
        const result = await model.generateContent(prompt);
        const response =  result.response;
        const text = response.text();

        return NextResponse.json(
            {output: text},
            {status: 200}
        )

    } catch (error: any) {
        console.error("An error occurred in the Gemini API route: ", error);

        // Check if the error has a status property before trying to access it
        if (error && error.status === 429) {
            return NextResponse.json(
                { error: "We're experiencing high traffic. Please wait a moment and try again." },
                { status: 429 } // Too Many Requests
            );
        } else {
            // For all other errors, return a generic message to the client
            return NextResponse.json(
                { error: "An unexpected error occurred while fetching message from Gemini. Please try again later." },
                { status: 500 } // Internal Server Error
            );
        }
    }
}