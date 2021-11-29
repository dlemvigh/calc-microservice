import { NextApiRequest, NextApiResponse } from "next";

import httpProxyMiddleware from "next-http-proxy-middleware";

const BASE_URL_SSR = process.env.API_ENDPOINT_SSR || "localhost:8081";
const API_ENDPOINT_SSR = `http://${BASE_URL_SSR}`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: API_ENDPOINT_SSR,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite: [
      {
        patternStr: "^/api",
        replaceStr: "",
      },
    ],
  });
}
