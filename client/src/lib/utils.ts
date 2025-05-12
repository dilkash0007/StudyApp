import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 6) {
    return formatDate(dateStr);
  } else if (diffDay > 1) {
    return `${diffDay} days ago`;
  } else if (diffDay === 1) {
    return 'Yesterday';
  } else if (diffHour >= 1) {
    return `${diffHour}h ago`;
  } else if (diffMin >= 1) {
    return `${diffMin}m ago`;
  } else {
    return 'Just now';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}

// Generate a random hex color 
export function getRandomColor(): string {
  const colors = [
    '#4A6FFF', // Primary
    '#FF6B6B', // Secondary
    '#8A4FFF', // Accent
    '#4ADE80', // Success
    '#F43F5E', // Error
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Calculate circular progress for SVG stroke-dashoffset
export function getCircleProgress(percent: number, radius: number): number {
  const circumference = 2 * Math.PI * radius;
  return circumference - (percent / 100) * circumference;
}
