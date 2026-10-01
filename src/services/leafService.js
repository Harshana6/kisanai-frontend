import API from "../api/axios";

export const diagnoseLeaf = async (image,language) => {

    const formData = new FormData();

    formData.append("image", image);
    formData.append("language", language);

    const response = await API.post(
        "/leaf/diagnose",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};