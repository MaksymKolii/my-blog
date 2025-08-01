import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CLIENT_ID_LOCAL,
  GITHUB_CLIENT_SECRET_LOCAL,
  MODE,
} = process.env

const GIT_CLIENT_ID =
  MODE === 'development' ? GITHUB_CLIENT_ID_LOCAL : GITHUB_CLIENT_ID
const GIT_CLIENT_SECRET =
  MODE === 'development' ? GITHUB_CLIENT_SECRET_LOCAL : GITHUB_CLIENT_SECRET

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: GIT_CLIENT_ID as string,
      clientSecret: GIT_CLIENT_SECRET as string,
      async profile(profile) {
        // console.log('profile.login', profile)
        console.log('profile.login', profile.login)
        console.log('profile.email', profile.email)
        // find out the user
        await dbConnect()
        const oldUser = await User.findOne({
          email: profile.email.toLowerCase(),
        })
        const userProfile = {
          email: profile.email.toLowerCase(),
          name: profile.name || profile.login,
          avatar: profile.avatar_url,
          role: 'user',
        }
        // store new user inside db
        if (!oldUser) {
          const newUser = new User({
            ...userProfile,
            provider: 'github',
          })
          await newUser.save()
        } else {
          userProfile.role = oldUser.role
        }

        return { id: profile.id, ...userProfile }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) user.email = user.email.toLowerCase() // Приведение email к нижнему регистру
      return true
    },

    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session }) {
      await dbConnect()
      if (session.user && session.user.email) {
        session.user.email = session.user.email.toLowerCase() // Приведение к нижнему регистру
      }

      //   console.log('Session', session)
      const user = await User.findOne({ email: session.user?.email })
      //  console.log('user', user)
      if (user)
        session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email.toLowerCase(),
          avatar: user.avatar,
          role: user.role,
        } as any

      return session
    },
  },
  pages: {
    //signIn: '/auth/signin',
    error: '/404',
  },
}
export default NextAuth(authOptions)
