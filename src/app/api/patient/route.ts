import { NextRequest , NextResponse } from "next/server";

// const URL = `${"https://localhost:3000/api/patient"}`;

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_LOCAL_API_URL;
const URL = `${apiUrl}/patient`

export async function GET(req : NextRequest){
    try {
        const name = req.nextUrl.searchParams.get('name');
        const url = name ? `${URL}?name=${name}` : URL ;
        const res = await fetch(url , {
            method : 'GET',
            headers : {
                'Content-Type' :'application/json' 
            },
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
