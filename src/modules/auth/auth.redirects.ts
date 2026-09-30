export const DEFAULT_RETURN_TO = "/account";

export const safeReturnTo = (value: string | undefined): string => {
  if (
    !value
    || !value.startsWith("/")
    || value.startsWith("//")
    || value.startsWith("/\\")
    || /[\x00-\x1f]/.test(value)
  ) {
    return DEFAULT_RETURN_TO;
  }

  return value;
};
