/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const arraySum = (items: Array<any>, prop: any, innerProp: any) => {
  return items.reduce(function (a, b) {
    return a + b[prop][innerProp];
  }, 0);
};
