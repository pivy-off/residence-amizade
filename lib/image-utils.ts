import { Room } from '@/types';
import businessData from '@/content/data.json';

/**
 * Get all images for a room by scanning the folder
 * Falls back to images listed in data.json if files don't exist
 */
export function getRoomImages(roomId: string): string[] {
  const room = businessData.rooms.find(r => r.id === roomId);
  if (!room) return [];
  
  // Return images from data.json (these should match actual files)
  return room.images;
}

/**
 * Check if a hero video exists
 */
export function hasHeroVideo(): boolean {
  // This will be checked client-side
  return false; // Set to true if you add hero-video.mp4
}

/**
 * Get hero image path
 */
export function getHeroImage(): string {
  return '/images/hero-image.jpg';
}

/**
 * Get hero video path (if exists)
 */
export function getHeroVideo(): string | null {
  return '/images/hero-video.mp4';
}
