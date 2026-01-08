import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import type { SaleContract } from "@/types";

// Generate contract number in SC-YYYYMMDD-XXX format
function generateContractNumber(contracts: SaleContract[]): string {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

    // Find existing contracts from today
    const todayContracts = contracts.filter(c =>
        c.contractNumber?.startsWith(`SC-${dateStr}`)
    );

    const nextNumber = todayContracts.length + 1;
    return `SC-${dateStr}-${nextNumber.toString().padStart(3, "0")}`;
}

// GET /api/sale-contracts - Get all sale contracts
export async function GET() {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const data = readData();
        const saleContracts = data.saleContracts || [];

        // Sort by date descending
        saleContracts.sort((a: SaleContract, b: SaleContract) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json(saleContracts);
    } catch (error) {
        console.error("Error fetching sale contracts:", error);
        return NextResponse.json({ error: "Failed to fetch sale contracts" }, { status: 500 });
    }
}

// POST /api/sale-contracts - Create new sale contract
export async function POST(request: NextRequest) {
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const body = await request.json();
        const data = readData();

        // Initialize saleContracts array if it doesn't exist
        if (!data.saleContracts) {
            data.saleContracts = [];
        }

        // Generate contract number
        const contractNumber = generateContractNumber(data.saleContracts);

        const newContract: SaleContract = {
            id: `sc-${Date.now()}`,
            contractNumber,
            type: "sale",
            status: body.status || "signed",
            // Seller
            sellerId: body.sellerId || "",
            sellerName: body.sellerName,
            sellerCR: body.sellerCR,
            sellerNationality: body.sellerNationality || "",
            sellerAddress: body.sellerAddress || "",
            sellerPhone: body.sellerPhone || "",
            // Buyer
            buyerId: body.buyerId || "",
            buyerName: body.buyerName,
            buyerCR: body.buyerCR,
            buyerNationality: body.buyerNationality || "",
            buyerAddress: body.buyerAddress || "",
            buyerPhone: body.buyerPhone || "",
            // Property
            propertyWilaya: body.propertyWilaya || "",
            propertyGovernorate: body.propertyGovernorate || "",
            propertyPhase: body.propertyPhase || "",
            propertyLandNumber: body.propertyLandNumber || "",
            propertyArea: body.propertyArea || "",
            // Payment
            totalPrice: parseFloat(body.totalPrice) || 0,
            totalPriceWords: body.totalPriceWords || "",
            depositAmount: parseFloat(body.depositAmount) || 0,
            depositAmountWords: body.depositAmountWords || "",
            depositDate: body.depositDate || "",
            remainingAmount: parseFloat(body.remainingAmount) || 0,
            remainingAmountWords: body.remainingAmountWords || "",
            remainingDueDate: body.remainingDueDate || "",
            finalPaymentAmount: parseFloat(body.finalPaymentAmount) || 0,
            finalPaymentAmountWords: body.finalPaymentAmountWords || "",
            // Construction
            constructionStartDate: body.constructionStartDate || "",
            constructionEndDate: body.constructionEndDate || "",
            notes: body.notes || "",
            // Signatures
            sellerSignature: body.sellerSignature || "",
            buyerSignature: body.buyerSignature || "",
            // Meta
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        data.saleContracts.push(newContract);
        writeData(data);

        return NextResponse.json(newContract, { status: 201 });
    } catch (error) {
        console.error("Error creating sale contract:", error);
        return NextResponse.json({ error: "Failed to create sale contract" }, { status: 500 });
    }
}
