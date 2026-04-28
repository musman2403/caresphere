import { jwtDecode } from "jwt-decode";

/**
 * Decodes a JSON Web Token and returns its payload.
 * @param {string} token - The JWT string to decode
 * @returns {object|null} The decoded payload, or null if the token is invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Checks if a JSON Web Token is expired.
 * @param {string} token - The JWT string to check
 * @returns {boolean} True if the token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, convert to milliseconds
  const currentTime = Date.now();
  const expirationTime = decoded.exp * 1000;
  
  return currentTime >= expirationTime;
};
