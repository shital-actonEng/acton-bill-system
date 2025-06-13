import { NextRequest , NextResponse } from "next/server";

// const url = `${"http://localhost:3000/api/diagnosticTest"}`
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/diagnosticTest`

export async function GET(){
    try {
        const res = await fetch(URL , {
            method : 'GET',
            headers : {
                'Content-Type' :'application/json' 
            }
        })
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({message : 'Failed to fetch Patients'} , {status : 500})
    }
}

export async function POST(req:NextRequest) {
    const data = await req.json();
    try {
        const res = await fetch(URL , {
            method : 'POST',
            headers : {
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const result = (await res).json();
        return NextResponse.json(result);
    } catch (error) {
        console.log("Failed to add test", error);
    }
}

export async function PUT(req:NextRequest) {
    const data = await req.json();
    console.log("data from test ..." , data);
    try {
        const res = await fetch(URL , {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await res.json();
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({message : "Failed to update patient details"} , {status : 500})
    }
}