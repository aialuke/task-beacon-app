
// src/lib/formatUtils.ts
// Function to truncate text with ellipsis (unified function)
export function truncateText(text: string, maxLength: number = 100, useLastSpace: boolean = false): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  if (useLastSpace) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}…` : `${truncated}…`;
  } else {
    return `${text.substring(0, maxLength)}...`;
  }
}

// Specialized truncate for descriptions using truncateText with last space
export function truncateDescription(text: string, maxLength: number = 60): string {
  return truncateText(text, maxLength, true);
}

// Specialized truncate for URLs
export function truncateUrl(url: string, maxLength: number = 20): string {
  if (!url) return "";
  if (url.length <= maxLength) return url;

  try {
    const domain = new URL(url).hostname;
    if (domain.length <= maxLength) return domain;
    return truncateText(domain, maxLength - 1, false);
  } catch {
    return truncateText(url, maxLength - 1, false);
  }
}

// Function to get owner name from owner ID
export function getOwnerName(ownerId: string): string {
  // In a real app, this would fetch from a users table
  // For mock data, we'll use a simple mapping
  const mockUsernames: Record<string, string> = {
    "user-1": "Alex",
    "user-2": "Taylor",
    "user-3": "Jordan",
  };
  
  if (ownerId in mockUsernames) {
    return mockUsernames[ownerId];
  }
  
  // Extract first part of email-like IDs
  if (ownerId.includes("@")) {
    return ownerId.split("@")[0];
  }
  
  // Fallback: just return the first part of the ID
  const parts = ownerId.split("-");
  return parts.length > 1 ? parts[1] : ownerId;
}

// Function to compress and resize photos (placeholder for now)
export async function compressAndResizePhoto(file: File): Promise<File> {
  // This would be implemented with libwebp.js
  // For now, just return the original file
  return file;
}
