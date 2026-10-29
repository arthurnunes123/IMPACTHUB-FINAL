const http = require("http");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const defaultEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, metroServer) => {
    const fallback = defaultEnhanceMiddleware
      ? defaultEnhanceMiddleware(middleware, metroServer)
      : middleware;

    return (request, response, next) => {
      if (!request.url?.startsWith("/api/")) return fallback(request, response, next);

      const proxyRequest = http.request(
        {
          hostname: "127.0.0.1",
          port: 3333,
          path: request.url,
          method: request.method,
          headers: { ...request.headers, host: "127.0.0.1:3333" },
        },
        (proxyResponse) => {
          response.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers);
          proxyResponse.pipe(response);
        }
      );

      proxyRequest.on("error", () => {
        if (response.headersSent) return response.end();
        response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "A API local do ImpactHub nao esta disponivel." }));
      });

      request.pipe(proxyRequest);
    };
  },
};

module.exports = config;
