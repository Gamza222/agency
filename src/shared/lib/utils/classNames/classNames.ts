// function will return classes according to payload watch course 1 module 8 video

export type Mods = Record<string, boolean | string | number | null | undefined>; // key - string, value - boolean, string, number, null, or undefined

export function classNames(
  cls: string | undefined,
  mods: Mods = {},
  additional: Array<string | boolean | null | undefined> = []
): string {
  return [
    cls,
    ...additional.filter(Boolean),
    ...Object.entries(mods)
      .filter(([_, value]) => {
        return Boolean(value);
      })
      .map(([className, _]) => className),
  ]
    .filter(Boolean) // This filters out empty strings, undefined, and other falsy values
    .join(" ");
}
