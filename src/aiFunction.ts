



export default async function callQwen(userText: string) {
    console.log('userText ' + userText)

    const apiKey = import.meta.env.VITE_Groq_API_KEY
    console.log(apiKey)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${apiKey}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                    model: "llama-3.1-8b-instant",
                                    messages: [
                                        {
                                        role: "user",
                                        content: `
                                            Continue the following text with good flow. \n
                                            Do not repeat the initial content, give the content ahead of it. \n
                                            Give two paragraphs of content. \n
                                            If text is present, then \n
                                            => continue writing the text \n 
                                            otherwise, start writing a random topic in the following manners. \n
                                            => Random Topic Name
                                            => Content on the random topic \n\n
                                            NOTE: avoid using any styling symbols like "*", etc.
                                            Text: \n\n${userText}`
                                        }
                                    ],
                                    max_tokens: 150
                                    })
                            });


    const data = await response.json();
    console.error(data)
    let content = data.choices[0].message.content 
    return content;
}
