 const url = `/api/diagnosticCenter`

 const getDiagnosticCenter = async () =>{
     try {
         const responce = await fetch(url);
         console.log(responce);
         if(!responce.ok){
             throw new Error(`HTTP Error ! status : ${responce.status}`);
         }
         const result = await responce.json();
         console.log("branches are in get method...",result);
         return await result;
     } catch (error) {
         console.error("Error adding patient:", error);
         throw error; 
     }
 }

 export {getDiagnosticCenter}