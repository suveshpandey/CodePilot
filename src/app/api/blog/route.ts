import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    try {
        const {title, description, code} = await req.json();
        
    } catch (error) {
        
    }
}