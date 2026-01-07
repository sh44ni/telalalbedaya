import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Property } from "@/types";

// GET /api/properties - Get all properties
export async function GET() {
    try {
        const data = readData();
        return NextResponse.json(data.properties);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
    }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
    try {
        const property: Property = await request.json();
        const data = readData();

        // Ensure ID exists
        if (!property.id) {
            property.id = `prop-${Date.now()}`;
        }

        // Set timestamps
        const now = new Date().toISOString();
        property.createdAt = property.createdAt || now;
        property.updatedAt = now;

        // Set defaults
        property.images = property.images || [];
        property.features = property.features || [];

        data.properties.push(property);
        writeData(data);

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
    }
}
