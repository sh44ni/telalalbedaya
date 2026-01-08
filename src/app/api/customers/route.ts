import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import type { Customer } from "@/types";

// Generate customer ID in CUS-XXXX format
function generateCustomerId(customers: Customer[]): string {
    if (!customers || customers.length === 0) {
        return "CUS-0001";
    }

    const numbers = customers
        .map(c => {
            const match = c.customerId?.match(/CUS-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => !isNaN(n));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    return `CUS-${nextNumber.toString().padStart(4, "0")}`;
}

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
    // Protect route
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const data = readData();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        let customers = data.customers || [];

        // Filter by search query (matches name or customerId)
        if (search) {
            const searchLower = search.toLowerCase();
            customers = customers.filter(c =>
                c.name?.toLowerCase().includes(searchLower) ||
                c.customerId?.toLowerCase().includes(searchLower)
            );
        }

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
    // Protect route
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    try {
        const customer: Customer = await request.json();

        // Validation - required fields
        const errors: string[] = [];

        if (!customer.name?.trim()) {
            errors.push("Customer name is required");
        }
        if (!customer.type) {
            errors.push("Customer type is required");
        }
        if (!customer.phone?.trim()) {
            errors.push("Phone number is required");
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
        }

        const data = readData();

        // Ensure ID exists
        if (!customer.id) {
            customer.id = `cust-${Date.now()}`;
        }

        // Auto-generate customerId if not provided
        if (!customer.customerId) {
            customer.customerId = generateCustomerId(data.customers);
        }

        // Set timestamps
        const now = new Date().toISOString();
        customer.createdAt = customer.createdAt || now;
        customer.updatedAt = now;

        // Set defaults
        customer.assignedPropertyIds = customer.assignedPropertyIds || [];

        data.customers.push(customer);
        writeData(data);

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
}
