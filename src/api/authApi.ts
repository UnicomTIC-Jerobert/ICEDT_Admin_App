import apiClient from "./apiClient";
import { AuthResponse } from "../types/auth";
import { LoginRequest } from "../types/auth";
const API_BASE_URL = "/api/auth";

/**
 * Logs in a user.
 * @param credentials The username and password.
 * @returns A promise that resolves with the auth response, including tokens.
 */
export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  // The apiClient will automatically handle the response wrapping and error handling
  const response = await apiClient.post<AuthResponse>(
    `${API_BASE_URL}/login`,
    credentials
  );
  return response.data;
};
