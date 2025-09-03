import nodemailer from "nodemailer";
import getVerificationEmailHtml from "@/emails/VerificationEmail";

export async function sendVerificationEmail(email: string, username: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"CodePilot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification Code for CodePilot",
        html: getVerificationEmailHtml(username, otp), // <-- plain string
    };

    await transporter.sendMail(mailOptions);
}
