import { encoding_for_model } from 'tiktoken'

// encoding stuffs
const enc = encoding_for_model("gpt-4o");

const text = "hello world, hello";

const tokens = enc.encode(text);

console.log(`Tokens: ${tokens}`);
