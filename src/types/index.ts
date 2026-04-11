export type MetaValue =
  | string
  | number
  | boolean
  | null
  | MetaValue[]
  | { [key: string]: MetaValue };

export type Meta = Record<string, MetaValue>;

export interface BaseResponse<TStatusCode extends number = number> {
  status_code: TStatusCode;
  message: string;
  meta?: Meta;
}

export interface SuccessResponse<
  TData = unknown,
  TStatusCode extends number = number,
> extends BaseResponse<TStatusCode> {
  success: true;
  data?: TData;
}

export interface ErrorResponse<
  TErrors = unknown,
  TStatusCode extends number = number,
> extends BaseResponse<TStatusCode> {
  success: false;
  errors?: TErrors;
}

export type ApiResponse<TData = unknown, TErrors = unknown> =
  | SuccessResponse<TData>
  | ErrorResponse<TErrors>;

export interface CustomResponseInput<TData = unknown, TErrors = unknown> {
  success: boolean;
  status_code: number;
  message?: string;
  data?: TData;
  errors?: TErrors;
  meta?: Meta;
}

export interface PaginationMetaInput {
  page: number;
  limit: number;
  total: number;
  total_pages?: number;
}

export interface PaginationDetails {
  [key: string]: MetaValue;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_prev_page: boolean;
  has_next_page: boolean;
}

export interface ResponseDispatcher<TPayload> {
  json?(payload: TPayload): unknown;
  send?(): unknown;
}

export interface ExpressLikeResponse<TPayload> {
  status(statusCode: number): ResponseDispatcher<TPayload>;
}
