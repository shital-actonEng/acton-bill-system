import puppeteer from "puppeteer";
import fs from 'fs';
import path from "path";
import { NextRequest } from "next/server";

const STORAGE_LOC = "invoices"

let browser : any ;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('invoiceId');

  if (!id) {
    return new Response('Missing invoice ID', { status: 400 });
  }

  const filePath = path.join(process.cwd(), `invoices/${id}/${id}.pdf`);

  if (!fs.existsSync(filePath)) {
    return new Response('PDF not found', { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline', 
    },
  });
}

function getReportDirectory(invoiceId : number) {
    const path = `${STORAGE_LOC}/${invoiceId}`
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path , {recursive : true} )
    }
    return path
}

 export async function generatePdfReport(htmlReport : any , invoiceId : number) {
   browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
         headless: true,
    });
    //  browser = await getbrowserInstance();
    const parentDir = getReportDirectory(invoiceId)
    const outputPath = `${parentDir}/${invoiceId}.pdf`
    // const context = await browser.createBrowserContext()
    // const page = await context.newPage();
    const page = await browser.newPage();
    await page.setContent(htmlReport)
    await page.pdf({path: `${outputPath}`, format: 'A4', margin: { top: "50px", right: "50px", bottom: "100px", left: "50px" }, printBackground: true})
    // await context.close()
    await page.close();
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await generatePdfReport(data.html, data.invoiceId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

