import http from "../axios";

export const getAPI = async (endpoint, params = {}) => {
  try {
    const response = await http.get(endpoint, { params });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const postAPI = async (endpoint, data) => {
  try {
    const response = await http.post(endpoint, data);
    if (response.data.status === 400) {
      return 'abc'
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const putAPI = async (endpoint, data) => {
  try {
    const response = await http.put(endpoint, data);

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const deleteAPI = async (endpoint, data) => {
  try {
    const response = await http.delete(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
