class UpstreamApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'UpstreamApiError';
    this.status = status;
  }
}

function getUpstreamApiBaseUrl() {
  const baseUrl = process.env.UPSTREAM_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new UpstreamApiError(
      'Upstream API is not configured. TODO: set UPSTREAM_API_BASE_URL to the production catalog/estimation service.',
      503
    );
  }

  return baseUrl.replace(/\/+$/, '');
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function requestUpstream(path, init) {
  let response;
  const baseUrl = getUpstreamApiBaseUrl();

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new UpstreamApiError('Could not reach the upstream API service.', 503);
  }

  const rawBody = await response.text();
  const data = rawBody ? safeParseJson(rawBody) : null;

  if (!response.ok) {
    throw new UpstreamApiError(
      data?.error ?? data?.message ?? `Upstream API request failed with status ${response.status}.`,
      response.status
    );
  }

  if (!data || data.data === undefined) {
    throw new UpstreamApiError('Upstream API returned an empty response body.', 502);
  }

  return data;
}

module.exports = {
  UpstreamApiError,
  requestUpstream,
};
