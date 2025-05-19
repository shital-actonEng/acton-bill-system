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
    console.log("The composite invoice is...", compositeInvoice);
    console.log("new composite invoice...", newCompositeInvoice);
    return fetch("/api/invoice", {
        method: "POST",
        headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newCompositeInvoice)
    })
}

function appendTransations(login : any, invoiceId : any, compositeInvoice : any) {
    let newCompositeInvoice = appendCreds(login, compositeInvoice)
    return fetch(`${url}/${invoiceId}/trans`, {
        method: "POST",
        headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newCompositeInvoice)
    })
}

function updateStatus(invoiceId : any, status: any) {
    console.log("inside express update status")
    return fetch(`${url}/${invoiceId}/status`, {
        method: "PUT",
        headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({pk: invoiceId, status: status})
    })
}


function appendCreds(login : any, compositeInvoice: any) {
    let trs = compositeInvoice.trans.map((t:any) => { return ({...t, created_by: login}) })
    let newCompositeInvoice = {...compositeInvoice, trans: trs}
    return newCompositeInvoice
}

// const getInvoice = async () =>{
//     try {
//         const responce = await fetch(url);
//         if(!responce.ok){
//             throw new Error(`HTTP Error ! status : ${responce.status}`);
//         }
//         const result = await responce.json();
//         return await result;
//     } catch (error) {
//         console.error("Error adding patient:", error);
//         throw error; 
//     }
// }

const getInvoice = async (status?: string) =>{
    try {
        const queryURL = status ? `${url}?status=${status}` : url
        const responce = await fetch(queryURL);
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

export {addInvoice , getInvoice , appendTransations , updateStatus}
