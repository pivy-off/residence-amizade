import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

export function getWhatsAppLink(phone: string, message: string = ''): string {
  const formattedPhone = formatPhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
}

export function getTelLink(phone: string): string {
  const formattedPhone = formatPhone(phone);
  return `tel:${formattedPhone}`;
}

export function getMailtoLink(email: string, subject: string = '', body: string = ''): string {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  return `mailto:${email}${params.toString() ? `?${params.toString()}` : ''}`;
}
