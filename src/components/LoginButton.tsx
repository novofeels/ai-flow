// src/components/LoginButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";

const LoginButton: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(false);

  // Handle any pending redirect responses on component mount
  useEffect(() => {
    async function initMsal() {
      // Wait a short period to ensure the instance is fully initialized.
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          console.log("Redirect handled:", response);
        }
      } catch (error) {
        console.error("Error handling redirect:", error);
      }
    }
    initMsal();
  }, [instance]);
  

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error: unknown) {
      if ((error as { errorCode?: string }).errorCode === "interaction_in_progress") {
        console.warn("Login interaction already in progress");
        // Optionally, leave isLoading true if a redirect is pending
      } else {
        console.error("Login failed:", error);
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="p-4">
      {isAuthenticated ? (
        <>
          <p>You are signed in.</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In with Azure AD"}
          </button>
        </>
      )}
    </div>
  );
};

export default LoginButton;
