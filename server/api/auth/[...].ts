import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '~/db'

export default NuxtAuthHandler({
  secret: '7ca0ae2a-a03e-41c4-a3fd-03d60b70ffd4',
  adapter: DrizzleAdapter(db),
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.refresh_token
      }

      return token
    },
    session: async ({ session, user }) => {
      ;(session as any).id = user.id

      return Promise.resolve(session)
    },
  },
})