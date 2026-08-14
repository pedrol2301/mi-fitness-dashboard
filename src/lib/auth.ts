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

        console.log("AUTH DEBUG:", {
          expectedUser,
          receivedUsername: credentials?.username,
          hashExists: Boolean(passwordHash),
          hashLength: passwordHash?.length,
          hashPrefix: passwordHash?.slice(0, 7),
          passwordExists: Boolean(credentials?.password),
          passwordLength: credentials?.password?.length,
        })

        if (!expectedUser || !passwordHash) {
          console.log("FALHA: variáveis de ambiente ausentes")
          return null
        }

        if (!credentials?.username || !credentials?.password) {
          console.log("FALHA: credenciais ausentes")
          return null
        }

        if (credentials.username !== expectedUser) {
          console.log("FALHA: usuário diferente")
          return null
        }

        const valid = await bcrypt.compare(
          credentials.password,
          passwordHash
        )

        console.log("BCRYPT RESULT:", valid)

        if (!valid) {
          console.log("FALHA: senha inválida")
          return null
        }

        console.log("LOGIN OK")

        return {
          id: "1",
          name: expectedUser,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}


