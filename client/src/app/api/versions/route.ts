import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET versions for a specific resume
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json({ success: false, error: "Resume ID is required" }, { status: 400 });
    }

    const versions = await prisma.resumeVersion.findMany({
      where: { resumeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, versions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST to save a new version or restore one
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, resumeId, content, name, versionId } = body;

    if (!resumeId) {
      return NextResponse.json({ success: false, error: "Resume ID is required" }, { status: 400 });
    }

    if (action === "save") {
      const newVersion = await prisma.resumeVersion.create({
        data: {
          resumeId,
          content: JSON.stringify(content),
          name: name || `Version ${new Date().toLocaleString()}`,
        },
      });
      return NextResponse.json({ success: true, version: newVersion });
    }

    if (action === "restore") {
      if (!versionId) {
        return NextResponse.json({ success: false, error: "Version ID is required for restore" }, { status: 400 });
      }

      const version = await prisma.resumeVersion.findUnique({
        where: { id: versionId },
      });

      if (!version) {
        return NextResponse.json({ success: false, error: "Version not found" }, { status: 404 });
      }

      // Update the main resume content
      await prisma.resume.update({
        where: { id: resumeId },
        data: { aiDraftContent: version.content },
      });

      return NextResponse.json({ success: true, content: JSON.parse(version.content) });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
