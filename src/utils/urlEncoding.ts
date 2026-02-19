/**
 * Encodes an object properties as query parameters
 * @example encodeToQueryParams({ name: 'test', value: 123 }) => 'name=test&value=123'
 */
export const encodeToQueryParams = (data: Record<string, any>): string => {
  try {
    console.log('encodeToQueryParams', data);
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return params.toString();
  } catch (error) {
    console.error('Failed to encode data to query params:', error);
    return '';
  }
};

/**
 * Decodes query parameters back to an object
 * @example decodeFromQueryParams('name=test&value=123') => { name: 'test', value: '123' }
 */
export const decodeFromQueryParams = <T = Record<string, string>>(params: URLSearchParams): Partial<T> => {
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result as T;
};
