import { FilterOptions } from "@/types/filterOptions";
import { ENDPOINTS } from "@/config/apiConfig";

/**
 * Fetch filter options from the Python backend endpoint.
 *
 * @param accessToken - The Bearer token from session storage (the "secret" value).
 * @returns A promise that resolves to FilterOptions.
 */
export async function getFilterOptions(accessToken: string): Promise<FilterOptions> {
  if (!accessToken) {
    throw new Error("No access token provided for getFilterOptions");
  }

  const response = await fetch(ENDPOINTS.FILTER_OPTIONS, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch filter options. Status: ${response.status}, Details: ${errorText}`);
  }

  return response.json();
}
