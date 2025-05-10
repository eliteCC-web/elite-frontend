import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines classNames conditionally using clsx and tailwind-merge.
 * This allows for conditional classes, merging of tailwind classes, and more.
 * 
 * @example
 * cn('text-red-500', conditional && 'bg-blue-500', 'p-4')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}