class GeminiApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
  }
}

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiApiError('Gemini API is not configured. Set GEMINI_API_KEY in the backend environment.', 503);
  }

  return apiKey;
}

function getGeminiModelPath() {
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  return model.startsWith('models/') ? model : `models/${model}`;
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractResponseText(data) {
  return data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();
}

function stripJsonFence(value) {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

async function requestGeminiJson(prompt) {
  const modelPath = getGeminiModelPath();
  const apiKey = getGeminiApiKey();

  let response;

  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: 'application/json',
        },
      }),
    });
  } catch {
    throw new GeminiApiError('Could not reach the Gemini API service.', 503);
  }

  const rawBody = await response.text();
  const data = rawBody ? safeParseJson(rawBody) : null;

  if (!response.ok) {
    throw new GeminiApiError(
      data?.error?.message ?? `Gemini API request failed with status ${response.status}.`,
      response.status
    );
  }

  const text = extractResponseText(data);
  const json = text ? safeParseJson(stripJsonFence(text)) : null;

  if (!json) {
    throw new GeminiApiError('Gemini returned a response that was not valid JSON.', 502);
  }

  return json;
}

module.exports = {
  GeminiApiError,
  requestGeminiJson,
};
