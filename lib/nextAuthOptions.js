import Credentials from 'next-auth/providers/credentials';
import dbConnect from './mongodb';
import User from '@/models/User';
import { generateToken } from './auth';

const INVALID_CREDENTIALS_MESSAGE = 'Identifiants incorrects. Veuillez réessayer.';

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth'
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

        if (!user || !user.isActive) {
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        const isValidPassword = await user.comparePassword(credentials.password);

        if (!isValidPassword) {
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }

        user.lastLogin = new Date();
        await user.save();

        const apiToken = generateToken(user._id);

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          apiToken
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.apiToken = user.apiToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.id = token.sub;
        session.user.apiToken = token.apiToken;
      }

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
};

export default authOptions;
