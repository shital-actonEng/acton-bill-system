import {NextResponse } from "next/server";

// const URL = `${"http://localhost:3000/api/diagnosticCentre"}`;
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL || "";
const URL = `${apiUrl}/diagnosticCentre`

export async function GET(){
    try {
       console.log("ENV VALUE:", process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL);
        const res = await fetch(URL , {
            method : 'GET',
            headers : {
                'Content-Type' :'application/json' 
            },     
        })
        const data = await res.json();
        return NextResponse.json(data);
    } catch(error){
        console.log(error);
        return NextResponse.json({message : 'Failed to fetch branches'} , {status : 500})
    }
}
