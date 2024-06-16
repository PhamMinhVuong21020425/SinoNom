import axios from '../../axios';

const getAllUserModel = async () => {
    return axios.get('admin/get-usermodel');
};
const updateStatus = async (model_id, status) => {
    return axios.post('admin/update-status', {
        model_id: model_id,
        status: status,
    });
};
const deleteModel = async (model_id) => {
    return axios.post('admin/delete-model', {
        model_id: model_id,
    });
};

export { getAllUserModel, updateStatus, deleteModel };
