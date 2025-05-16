import api from "../request/axios";

export const loginUser = async (data) => {
  try {
    const response = await api.post('/auth/signIn', data);

    if (response?.data) {
      const { accessToken, refreshToken } = response.data;
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
    }

    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.error;
    if (Array.isArray(errors)) {
      throw new Error(errors.join(', '));
    } else {
      throw new Error(errors || 'Login failed. Please check your credentials.');
    }
  }
};


export const registerUser = async (data) => {
  try {
    const response = await api.post('/auth/signUp', data);
    return response.data;
  } catch (error) {
   
    throw new Error(error?.response?.data?.error ||'Registration failed. Please try again.');
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
  window.location.href = '/login';
};

export const authUser=async()=>{
 try{
   const response=await api.get("/auth/me")
    return response.data;
  
 }
 catch(err){
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}


// all users by admin
export const fetchUsers=async()=>{
 try{
   const response=await api.get("/users")
    return response.data;
  
 }
 catch(err){
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}