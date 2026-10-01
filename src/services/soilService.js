import API from "../api/axios";

export const analyzeSoil = async(data)=>{

    const response = await API.post("/soil/analyze",data);

    return response.data;

}