
 const url = `/api/patient`

const addPatient = async (data : any) => {
    try {
        const responce = await fetch("/api/patient" , {
            method : "POST",
            headers : {
                 "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        })
        if(!responce.ok)
        {
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
    } catch (error) {
        console.error("Error adding patient:", error);
         throw error; 
    }
}

const updatePatient = async(pk:number, data : any) =>{
    try {
        const response = await fetch(`/api/patient/${pk}` , {
            method : "PUT",
            headers : {
                 "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const text = await response.text();

        if (!response.ok) {
            const errorData = text ? JSON.parse(text) : { message: "Unknown error" };
            throw new Error(errorData.message || `Failed to update patient, status ${response.status}`);
        }

        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error("Error adding patient:", error);
        throw error; 
    }
}

const getPatients = async () =>{
    try {
        const responce = await fetch(url);
        console.log(responce);
        if(!responce.ok){
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
        const result = await responce.json();
        console.log(result);
        return await result;
    } catch (error) {
        console.error("Error adding patient:", error);
        throw error; 
    }
}

export  {addPatient , getPatients , updatePatient}
