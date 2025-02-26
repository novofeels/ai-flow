// src/msalConfig.ts
export const msalConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!, // Ensure this is set
      authority: "https://login.microsoftonline.com/cd33daed-3279-40cb-8b76-6e4598e5d3af",
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:7026/authentication/login-callback",
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: [
      "openid",
      "profile",
      "email",
      "api://3d59f823-5437-4445-a4ec-22f058ad3e29/think.open",
    ],
  };
  