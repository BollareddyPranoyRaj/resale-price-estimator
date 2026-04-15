const test = require('node:test');
const assert = require('node:assert/strict');

const { UpstreamApiError, requestUpstream } = require('./upstreamApi');

test.afterEach(() => {
  delete process.env.UPSTREAM_API_BASE_URL;
  global.fetch = undefined;
});

test('requestUpstream fails clearly when the upstream base URL is missing', async () => {
  await assert.rejects(() => requestUpstream('/phones/brands'), (error) => {
    assert.equal(error instanceof UpstreamApiError, true);
    assert.equal(error.status, 503);
    assert.match(error.message, /UPSTREAM_API_BASE_URL/);
    return true;
  });
});

test('requestUpstream returns parsed data from the upstream API', async () => {
  process.env.UPSTREAM_API_BASE_URL = 'https://upstream.example/api';
  global.fetch = async (url, init) => {
    assert.equal(url, 'https://upstream.example/api/phones/brands');
    assert.equal(init?.headers?.['Content-Type'], 'application/json');

    return new Response(
      JSON.stringify({
        data: [{ slug: 'apple', name: 'Apple', modelCount: 42 }],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  };

  const response = await requestUpstream('/phones/brands');

  assert.deepEqual(response.data, [{ slug: 'apple', name: 'Apple', modelCount: 42 }]);
});

test('requestUpstream surfaces upstream API errors with status codes', async () => {
  process.env.UPSTREAM_API_BASE_URL = 'https://upstream.example/api';
  global.fetch = async () =>
    new Response(JSON.stringify({ error: 'Brand not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });

  await assert.rejects(() => requestUpstream('/phones/brands/missing/models'), (error) => {
    assert.equal(error instanceof UpstreamApiError, true);
    assert.equal(error.status, 404);
    assert.equal(error.message, 'Brand not found.');
    return true;
  });
});
