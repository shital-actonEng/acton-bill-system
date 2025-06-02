import { NextRequest , NextResponse } from "next/server";

const url = `http://localhost:3000/api/invoice`;

// export async function GET(req:NextRequest) {
//     try {
//         const status = req.nextUrl.searchParams.get('status');
//         const res = await fetch(url , {
//             method : 'GET',
//             headers : {
//                 'Content-Type' :'application/json' 
//             }
//         })
//         const data = await res.json();
//         return NextResponse.json(data);
//     } catch (error) {
//         return NextResponse.json({message : 'Failed to fetch Invoice detailed'} , {status : 500})
//     }
// }

export async function GET(req:NextRequest) {
    try {
        const status = req.nextUrl.searchParams.get('status');
        const diagnosticCentreId = req.nextUrl.searchParams.get('diagnosticCentreId');
        const statusURL = status ? `${url}?status=${status}` : url
        const diagnosticCentreIdURL = diagnosticCentreId ? `${url}?diagnosticCentreId=${diagnosticCentreId}&status=${status}` : statusURL
        const res = await fetch(diagnosticCentreIdURL , {
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
        const res = await fetch(url , {
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