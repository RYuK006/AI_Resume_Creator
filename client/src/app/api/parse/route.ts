import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { PdfReader } from "pdfreader";
// @ts-ignore
import officeParser from "officeparser";

// Helper to parse PDF via pdfreader
const extractPdfText = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    let text = "";
    new PdfReader({}).parseBuffer(buffer, (err: any, item: any) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + " ";
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = "";

    if (file.name.endsWith(".pdf")) {
      extractedText = await extractPdfText(buffer);
    } else if (file.name.match(/\.(ppt|pptx|doc|docx)$/i)) {
      // @ts-ignore
      extractedText = await officeParser.parseOfficeAsync(buffer);
    } else if (file.name.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ success: false, error: "Unsupported file type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, text: extractedText });
  } catch (error: any) {
    console.error("Parse Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
