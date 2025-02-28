// src/app/layout.tsx
"use client";

import "./globals.css";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../msalConfig";
import { Provider as ReduxProvider } from "react-redux";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import store from "../store";

const msalInstance = new PublicClientApplication(msalConfig);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MsalProvider instance={msalInstance}>
          <ReduxProvider store={store}>
            <Topbar />
            <Sidebar />
            <div style={{ marginLeft: "4rem", position: "relative", zIndex: 0 }}>
              {children}
            </div>
          </ReduxProvider>
        </MsalProvider>
      </body>
    </html>
  );
}
