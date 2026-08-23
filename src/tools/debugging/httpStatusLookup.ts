import type { ToolDefinition } from '@/types/tool';

interface StatusInfo {
  name: string;
  description: string;
}

const STATUS_CODES: Record<number, StatusInfo> = {
  100: { name: 'Continue', description: 'The server received the request headers and the client should continue with the request body.' },
  101: { name: 'Switching Protocols', description: 'The server is switching protocols as requested by the client.' },
  102: { name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.' },
  103: { name: 'Early Hints', description: 'Used to return some response headers before the final HTTP message.' },
  200: { name: 'OK', description: 'The request succeeded.' },
  201: { name: 'Created', description: 'The request succeeded and a new resource was created.' },
  202: { name: 'Accepted', description: 'The request has been accepted for processing, but processing is not complete.' },
  203: { name: 'Non-Authoritative Information', description: 'The returned metadata is from a copied or transformed source, not the origin.' },
  204: { name: 'No Content', description: 'The request succeeded but there is no content to return.' },
  205: { name: 'Reset Content', description: 'The client should reset the document view that caused the request.' },
  206: { name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header.' },
  207: { name: 'Multi-Status', description: 'A WebDAV response containing multiple status codes for different operations.' },
  208: { name: 'Already Reported', description: 'Members of a WebDAV binding have already been enumerated in a previous reply.' },
  226: { name: 'IM Used', description: 'The server fulfilled a GET request using instance-manipulation.' },
  300: { name: 'Multiple Choices', description: 'The request has more than one possible response. The user or user-agent should choose one.' },
  301: { name: 'Moved Permanently', description: 'The resource has been permanently moved to a new URI.' },
  302: { name: 'Found', description: 'The resource is temporarily located at a different URI.' },
  303: { name: 'See Other', description: 'The client should retrieve the resource from another URI using GET.' },
  304: { name: 'Not Modified', description: 'The resource has not been modified since the version specified in the request headers.' },
  305: { name: 'Use Proxy', description: 'The requested resource must be accessed through the proxy given by the Location header.' },
  307: { name: 'Temporary Redirect', description: 'The resource is temporarily at another URI; the request method must not change.' },
  308: { name: 'Permanent Redirect', description: 'The resource has permanently moved; the request method must not change.' },
  400: { name: 'Bad Request', description: 'The server cannot process the request due to a client error.' },
  401: { name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.' },
  402: { name: 'Payment Required', description: 'Reserved for future use; sometimes used by APIs to indicate payment is required.' },
  403: { name: 'Forbidden', description: 'The client is authenticated but does not have permission to access the resource.' },
  404: { name: 'Not Found', description: 'The requested resource could not be found on the server.' },
  405: { name: 'Method Not Allowed', description: 'The request method is not supported for the requested resource.' },
  406: { name: 'Not Acceptable', description: 'The server cannot produce a response matching the list of acceptable values.' },
  407: { name: 'Proxy Authentication Required', description: 'The client must authenticate with the proxy.' },
  408: { name: 'Request Timeout', description: 'The server timed out waiting for the request.' },
  409: { name: 'Conflict', description: 'The request conflicts with the current state of the resource.' },
  410: { name: 'Gone', description: 'The resource is no longer available and will not be available again.' },
  411: { name: 'Length Required', description: 'The request did not specify the length of its content, which is required.' },
  412: { name: 'Precondition Failed', description: 'One or more conditions in the request headers evaluated to false.' },
  413: { name: 'Payload Too Large', description: 'The request payload is larger than the server is willing or able to process.' },
  414: { name: 'URI Too Long', description: 'The URI provided was too long for the server to process.' },
  415: { name: 'Unsupported Media Type', description: 'The request entity has a media type which the server or resource does not support.' },
  416: { name: 'Range Not Satisfiable', description: 'The client asked for a portion of the file that the server cannot supply.' },
  417: { name: 'Expectation Failed', description: 'The server cannot meet the requirements of the Expect request header.' },
  418: { name: "I'm a teapot", description: 'The server refuses to brew coffee because it is a teapot (RFC 2324 / RFC 7168).' },
  421: { name: 'Misdirected Request', description: 'The request was directed at a server that is not able to produce a response.' },
  422: { name: 'Unprocessable Entity', description: 'The request was well-formed but could not be followed due to semantic errors.' },
  423: { name: 'Locked', description: 'The resource that is being accessed is locked.' },
  424: { name: 'Failed Dependency', description: 'The request failed because it depended on another request that failed.' },
  425: { name: 'Too Early', description: 'The server is unwilling to risk processing a request that might be replayed.' },
  426: { name: 'Upgrade Required', description: 'The client should switch to a different protocol.' },
  428: { name: 'Precondition Required', description: 'The origin server requires the request to be conditional.' },
  429: { name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.' },
  431: { name: 'Request Header Fields Too Large', description: 'The server is unwilling to process the request because its header fields are too large.' },
  451: { name: 'Unavailable For Legal Reasons', description: 'The resource is unavailable for legal reasons, such as a government-mandated block.' },
  500: { name: 'Internal Server Error', description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.' },
  501: { name: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.' },
  502: { name: 'Bad Gateway', description: 'The server, while acting as a gateway, received an invalid response from the upstream server.' },
  503: { name: 'Service Unavailable', description: 'The server is currently unable to handle the request due to overload or maintenance.' },
  504: { name: 'Gateway Timeout', description: 'The server, while acting as a gateway, did not receive a timely response from the upstream server.' },
  505: { name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP protocol version used in the request.' },
  506: { name: 'Variant Also Negotiates', description: 'The server has an internal configuration error related to content negotiation.' },
  507: { name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.' },
  508: { name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.' },
  510: { name: 'Not Extended', description: 'Further extensions to the request are required for the server to fulfill it.' },
  511: { name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.' },
  419: { name: 'Page Expired', description: 'Commonly used by Laravel when a CSRF token is missing or expired.' },
  440: { name: 'Login Time-out', description: 'The session has expired (IIS).' },
  444: { name: 'No Response', description: 'Nginx closed the connection without sending a response to the client.' },
  499: { name: 'Client Closed Request', description: 'Nginx: the client closed the connection before the server sent a response.' },
  520: { name: 'Web Server Returned an Unknown Error', description: 'Cloudflare: the origin returned an unexpected or empty response.' },
  521: { name: 'Web Server Is Down', description: 'Cloudflare: the origin refused the connection.' },
  522: { name: 'Connection Timed Out', description: 'Cloudflare: a timeout occurred contacting the origin.' },
  523: { name: 'Origin Is Unreachable', description: 'Cloudflare: the origin could not be reached.' },
  524: { name: 'A Timeout Occurred', description: 'Cloudflare: a connection was established but the origin did not respond in time.' },
  525: { name: 'SSL Handshake Failed', description: 'Cloudflare: the SSL/TLS handshake with the origin failed.' },
  526: { name: 'Invalid SSL Certificate', description: 'Cloudflare: the origin SSL certificate could not be validated.' },
};

function extractCodes(input: string): number[] {
  const matches = input.match(/\b\d{3}\b/g);
  if (!matches) return [];
  const codes = matches.map((m) => parseInt(m, 10));
  return Array.from(new Set(codes));
}

function formatStatus(code: number): string {
  const info = STATUS_CODES[code];
  if (!info) {
    return `${code}\nUnknown HTTP status code.`;
  }
  return `${code} ${info.name}\n\n${info.description}`;
}

const tool: ToolDefinition = {
  id: 'httpStatusLookup',
  name: 'HTTP Status Lookup',
  description: 'Look up HTTP status codes with their name and a short description',
  category: 'debugging',
  keywords: ['http', 'status', 'code', 'lookup', 'error', '404', '500', 'rest'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  detect: (input: string) => /^\s*\d{3}\s*$/.test(input),
  process: (input: string) => {
    if (!input.trim()) return '';

    try {
      const codes = extractCodes(input);
      if (codes.length === 0) {
        return 'Enter an HTTP status code (for example 404).';
      }
      return codes.map(formatStatus).join('\n\n---\n\n');
    } catch (e) {
      if (e instanceof Error) return `Error looking up status: ${e.message}`;
      return 'Error looking up status';
    }
  },
};

export default tool;
