import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DICEBEAR_BASE = "https://api.dicebear.com/7.x";
const DICEBEAR_STYLE = "adventurer";

export function getAvatarUrl(seed: string): string {
  return `${DICEBEAR_BASE}/${DICEBEAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`;
}
