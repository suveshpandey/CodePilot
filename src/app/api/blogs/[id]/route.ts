import prismaClient from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please sign in" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const blog = await prismaClient.blog.findUnique({
        where: { id },
        include: {
            user: {
            select: {
                username: true,
                email: true,
            },
            },
        },
        });

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please sign in" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // ✅ delete safely only if the blog belongs to the user
        const result = await prismaClient.blog.deleteMany({
            where: { id, userId: session.user.id },
        });

        if (result.count === 0) {
        // Either not found, or not owned by user
        return NextResponse.json(
            { message: "Blog not found or not authorized" },
            { status: 404 }
        );
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please sign in" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const {title, description, code} = await req.json();

        // ✅ update safely only if the blog belongs to the user
        const result = await prismaClient.blog.update({
            where: { 
                id: id, 
                userId: session.user.id 
            },
            data: {
                title: title,
                description: description,
                code: code
            }
        });

        if (!result) {
            return NextResponse.json(
                { message: "Blog not found or not authorized" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Blog updated successfully" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}