import api from "../request/axios";

export const loginUser = async (data) => {
  try {
    const response = await api.post('/auth/signIn', data);
    if(response?.data){
      sessionStorage.setItem("token", response?.data?.token);
        // localStorage.setItem("token",response?.data?.token)
    
    }
    return response.data;
  } catch (error) {
    // If the response is available (i.e., the server returned an error)
    if (error.response && error.response.data) {
      const errors = error.response.data.error;

      // If 'error' is an array, display each error
      if (Array.isArray(errors)) {
        errors.forEach((err) => {
         throw new Error(err);  // Display each error as a toast notification
        });
      } else {
        // If 'error' is not an array, show a single error message
      throw new Error(errors || 'Login failed. Please check your credentials.');
      }
    } else {
      // If there's no response or it's a network-related issue
       throw new Error('Login failed. Please check your credentials.');
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
  // You can implement logout functionality here, like clearing local storage, cookies, etc.
  sessionStorage.removeItem("token");
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