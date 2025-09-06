import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prismaClient from "@/libs/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    console.log("🔍 Credentials received:", credentials);
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password required");
                    }

                    const  user = await prismaClient.user.findFirst({
                        where: {
                            email: credentials.email
                        }
                    })
                    console.log("🔍 Prisma user:", user);
                    
                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password as string);
                    console.log("🔍 Password valid:", isPasswordCorrect);

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            if(account?.provider === "google") {
                try {
                    const existingUser = await prismaClient.user.findFirst({
                        where: {
                            email: user.email!
                        }
                    });
                    if (!existingUser) {
                        await prismaClient.user.create({
                            data: {
                                email: user.email!,
                                username: user.email!.split('@')[0],
                                isVerified: true,
                            }
                        });
                    } else if (!existingUser.isVerified) {
                        await prismaClient.user.update({
                            where: {email: user.email!},
                            data: {isVerified: true}
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error in Google sign-in callback:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account, trigger }) {
            if (trigger === "signIn" || trigger === "update") {
                const dbUser = await prismaClient.user.findFirst({
                    where: {email: token.email}
                });

                if (dbUser) {
                    token.id = dbUser.id?.toString() as string;
                    token.isVerified = dbUser.isVerified;
                    token.email = dbUser.email,
                    token.username = dbUser.username;
                    token.createdAt = dbUser.createdAt;
                }
            }
            else if (user) {
                token.id = user.id?.toString() as string;
                token.isVerified = user.isVerified;
                token.email = user.email,
                token.username = user.username;
                token.createdAt = user.createdAt;
            }

            if (account) {
                token.provider = account.provider;
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.email = token.email,
                session.user.username = token.username;
                session.user.createdAt = token.createdAt;
                session.user.provider = token.provider;
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
