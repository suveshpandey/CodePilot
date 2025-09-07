import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import prismaClient from "@/libs/prisma";

// Post a new Note
export async function POST (
    req: NextRequest,
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please sign in" },
                { status: 401 }
            )
        }

        const {title, description, code} = await req.json();

        if (!title || !description) {
            return NextResponse.json(
                {message: "Title and Description are required"},
                {status: 400}
            )
        }

        const response = await prismaClient.note.create({
            data: {
                title: title,
                description: description,
                code: code || null,
                userId: session.user.id,
            }
        })
        if (response) {
            return NextResponse.json(
                {message: "Note created succefully"},
                {status: 201}
            )
        }
        else {
            return NextResponse.json(
                {message: "Failed to create note, please try again"},
                {status: 400}
            )
        }
        
    } catch (error) {
        return NextResponse.json(
            {message: "Internal server error", error},
            {status: 500}
        )
    }
}

// Get all notes
export async function GET () {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please sign in" },
                { status: 401 }
            )
        }

        const notes = await prismaClient.note.findMany({
            where: {
                userId: session.user.id
            }
        })
        if (!notes) {
            return NextResponse.json(
                {message: "Notes not found"},
                {status: 400}
            )
        } else {
            return NextResponse.json(
                {notes: notes},
                {status: 200}
            )
        }
    } catch (error) {
        return NextResponse.json(
            {message: "Internal server error", error},
            {status: 500}
        )
    }
}