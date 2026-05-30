export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    const mod = await import('@tanstack/react-start/server-entry');
    const serverEntry = (mod.default ?? mod) as any;

    // If the module directly exposes a fetch() method, call it.
    if (serverEntry && typeof serverEntry.fetch === 'function') {
      return await serverEntry.fetch(request, undefined, undefined);
    }

    // If the module itself is a function, try calling it.
    if (typeof serverEntry === 'function') {
      const maybeResponse = await serverEntry(request);
      if (maybeResponse instanceof Response) return maybeResponse;
      return new Response(String(maybeResponse));
    }

    console.error('server-entry did not expose a fetch function or callable default export');
    return new Response('Server entry not available', { status: 500 });
  } catch (err) {
    console.error('Error in api/ssr:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
