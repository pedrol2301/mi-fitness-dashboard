import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const expectedUser = process.env.AUTH_USER
        const passwordHash = process.env.AUTH_PASSWORD_HASH

        if (!expectedUser || !passwordHash) return null
        if (!credentials?.username || !credentials?.password) return null
        if (credentials.username !== expectedUser) return null

        const valid = await bcrypt.compare(credentials.password, passwordHash)
        if (!valid) return null

        return { id: "1", name: expectedUser }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}
