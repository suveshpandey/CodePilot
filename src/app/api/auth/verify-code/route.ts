import prismaClient from "@/libs/prisma";

export async function POST (req: Request) {
    try {
        const {email, code} = await req.json();

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return Response.json(
                {message: "User not found"},
                {status: 404}
            )
        }

        const isCodeValid = user.verificationCode === code;
        const isCodeNotExpired = new Date(user.verificationCodeExpiry!) > new Date();
    
        if (isCodeValid && isCodeNotExpired) {
            await prismaClient.user.update({
                where: {email},
                data: {
                    isVerified: true,
                    verificationCode: "",
                    verificationCodeExpiry: new Date(0)
                }
            });
            return Response.json(
                {message: "Email verified successfully"},
                {status: 200}
            )
        } else if (!isCodeNotExpired) {
                return Response.json(
                    {message: "Verifiaction code had expired, please signup again to get a new code"},
                    {status: 400}
                )
        }
    } catch (error) {
        console.log("Error verifying user", error);
        return Response.json(
            {message: "Error verifying user", error},
            {status: 500}
        )
    }
}