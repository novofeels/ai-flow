// src/utils/authTokenUtils.ts

// Get the client ID from environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "";

/**
 * Retrieves the access token from session storage
 */
export const getAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot access session storage in server-side environment"));
      return;
    }

    // Find the key that contains "accesstoken" and the client ID
    const accessTokenKey = Object.keys(sessionStorage).find(key => 
      key.includes("accesstoken") && 
      key.includes(CLIENT_ID)
    );
    
    if (!accessTokenKey) {
      reject(new Error("No access token found in session storage"));
      return;
    }

    try {
      // Parse the object stored at this key
      const tokenData = JSON.parse(sessionStorage.getItem(accessTokenKey) || "{}");
      
      // Extract the secret from the object
      if (tokenData && tokenData.secret) {
        resolve(tokenData.secret);
      } else {
        reject(new Error("Access token found but no secret property"));
      }
    } catch (e) {
      reject(new Error(`Error parsing access token data: ${e instanceof Error ? e.message : String(e)}`));
    }
  });
};

/**
 * Wraps an API call with authentication token retrieval
 */
export const withAuth = <T>(apiCallFn: (token: string) => Promise<T>): () => Promise<T> => {
  return async () => {
    const token = await getAccessToken();
    return apiCallFn(token);
  };
};