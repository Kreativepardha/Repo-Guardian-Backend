import openai from "../config/openai";





export async function summarizeWithAI(toolName: string, rawResult: any): Promise<string> {

  const rawText = JSON.stringify(rawResult, null, 2).slice(0, 3000);

  const prompt = `
  You Are a cybersecurity assistant. Summarize the scan results below from ${toolName} in clear, simple, human-readable terms.
   Avoid jargon, explain risks, and provide actionable advice if possible.
  Scan Output:
  \`\`\`json
  ${rawText}
  \`\`\`
  Summar:
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-40',
    messages: [
      { role: 'system', content: 'You are a Security Scan summarizer.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 500
  })

  return response.choices[0]?.message.content?.trim() || 'No summary available';


}
