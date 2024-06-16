import axios from '../../axios';
const handleLoginApi = async (email, password) => {
    return axios.post('user/login', { email: email, password: password });
};
const handleSignUpApi = async (email, password, gender, name, phone) => {
    return axios.post('user/sign-up', {
        email: email,
        password: password,
        gender: gender,
        full_name: name,
        phone: phone,
    });
};

const handleCreateModel = async (userId, modelName, status, description, content, format) => {
    const d = new Date();
    return axios.post('user/upload-model', {
        user_id: userId,
        name: modelName,
        model_date: d.toLocaleDateString(),
        status: status,
        description: description,
        content: content,
        format: format,
    });
};
const getAllModelById = async (userId) => {
    return axios.post('user/get-model', {
        user_id: userId,
    });
};

export { handleLoginApi, handleSignUpApi, handleCreateModel, getAllModelById };
