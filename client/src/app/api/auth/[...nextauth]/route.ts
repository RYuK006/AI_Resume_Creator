import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // Here you can inject DB user ID into the session if needed
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Since our homepage holds the sign in button
  },
});

export { handler as GET, handler as POST };
