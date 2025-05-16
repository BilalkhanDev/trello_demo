import api from "../request/axios";

export const fetchTickets=async(boardId)=>{
 try{
   const response=await api.get(`/ticket/${boardId}`)
    return response.data;
  
 }
 catch(err){
    console.log("Tickets Error", err)
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}

//creatr ticket
export const createTicket=async(boardId,data)=>{
 try{
   const response=await api.post(`/ticket/create/${boardId}`,data)
    return response.data;
  
 }
 catch(err){
    console.log("Tickets Error", err)
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}
// Update Tocket 


export const updateTickets=async(Id,data)=>{
  console.log(data)
 try{
   const response=await api.put(`/ticket/update/${Id}`,data)
    return response.data;
 }
 catch(err){
    console.log("Tickets Error", err)
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}

// Upfdate ticket sttaus and comment by user  !admin



export const updateTicketByUser=async(Id,data)=>{
 try{
   const response=await api.put(`/ticket/update-status/${Id}`,data)
    return response.data;
  
 }
 catch(err){
    console.log("Tickets Error", err)
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}


// update order of tickets
export const updateTicketOrder=async(data)=>{
 try{
   const response=await api.put(`/ticket/update-order`,data)
    return response.data;
  
 }
 catch(err){
    console.log("Tickets Error", err)
   throw new Error(err?.response?.data?.error ||'Invalid Request');
 }
}