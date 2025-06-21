import {NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/diagnosticcentre`


export async function GET(){
    try {
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
