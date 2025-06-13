import {NextResponse } from "next/server";

// const URL = "http://localhost:3000/api/reportTemplate";
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/reportTemplate/modalities`

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
        return NextResponse.json({message : 'Failed to fetch modalities'} , {status : 500})
    }
}