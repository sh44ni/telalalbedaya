import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { Project } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Get a single project
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();
        const project = data.projects.find((p: Project) => p.id === id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates: Partial<Project> = await request.json();
        const data = readData();

        const index = data.projects.findIndex((p: Project) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Merge updates with existing project
        data.projects[index] = {
            ...data.projects[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        writeData(data);
        return NextResponse.json(data.projects[index]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const data = readData();

        const index = data.projects.findIndex((p: Project) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        data.projects.splice(index, 1);
        writeData(data);

        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
