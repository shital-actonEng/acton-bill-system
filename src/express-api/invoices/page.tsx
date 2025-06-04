const url = `/api/invoice`

async function addInvoice(login: any, compositeInvoice: any) {
    let newCompositeInvoice = appendCreds(login, compositeInvoice)
    const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCompositeInvoice)
    })
    const result = await response.json();
    if (response.ok) {
        return result; 
    } else {
        console.error("Failed to create invoice", result.error || result);
        return null;
    }
}

function appendTransations(login: any, invoiceId: any, compositeInvoice: any) {
    let newCompositeInvoice = appendCreds(login, compositeInvoice)
    return fetch(`${url}/${invoiceId}/trans`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCompositeInvoice)
    })
}

function updateStatus(invoiceId: any, status: any) {
    console.log("inside express update status")
    return fetch(`${url}/${invoiceId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pk: invoiceId, status: status })
    })
}


function appendCreds(login: any, compositeInvoice: any) {
    let trs = compositeInvoice.trans.map((t: any) => { return ({ ...t, created_by: login }) })
    let newCompositeInvoice = { ...compositeInvoice, trans: trs }
    return newCompositeInvoice
}

const getInvoice = async (diagnosticCentreId?: number, fromDate?: string, toDate?: string, status?: string) => {
    try {
         let URL = url
         URL = status ? `${url}?status=${status}` : url
         URL = diagnosticCentreId ? `${url}?diagnosticCentreId=${diagnosticCentreId}&status=${status}` : URL
         if(fromDate || toDate){
            URL = `${url}?diagnosticCentreId=${diagnosticCentreId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}` 
         }
         console.log("date form url...", URL);
        // const queryStatusURL = status ? `${url}?status=${status}` : url
        // const queryDiagnosticCentreIdURL = diagnosticCentreId ? `${url}?diagnosticCentreId=${diagnosticCentreId}&status=${status}` : queryStatusURL
        const responce = await fetch(URL);
        if (!responce.ok) {
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
        const result = await responce.json();
        return await result;
    } catch (error) {
        console.error("Error adding patient:", error);
        throw error;
    }
}

const addPrintInvoice = async (data: any) => {
    try {
        const response = await fetch("/api/printInvoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("PDF generated successfully");
        } else {
            console.error("Failed to generate PDF", result.error || result);
        }
    } catch (error) {
        console.error("Error while calling printInvoice API:", error);
    }
};

const getPrintinvoice = async (id : any) => {
    try {
        const printInvoiceURL = `api/printInvoice?invoiceId=${id}` ;
        const responce = await fetch(printInvoiceURL);
        console.log("print invoice is..." , responce.url);
        if(!responce.ok){
             throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
        return responce.url;
    } catch (error) {
        console.log("Error is..." , error);
    }
}


export { addInvoice, getInvoice, appendTransations, updateStatus, addPrintInvoice, getPrintinvoice }
