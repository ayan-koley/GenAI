import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import 'dotenv/config';
import { QdrantVectorStore } from "@langchain/qdrant";

async function generateVectorEmbeddingForFile(filepath: string) {
  
  try {
    if(process.env.GOOGLE_API_KEY === undefined) {
        throw new Error("GOOGLE_API_KEY is not defined in the environment variables.");
    }
    // load document
  const loader = new PDFLoader(filepath);
  const docs = await loader.load();

  // embedding
  const GoogleModel = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-2",
  });
  
  // GoogleModel.embedDocuments(docs.map(doc => doc.pageContent)).then((embeddings) => {
  //   console.log("Embeddings generated successfully:", embeddings);
  // }).catch((error) => {
  //   console.error("Error generating embeddings:", error);
  // })

  // store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
       GoogleModel,
        {
            url: "http://localhost:6333",
            collectionName: "learning"
        }
    )

    vectorStore.addDocuments(docs).catch((error) => {
      console.error("Error adding documents to vector store:", error);
    });

    console.log("Vector embeddings generated and stored successfully.");

  } catch (error) {
    console.error("Error generating vector embeddings:", error);
  }
}

generateVectorEmbeddingForFile("./src/cc.pdf")