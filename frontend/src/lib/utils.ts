import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IS_DEV = process.env.NODE_ENV === 'development';
export const log = (message: string, path?: string): void => {
  if (IS_DEV) {
    console.log(`@@@@@@${message}${path ? " path: " + path : ''}`);
  }
}
