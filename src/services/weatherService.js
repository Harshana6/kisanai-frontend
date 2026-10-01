import API from "../api/axios";


export const getWeather = async (language) => {
    const res = await API.get(`/weather?language=${language}`);

    console.log(res.data);

    return res.data;
}