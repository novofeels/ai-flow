import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email api://3d59f823-5437-4445-a4ec-22f058ad3e29/think.open",
          response_type: "code",
          code_challenge_method: "S256",
          // Override the redirect_uri to match the working callback URL:
          redirect_uri: "http://localhost:7026/authentication/login-callback",
        },
      },
      checks: "pkce", // Enable PKCE mode
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
