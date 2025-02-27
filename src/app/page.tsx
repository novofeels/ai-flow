"use client";

import React, { useEffect, useState } from "react";
import { getFilterOptions } from "@/services/filterService";
import { FilterOptions } from "@/types/filterOptions";


export default function Home() {
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Find the key that contains "accesstoken"
      const accessTokenKey = Object.keys(sessionStorage).find(key => 
        key.includes("accesstoken") && 
        key.includes("3d59f823-5437-4445-a4ec-22f058ad3e29")
      );
      
      if (accessTokenKey) {
        try {
          // Parse the object stored at this key
          const tokenData = JSON.parse(sessionStorage.getItem(accessTokenKey) || "{}");
          
          // Extract the secret from the object
          if (tokenData && tokenData.secret) {
            // Use this token for your API call
            getFilterOptions(tokenData.secret)
              .then((data) => setFilters(data))
              .catch((err) => setError(err.message));
          } else {
            setError("Access token found but no secret property");
          }
        } catch (e) {
          setError("Error parsing access token data: " + e.message);
        }
      } else {
        setError("No access token found in session storage");
      }
    }
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!filters) return <p>Loading filter options...</p>;

  return (
    <div>
      <h2>Filter Options</h2>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
}

