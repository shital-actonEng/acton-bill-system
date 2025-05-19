import { NextRequest , NextResponse } from "next/server";

const URL = "http://localhost:3000/api/reportTemplate";

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
        return NextResponse.json({message : 'Failed to fetch modalities'} , {status : 500})
    }
}