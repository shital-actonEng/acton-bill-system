const url = `/api/referrer`

const addReferrer = async (data : any) => {
  try {
      const responce = await fetch(url , {
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
      console.error("Error adding referrer:", error);
       throw error; 
  }
}

const getReferrer = async () =>{
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

// const updateReferrer = async (data : any) => {
//     console.log("update data is.. ", data)
//     try {
//         const responce = await fetch("/api/referrer" , {
//             method : "PUT",
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
//         console.error("Error Editing referrer:", error);
//          throw error; 
//     }
// }

const updateReferrer = async (data : any) => {
  try {
    console.log("before inside update in express...", data);
      const responce = await fetch("/api/referrer/" , {
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
        console.log("after inside update in express...", await responce.json());
  } catch (error) {
      console.error("Error update referrer:", error);
       throw error; 
  }
}

export {addReferrer , getReferrer , updateReferrer}