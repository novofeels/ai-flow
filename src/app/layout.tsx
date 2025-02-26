// src/app/layout.tsx
"use client";

import "./globals.css";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../msalConfig";
import { Provider as ReduxProvider } from "react-redux";
import store from "../store";

const msalInstance = new PublicClientApplication(msalConfig);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-h-1">
        <MsalProvider instance={msalInstance}>
          <ReduxProvider store={store}>
            <div style={{ position: "relative", zIndex: 0 }}>
              {children}
            </div>
          </ReduxProvider>
        </MsalProvider>
      </body>
    </html>
  );
}
