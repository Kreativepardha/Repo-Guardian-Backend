import openai from "../config/openai";
import logger from "../utils/logger";

export async function analyzeVulnerability(toolName: string, rawResult: any): Promise<any> {
  const rawText = JSON.stringify(rawResult, null, 2).slice(0, 3000);

  const prompt = `
  You are a cybersecurity expert analyzing scan results from ${toolName}. 
  For each vulnerability or finding in the scan results, provide:
  1. Risk Level (Critical/High/Medium/Low)
  2. Description of the vulnerability
  3. Potential impact
  4. Recommended solution steps

  Scan Output:
  \`\`\`json
  ${rawText}
  \`\`\`

  Format your response as a JSON object with the following structure:
  {
    "summary": "Brief overall summary",
    "findings": [
      {
        "risk": "Risk level",
        "description": "Vulnerability description",
        "impact": "Potential impact",
        "solution": ["Step 1", "Step 2", ...]
      }
    ]
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using a valid model
      messages: [
        { role: 'system', content: 'You are a Security Vulnerability Analyst.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message.content?.trim();
    if (!content) {
      throw new Error('No content in AI response');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      logger.error('Failed to parse AI response as JSON', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        content
      });
      return {
        summary: "Failed to analyze vulnerabilities",
        findings: []
      };
    }
  } catch (error) {
    logger.error('AI analysis failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      toolName
    });
    return {
      summary: "AI analysis failed",
      findings: []
    };
  }
}
