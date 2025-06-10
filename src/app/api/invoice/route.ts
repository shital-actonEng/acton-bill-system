import { NextRequest , NextResponse } from "next/server";

// const url = `http://localhost:3000/api/invoice`;
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/invoice`

export async function GET(req:NextRequest) {
    try {
        const status = req.nextUrl.searchParams.get('status');
        const diagnosticCentreId = req.nextUrl.searchParams.get('diagnosticCentreId');
        const fromDate = req.nextUrl.searchParams.get('fromDate');
        const toDate = req.nextUrl.searchParams.get('toDate');
        let url = URL
         url = status ? `${URL}?status=${status}` : url
         url = diagnosticCentreId ? `${URL}?diagnostic_centre_fk=${diagnosticCentreId}&status=${status}` : url
         if(fromDate || toDate){
            url = `${URL}?diagnostic_centre_fk=${diagnosticCentreId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}` 
         }
        const res = await fetch(url , {
            method : 'GET',
            headers : {
                'Content-Type' :'application/json' 
            }
        })
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({message : 'Failed to fetch Invoice detailed'} , {status : 500})
    }
}

export async function POST(req:NextRequest) {
    const data = await req.json();
    try {
        const res = await fetch(URL , {
            method : 'POST',
            headers:{
                'Content-Type' :'application/json' 
            },
            body : JSON.stringify(data)
        })
        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({message : "Failed to add invoice detailed"},{ status : 500 } )
    }
}