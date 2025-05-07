const url = `/api/invoice`

// const addInvoices = async (data : any) => {
//     try {
//         const responce = await fetch(url , {
//             method : "POST",
//             headers : {
//                  "Content-Type": "application/json"
//             },
//             body : JSON.stringify(data)
//         })
//         if(!responce.ok)
//         {
//             throw new Error(`HTTP Error ! status : ${responce.status}`);
//         }
//     } catch (error) {
//         console.error("Error adding patient:", error);
//          throw error; 
//     }
// }

function addInvoice(login : any, compositeInvoice : any) {
    let newCompositeInvoice = appendCreds(login, compositeInvoice)
    console.log("new transaction...", newCompositeInvoice);
    return fetch("/api/invoice", {
        method: "POST",
        headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newCompositeInvoice)
    })
}

function appendCreds(login : any, compositeInvoice: any) {
    let trs = compositeInvoice.trans.map((t:any) => { return ({...t, created_by: login}) })
    let newCompositeInvoice = {...compositeInvoice, trans: trs}
    return newCompositeInvoice
}

const getInvoice = async () =>{
    try {
        const responce = await fetch(url);
        console.log(responce);
        if(!responce.ok){
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
        const result = await responce.json();
        return await result;
    } catch (error) {
        console.error("Error adding patient:", error);
        throw error; 
    }
}

export {addInvoice , getInvoice}
