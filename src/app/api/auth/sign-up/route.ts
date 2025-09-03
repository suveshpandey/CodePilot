import { sendVerificationEmail } from "@/libs/nodemailer";
import prismaClient from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { LucideMessageSquareQuote } from "lucide-react";
import z, { email } from "zod";

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6).max(10, "Password must be between 6 to 10 characters"),
    username: z.string().min(6).max(12, "Username must be between 6 to 10 characters")
});

export async function POST (req: Request) {
    try {
        const data = await req.json();

        const parsedData = signupSchema.safeParse(data);
        if (!parsedData.success) {
            const firstError = parsedData.error.issues[0];
            return Response.json(
                { message: firstError.message },
                { status: 400 }
            );
        }

        const {email, password, username} = parsedData.data;

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!existingUser) { //User does not exists -> Create a new User
            const newUser = await prismaClient.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    username: username,
                    verificationCode: verificationCode,
                    verificationCodeExpiry: expiryDate,
                    isVerified: false,
                }
            });

            if(!newUser) {
                return Response.json(
                    {message: "User registration failed, try again"},
                    {status: 400}
                )
            } else {
                //send verification code
                const emailResponse = await sendVerificationEmail(email, username, verificationCode);
                console.log("Email response log: ", emailResponse);
                
                return Response.json(
                    {message: "User registered successfully, please verify your email"},
                    {status: 201}
                )
            }
        }
        else if (existingUser.isVerified === false) { //Email is registered but verification is not done yet
            const updatedUser = await prismaClient.user.update({
                where: {
                    email: email
                }, 
                data: {
                    id: existingUser?.id,
                    email: email,
                    password: hashedPassword,
                    username: username,
                    verificationCode: verificationCode,
                    verificationCodeExpiry: expiryDate,
                    isVerified: false,
                }
            });

            //send verification code
            const emailResponse = await sendVerificationEmail(email, username, verificationCode);
            console.log("Email response log: ", emailResponse);

            return Response.json(
                {message: "User registered successfully, please verify you email"},
                {status: 201}
            )
        }
        else { //User exists and verified
            return Response.json(
                {message: "User with this email already exists"},
                {status: 400}
            )
        }

    } catch (error) {
        console.error("Error registering user, Error: ", error);
        return Response.json(
            {error: "Error registering user"},
            {status: 500}
        )
    }
}