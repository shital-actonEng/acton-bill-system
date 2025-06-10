
 const url = `/api/patient`

const addPatient = async (data : any) => {
    try {
        const responce = await fetch(url , {
            method : "POST",
            headers : {
                 "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        })
        const result = responce.json();
        if(!responce.ok)
        {
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
         return result;
    } catch (error) {
        console.error("Error adding patient:", error);
         throw error; 
    }
}

const updatePatient = async (data : any) => {
    try {
        const responce = await fetch(url , {
            method : "PUT",
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
        console.error("Error Editing patient:", error);
         throw error; 
    }
}

const getPatients = async (name?: string ) =>{
    try {
        let URL = url;
        URL = name ? `${url}?name=${name}` : url 
        const responce = await fetch(URL);
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
