import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Rental } from "@/types";

// GET /api/rentals - Get all rentals
export async function GET() {
    try {
        const data = readData();
        return NextResponse.json(data.rentals);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch rentals" }, { status: 500 });
    }
}

// POST /api/rentals - Create a new rental
export async function POST(request: NextRequest) {
    try {
        const rental: Rental = await request.json();
        const data = readData();

        // Ensure ID exists
        if (!rental.id) {
            rental.id = `rent-${Date.now()}`;
        }

        // Set timestamps
        const now = new Date().toISOString();
        rental.createdAt = rental.createdAt || now;
        rental.updatedAt = now;

        // Set defaults
        rental.paymentStatus = rental.paymentStatus || "unpaid";
        rental.paidUntil = rental.paidUntil || rental.leaseStart;

        data.rentals.push(rental);
        writeData(data);

        return NextResponse.json(rental, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create rental" }, { status: 500 });
    }
}
