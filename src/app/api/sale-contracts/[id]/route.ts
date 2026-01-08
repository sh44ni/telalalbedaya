import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import type { SaleContract } from "@/types";

// GET /api/sale-contracts/[id] - Get a single sale contract
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const { id } = await params;
        const data = readData();
        const contract = (data.saleContracts || []).find((c: SaleContract) => c.id === id);

        if (!contract) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        return NextResponse.json(contract);
    } catch (error) {
        console.error("Error fetching sale contract:", error);
        return NextResponse.json({ error: "Failed to fetch sale contract" }, { status: 500 });
    }
}

// PUT /api/sale-contracts/[id] - Update a sale contract
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const { id } = await params;
        const body = await request.json();
        const data = readData();

        const index = (data.saleContracts || []).findIndex((c: SaleContract) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        const existing = data.saleContracts[index];
        const updatedContract: SaleContract = {
            ...existing,
            ...body,
            id: existing.id,
            contractNumber: existing.contractNumber,
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
        };

        data.saleContracts[index] = updatedContract;
        writeData(data);

        return NextResponse.json(updatedContract);
    } catch (error) {
        console.error("Error updating sale contract:", error);
        return NextResponse.json({ error: "Failed to update sale contract" }, { status: 500 });
    }
}

// DELETE /api/sale-contracts/[id] - Delete a sale contract
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const { id } = await params;
        const data = readData();

        const index = (data.saleContracts || []).findIndex((c: SaleContract) => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Contract not found" }, { status: 404 });
        }

        data.saleContracts.splice(index, 1);
        writeData(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting sale contract:", error);
        return NextResponse.json({ error: "Failed to delete sale contract" }, { status: 500 });
    }
}
