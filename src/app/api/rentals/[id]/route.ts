import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Rental } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/rentals/[id] - Get a single rental
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();
        const rental = data.rentals.find((r: Rental) => r.id === id);

        if (!rental) {
            return NextResponse.json({ error: "Rental not found" }, { status: 404 });
        }

        return NextResponse.json(rental);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch rental" }, { status: 500 });
    }
}

// PUT /api/rentals/[id] - Update a rental
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates: Partial<Rental> = await request.json();
        const data = readData();

        const index = data.rentals.findIndex((r: Rental) => r.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Rental not found" }, { status: 404 });
        }

        // Merge updates with existing rental
        data.rentals[index] = {
            ...data.rentals[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        writeData(data);
        return NextResponse.json(data.rentals[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update rental" }, { status: 500 });
    }
}

// DELETE /api/rentals/[id] - Delete a rental
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        const index = data.rentals.findIndex((r: Rental) => r.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Rental not found" }, { status: 404 });
        }

        data.rentals.splice(index, 1);
        writeData(data);

        return NextResponse.json({ message: "Rental deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete rental" }, { status: 500 });
    }
}
