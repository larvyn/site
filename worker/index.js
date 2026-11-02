// Sends www.larvyn.dev to larvyn.dev (keeping the path and query), then serves the built site.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.larvyn.dev') {
      url.hostname = 'larvyn.dev';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
