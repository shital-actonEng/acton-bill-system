
const URL = 'api/testRecord'

const addTest = async (data: any) => {
  try {
    const responce = await fetch(URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    if(!(await responce).ok){
      throw new Error(`HTTP Error ! status : ${responce.status}`);
    }
  } catch (error) {
    console.log("Failed to add Test from client side...", error);
    throw error;
  }
}

const getTest = async () =>{
    try {
        const responce = await fetch(URL);
        console.log(responce);
        if(!responce.ok){
            throw new Error(`HTTP Error ! status : ${responce.status}`);
        }
        const result = await responce.json();
        // console.log("result of test is...",result);
        return await result;
    } catch (error) {
        console.error("Error adding Test:", error);
        throw error; 
    }
}

const updateTest = async (data : any) => {
    try {
        const responce = await fetch(URL , {
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
        console.error("Error Editing Test:", error);
         throw error; 
    }
}

export { addTest , getTest , updateTest}
