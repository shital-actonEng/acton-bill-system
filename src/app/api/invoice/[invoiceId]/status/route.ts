// app/api/proxy/invoice/[invoiceId]/trans/route.ts
import { NextRequest, NextResponse } from 'next/server'

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/invoice`

type Context = {
  params: {
    invoiceId: string
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { invoiceId } = params
  const backendUrl = `${URL}/${invoiceId}/status`
  const body = await req.json()

  try {
    const res = await fetch(backendUrl, {
      method: 'PUT',
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
