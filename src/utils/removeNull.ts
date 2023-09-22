/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const removeNull = (obj: any) => {
  const newObj = obj
  Object.keys(newObj).forEach(key => {
  if (newObj[key] === null || newObj[key] === undefined || newObj[key] === "") {
    delete newObj[key];
  }
  });
  
  return newObj;
}