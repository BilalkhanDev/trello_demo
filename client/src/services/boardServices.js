import api from "../request/axios";

export const fetchBoard = async (page=1, limit=10) => {
  try {
    const response = await api.get(`/board/all?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errors = error.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
         throw new Error(err);  
        });
      } else {
      throw new Error(errors || 'Failed to Fetch Boards');
      }
    } else {
       throw new Error('Failed To Fetch Board');
    }
  }
};


export const fetchUserBoard = async (page=1, limit=10) => {
  try {
    const response = await api.get(`/board/specific-user?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errors = error.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
         throw new Error(err);  
        });
      } else {
      throw new Error(errors || 'Failed to Fetch Boards');
      }
    } else {
       throw new Error('Failed To Fetch Board');
    }
  }
};
export const createBoard = async (data) => {
  try {
    const response = await api.post(`board/create`,data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errors = error.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
         throw new Error(err);  
        });
      } else {
      throw new Error(errors || 'Failed to Fetch Boards');
      }
    } else {
       throw new Error('Failed To Fetch Board');
    }
  }
};
/// Update Boarsd 



export const updateBoard = async (id,data) => {
  try {
    const response = await api.put(`board/update/${id}`,data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errors = error.response.data.error;

      if (Array.isArray(errors)) {
        errors.forEach((err) => {
         throw new Error(err);  
        });
      } else {
      throw new Error(errors || 'Failed to Fetch Boards');
      }
    } else {
       throw new Error('Failed To Fetch Board');
    }
  }
};