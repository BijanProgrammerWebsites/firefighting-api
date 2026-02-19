import { Transform, TransformFnParams } from "class-transformer";

export function Trim() {
  return Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === "string" ? value.trim() : value;
  });
}
