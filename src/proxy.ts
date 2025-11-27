import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/continue", async (req, res) => {
  const userText = req.body.text;

  console.log('Called the proxy')
  const response = await fetch(
    "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Continue writing:\n\n${userText}`,
        parameters: { max_new_tokens: 80 }
      })
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));
