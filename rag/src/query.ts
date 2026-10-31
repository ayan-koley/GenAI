import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';



async function queryFromRAG(query: string) {
    if(process.env.GOOGLE_API_KEY === undefined) {
        throw new Error("GOOGLE_API_KEY is not defined in the environment variables.");
    }
    // embedding
    const GoogleModel = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "gemini-embedding-2",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
       GoogleModel,
        {
            url: "http://localhost:6333",
            collectionName: "learning"
        }
    )

    const vectorRetriever = vectorStore.asRetriever({k: 3})
    const results = await vectorRetriever.invoke(query); // embedding + search

    const SYSTEM_PROMPT =`
    You are an expert in answering user queries based on the provided context about the document. Do not answer anything beyond what is provided. 
    User documents:
    ${results.map(e => JSON.stringify({pageContent: e.pageContent, pageNumber: e.metadata.loc.pageNumber})).join("\n")}

    Response should be in the following format:
        "answer": "short and simple answer",
        "pagenumber": "page number of the docs | null
    `

    const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});
    const interaction = await ai.interactions.create({
        model: "gemini-3-flash-preview",
        input: query,
        system_instruction: SYSTEM_PROMPT
    });

    console.log("AI Response: ", interaction.output_text)
    
}

queryFromRAG("What is system design?")

