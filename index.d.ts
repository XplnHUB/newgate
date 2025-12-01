import { IncomingMessage, ServerResponse } from 'http';

export interface CMXRequest extends IncomingMessage {
  body: any;
  bodyType: 'json' | 'csv' | 'xml' | 'yaml' | 'formdata' | 'binary' | null;
  params: Record<string, string>;
  query: Record<string, string>;
  id?: string;
  [key: string]: any;
}

export interface CMXResponse extends ServerResponse {
  status(code: number): CMXResponse;
  set(header: string, value: string | number | string[]): CMXResponse;
  json(data: any): void;
  send(data: any): void;
  csv(data: any[] | string, options?: any): void;
  xml(data: any, options?: any): void;
  yaml(data: any, options?: any): void;
  file(buffer: Buffer, mimetype?: string): void;
  error(options: { message: string; code?: number; details?: any }): void;
  stream(stream: any): void;
  download(filePath: string, filename?: string): void;
}

export type RouteHandler = (req: CMXRequest, res: CMXResponse, next: (err?: any) => void) => void | Promise<void>;
export type Middleware = (req: CMXRequest, res: CMXResponse, next: (err?: any) => void) => void | Promise<void>;
export type ErrorHandler = (err: any, req: CMXRequest, res: CMXResponse, next: (err?: any) => void) => void | Promise<void>;

export interface CORSOptions {
  origin?: string | string[] | boolean | ((origin: string) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export interface ParserOptions {
  json?: {
    strict?: boolean;
    limit?: string | number;
  };
  csv?: {
    headers?: boolean;
    delimiter?: string;
    skipEmptyLines?: boolean;
    schema?: Record<string, (val: any) => boolean>;
  };
  xml?: {
    safeMode?: boolean;
    strict?: boolean;
  };
  yaml?: {
    multiDoc?: boolean;
  };
  formdata?: {
    fileSizeLimit?: number;
    memoryLimit?: number;
    fileCountLimit?: number;
  };
}

export default class App {
  constructor(options?: {
    parsers?: ParserOptions;
  });

  router: {
    routes: Array<{
      method: string;
      path: string;
      regex: RegExp;
      paramNames: string[];
      handlers: RouteHandler[];
    }>;
  };

  use(middleware: Middleware): void;
  use(path: string, middleware: Middleware): void;

  useError(handler: ErrorHandler): void;

  get(path: string, ...handlers: RouteHandler[]): void;
  post(path: string, ...handlers: RouteHandler[]): void;
  put(path: string, ...handlers: RouteHandler[]): void;
  delete(path: string, ...handlers: RouteHandler[]): void;
  patch(path: string, ...handlers: RouteHandler[]): void;
  options(path: string, ...handlers: RouteHandler[]): void;
  head(path: string, ...handlers: RouteHandler[]): void;

  cors(options?: CORSOptions): void;

  onShutdown(hook: () => Promise<void> | void): void;

  listen(port: number, callback?: () => void): void;
  shutdown(): Promise<void>;

  listen(port: number, callback?: () => void): any;
}

/**
 * Parser options
 */
export interface ParserOptions {
  [key: string]: any;
}

/**
 * CSV Parser options
 */
export interface CSVParserOptions extends ParserOptions {
  headers?: boolean;
  delimiter?: string;
  skipEmptyLines?: boolean;
  schema?: Record<string, (value: any) => boolean>;
}

/**
 * XML Parser options
 */
export interface XMLParserOptions extends ParserOptions {
  safeMode?: boolean;
  strict?: boolean;
}

/**
 * YAML Parser options
 */
export interface YAMLParserOptions extends ParserOptions {
  multiDoc?: boolean;
}

/**
 * Form-data Parser options
 */
export interface FormDataParserOptions extends ParserOptions {
  fileSizeLimit?: number;
  memoryLimit?: number;
  fileCountLimit?: number;
}

/**
 * Parsed form data
 */
export interface ParsedFormData {
  fields: Record<string, string>;
  files: Record<string, {
    filename: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }>;
}

/**
 * URL Parser result
 */
export interface ParsedURL {
  protocol: string;
  hostname: string;
  port: number;
  pathname: string;
  search: string;
  hash: string;
  query: Record<string, string>;
  href: string;
  origin: string;
}
