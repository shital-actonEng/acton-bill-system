// app/api/proxy/invoice/[invoiceId]/trans/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params
  const backendUrl = `http://localhost:3000/api/invoice/${invoiceId}/trans`
  const body = await req.json()

  try {
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying invoice transaction POST:', error)
    return NextResponse.json({ message: 'Failed to proxy transaction' }, { status: 500 })
  }
}
