import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { RentalContract } from "@/types";

// Helper to generate contract number
function generateContractNumber(): string {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return `RC-${y}${m}${d}-${rand}`;
}

// GET /api/rental-contracts - Get all rental contracts
export async function GET() {
    try {
        const data = readData();
        // Initialize rentalContracts array if it doesn't exist
        if (!data.rentalContracts) {
            data.rentalContracts = [];
            writeData(data);
        }
        return NextResponse.json(data.rentalContracts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
    }
}

// POST /api/rental-contracts - Create a new rental contract
export async function POST(request: NextRequest) {
    try {
        const contract: RentalContract = await request.json();
        const data = readData();

        // Initialize array if needed
        if (!data.rentalContracts) {
            data.rentalContracts = [];
        }

        // Ensure ID and contract number exist
        if (!contract.id) {
            contract.id = `rc-${Date.now()}`;
        }
        if (!contract.contractNumber) {
            contract.contractNumber = generateContractNumber();
        }

        // Set timestamps
        const now = new Date().toISOString();
        contract.createdAt = contract.createdAt || now;
        contract.updatedAt = now;

        // Set defaults
        contract.type = contract.type || "rental";
        contract.status = contract.status || "draft";

        data.rentalContracts.push(contract);
        writeData(data);

        return NextResponse.json(contract, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
    }
}
