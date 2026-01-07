import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Property } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/properties/[id] - Get a single property
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();
        const property = data.properties.find((p: Property) => p.id === id);

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates: Partial<Property> = await request.json();
        const data = readData();

        const index = data.properties.findIndex((p: Property) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Merge updates with existing property
        data.properties[index] = {
            ...data.properties[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        writeData(data);
        return NextResponse.json(data.properties[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
    }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        const index = data.properties.findIndex((p: Property) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        data.properties.splice(index, 1);
        writeData(data);

        return NextResponse.json({ message: "Property deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
    }
}
