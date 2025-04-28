import { NextRequest , NextResponse } from "next/server";

const URL = `${"http://localhost:3000/api/patient"}`;

export async function PUT(req: NextRequest , {params} : {params : {pk : number}}) {
    const data = await req.json();
    console.log("route js...", data);
const {pk} = await params;
    if(!pk){
        return NextResponse.json(
            { message: "Patient ID (pk) is required" },
            { status: 400 }
          );
    }
    try {
        const res = await fetch(`${URL}/${pk}` , {
            method: 'PUT',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({message : "Failed to update data"}, {status:500})
    }
}
