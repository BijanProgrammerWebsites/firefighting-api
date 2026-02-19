export type ResponseDto<TResult = void> = {
  message: string | string[];
} & (
  | (TResult extends void ? { result?: undefined } : { result: TResult })
  | { error: string }
);
