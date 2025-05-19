import { NextRequest , NextResponse } from "next/server";

const URL = `${"http://localhost:3000/api/patient"}`;

export async function GET(req : NextRequest){
    try {
        const res = await fetch(URL , {
            method : 'GET',
            headers : {
                'Content-Type' :'application/json' 
            }
        })
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({message : 'Failed to fetch Patients'} , {status : 500})
    }
}

export async function POST(req:NextRequest) {
    const data = await req.json();
    try {
        const res = await fetch(URL , {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({message : "Failed to add patient details"} , {status : 500})
    }
}

export async function PUT(req:NextRequest) {
    const data = await req.json();
    console.log("inside route update ...", req.json());
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
    } catch (error) {
        return NextResponse.json({message : "Failed to update patient details"} , {status : 500})
    }
}
