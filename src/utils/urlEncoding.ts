/**
 * Encodes an object to a URL-safe Base64 string
 */
export const encodeToUrl = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    return btoa(json);
  } catch (error) {
    console.error('Failed to encode data:', error);
    return '';
  }
};

/**
 * Decodes a Base64 string back to an object
 */
export const decodeFromUrl = <T = any>(encoded: string): T | null => {
  try {
    const json = atob(encoded);
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to decode data:', error);
    return null;
  }
};
