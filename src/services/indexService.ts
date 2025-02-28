import { Indexes } from "@/types/indexes";
import { ENDPOINTS } from "@/config/apiConfig";

/**
 * Fetch indexes from the Python backend endpoint.
 *
 * @param accessToken - The Bearer token from session storage (the "secret" value).
 * @returns A promise that resolves to Indexes.
 */
export async function getIndexes(accessToken: string): Promise<Indexes> {
  if (!accessToken) {
    throw new Error("No access token provided for getIndexes");
  }

  const response = await fetch(ENDPOINTS.INDEXES, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch indexes. Status: ${response.status}, Details: ${errorText}`);
  }

  return response.json();
}