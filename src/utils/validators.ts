// src/utils/validator.ts
export const validator = {
  isString: (v: any) => typeof v === "string",
  isNumber: (v: any) => typeof v === "number",
  isObject: (v: any) => v && typeof v === "object" && !Array.isArray(v),
  isArray: (v: any) => Array.isArray(v),
  notEmpty: (v: any) => v !== null && v !== undefined && v !== "",
};
