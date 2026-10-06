import assert from "node:assert/strict";
import { after, test } from "node:test";
import { apiGet, apiPost, ApiError } from "../api/client.js";

const originalFetch = globalThis.fetch;
after(() => {
  globalThis.fetch = originalFetch;
});

test("API requests include cookies and parse JSON responses", async () => {
  let received;
  globalThis.fetch = async (url, options) => {
    received = { url, options };
    return new Response(JSON.stringify({ id: "course-1" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  assert.deepEqual(await apiGet("/courses"), { id: "course-1" });
  assert.equal(received.url, "/api/courses");
  assert.equal(received.options.credentials, "include");
});

test("API requests encode JSON and handle empty success responses", async () => {
  let received;
  globalThis.fetch = async (_url, options) => {
    received = options;
    return new Response(null, { status: 204 });
  };

  assert.equal(await apiPost("/auth/logout"), null);
  assert.equal(received.method, "POST");
  assert.equal(received.headers.get("content-type"), null);

  globalThis.fetch = async (_url, options) => {
    received = options;
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  assert.deepEqual(await apiPost("/courses", { name: "Biology" }), { ok: true });
  assert.equal(received.headers.get("content-type"), "application/json");
  assert.equal(received.body, JSON.stringify({ name: "Biology" }));
});

test("API errors preserve the backend message and status", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ detail: "File exceeds upload limit" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });

  await assert.rejects(apiGet("/sources"), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 413);
    assert.equal(error.message, "File exceeds upload limit");
    return true;
  });
});
