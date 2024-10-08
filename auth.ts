import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
    // redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
  })],
  secret: process.env.AUTH_SECRET,
})