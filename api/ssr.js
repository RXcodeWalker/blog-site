export default async function handler(req, res) {
  try {
    // Construct a Web Request from the incoming Node request
    const host = req.headers.host || 'localhost';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = new URL(req.url, `${proto}://${host}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers || {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) headers.set(key, value.join(', '));
      else headers.set(key, String(value));
    }

    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const buf = Buffer.concat(chunks);
      if (buf.length) body = buf;
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    // Import the built server bundle and call its `fetch` handler
    const mod = await import('../dist/server/server.js');
    const serverEntry = (mod.default ?? mod);

    let response;
    if (serverEntry && typeof serverEntry.fetch === 'function') {
      response = await serverEntry.fetch(request, undefined, undefined);
    } else if (typeof serverEntry === 'function') {
      response = await serverEntry(request);
    } else {
      throw new Error('server entry does not expose a fetch handler');
    }

    // Proxy Response back to Node res
    res.statusCode = response.status;
    response.headers.forEach((val, key) => res.setHeader(key, val));
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.end(buffer);
  } catch (err) {
    console.error('api/ssr error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
