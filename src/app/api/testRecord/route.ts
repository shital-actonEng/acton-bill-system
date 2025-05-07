import { NextRequest , NextResponse } from "next/server";

const url = `${"http://localhost:3000/api/diagnosticTest"}`

export async function GET(req : NextRequest){
    try {
        const res = await fetch(url , {
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
        const res = fetch(url , {
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