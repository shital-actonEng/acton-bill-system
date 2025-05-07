import { NextRequest , NextResponse } from "next/server";

const url = `http://localhost:3000/api/invoice`;

export async function GET(req:NextRequest) {
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
        return NextResponse.json({message : 'Failed to fetch Invoice detailed'} , {status : 500})
    }
    
}

export async function POST(req:NextRequest) {
    const data = await req.json();
    console.log("data inside post ", data);
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