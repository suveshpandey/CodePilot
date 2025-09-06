import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User {
        id: string,
        isVerified: boolean,
        email: string,
        username?: string | null,
        createdAt: Date,
        provider?: String
    }
    interface Session {
        user: {
            id: string,
            isVerified: boolean,
            email: string,
            username?: string | null,
            createdAt: Date,
            provider?: String
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string,
        isVerified: boolean,
        email: string,
        username?: string | null,
        createdAt: Date,
        provider?: String
    }
}