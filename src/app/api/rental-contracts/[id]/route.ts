import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { RentalContract } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/rental-contracts/[id] - Get a single contract
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();
        const contracts = data.rentalContracts || [];
        const contract = contracts.find((c: RentalContract) => c.id === id);

        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        return NextResponse.json(contract);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 });
    }
}

// PUT /api/rental-contracts/[id] - Update a contract
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates: Partial<RentalContract> = await request.json();
        const data = readData();

        if (!data.rentalContracts) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        const index = data.rentalContracts.findIndex((c: RentalContract) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        data.rentalContracts[index] = {
            ...data.rentalContracts[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        writeData(data);
        return NextResponse.json(data.rentalContracts[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update contract" }, { status: 500 });
    }
}

// DELETE /api/rental-contracts/[id] - Delete a contract
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        if (!data.rentalContracts) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        const index = data.rentalContracts.findIndex((c: RentalContract) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        data.rentalContracts.splice(index, 1);
        writeData(data);

        return NextResponse.json({ message: "Contract deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
    }
}
