import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";

import { CspNonceContext } from "./lib/security/nonce-context";
import { nonceSourceFor } from "./lib/security/nonce.server";
import { CspReportEndpoint, sitePoliciesFor } from "./lib/security/site-policy";

const ABORT_DELAY = 10_000;

const nonceSource = nonceSourceFor();

// Optional: where browsers send CSP violation reports. An invalid value is
// logged and ignored so a configuration typo cannot take the site down.
const cspReportEndpoint = (() => {
  try {
    return CspReportEndpoint.parse(process.env.CSP_REPORT_URI);
  } catch (error) {
    console.error(`CSP_REPORT_URI ignored: ${(error as Error).message}`);
    return undefined;
  }
})();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const nonce = nonceSource.next();
  for (const policy of sitePoliciesFor(nonce, cspReportEndpoint)) {
    policy.applyTo(responseHeaders);
  }

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <CspNonceContext value={nonce.value}>
        <ServerRouter context={routerContext} url={request.url} nonce={nonce.value} />
      </CspNonceContext>,
      {
        // React's own inline scripts (streamed Suspense boundaries).
        nonce: nonce.value,
        onShellReady() {
          shellRendered = true;
          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
