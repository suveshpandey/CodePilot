import prismaClient from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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

        const note = await prismaClient.note.findUnique({
            where: {
                id: id,
                userId: session.user.id 
            },
        
        });

        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        return NextResponse.json({ note }, { status: 200 });
    } catch (error) {
        console.error("Error fetching note:", error);
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

        const result = await prismaClient.note.deleteMany({
            where: {
                id: id,
                userId: session.user.id 
            },
        
        });

        if (result.count === 0) {
            // Either not found, or not owned by user
            return NextResponse.json(
                { message: "Note not found or not authorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}