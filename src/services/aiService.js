import API from "../api/axios";

export const askAI = async (data) => {

    const response = await API.post("/ai/ask", data);

    return response.data;
};