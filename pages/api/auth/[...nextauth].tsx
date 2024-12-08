import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import NextAuth, { NextAuthOptions, } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			async profile(profile) {
				// console.log('profile -', profile)
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
