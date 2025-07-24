import axios from "axios";

interface PDFShiftOptions {
  source: string; // HTML string or URL
  landscape?: boolean;
  use_print?: boolean;
  [key: string]: any;
}

export async function generatePDFWithPDFShift(options: PDFShiftOptions): Promise<Buffer> {
  const apiKey = process.env.PDFSHIFT_API_KEY;
  if (!apiKey) throw new Error("PDFShift API key not set");

  const response = await axios.post(
    "https://api.pdfshift.io/v3/convert/pdf",
    options,
    {
      responseType: "arraybuffer",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json"
      }
    }
  );
  return Buffer.from(response.data);
} 