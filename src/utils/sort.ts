/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @TODO type

const alphaCompare =
  (ascending = true, key: string) =>
  (a: any, b: any): number => {
    const modifier = ascending ? 1 : -1;

    if (a[key] < b[key]) {
      return -1 * modifier;
    }
    if (a[key] > b[key]) {
      return 1 * modifier;
    }
    return 0;
  };

const numericCompare =
  (ascending = true, key: string) =>
  (a: any, b: any): number => {
    if (isNaN(a[key])) return 1;
    if (isNaN(b[key])) return -1;
    return ascending ? a[key] - b[key] : b[key] - a[key];
  };

export { alphaCompare, numericCompare };
