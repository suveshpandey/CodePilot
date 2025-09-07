import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import prismaClient from "@/libs/prisma";

export async function POST (req: NextRequest) {
    try {
        // Get the user session and check if the user is authorized
        const session = await getServerSession(authOptions);
        if (!session || !session.user.id) {
            return NextResponse.json(
                {message: "Unauthorized - Please sign-in to create a blog"},
                {status: 401}
            );
        }

        const {title, description, code} = await req.json();

        if (!title || !description) {
            return NextResponse.json(
                {message: "Title and Description are required"},
                {status: 400}
            );
        }

        // Create the blog post
        const newBlog = await prismaClient.blog.create({
            data: {
                title: title,
                description: description,
                code: code || null,
                userId: session.user.id,
            }, 
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                    }
                }
            }
        });

        if (!newBlog) {
            return NextResponse.json(
                {message: "Failed to create blog, please try again"},
                {status: 400}
            )
        } else {
            return NextResponse.json(
                {message: "Blog created successfully", newBlog: newBlog},
                {status: 201}
            )
        }

    } catch (error) {
        console.error('Blog creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET () {
    try {
        const blogs = await prismaClient.blog.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!blogs) {
            return NextResponse.json(
                {message: "Blogs not found"},
                {status: 404}
            );
        } else {
            return NextResponse.json({blogs: blogs}, {status: 200});
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}