import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Customer } from "@/types";

// GET /api/customers - Get all customers
export async function GET() {
    try {
        const data = readData();
        return NextResponse.json(data.customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
    try {
        const customer: Customer = await request.json();
        const data = readData();

        // Ensure ID exists
        if (!customer.id) {
            customer.id = `cust-${Date.now()}`;
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
