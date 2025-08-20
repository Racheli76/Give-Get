import axios from 'axios';
import { MessageType } from '../Types/123types';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



export const getChatHistory = async (exchangeId: number): Promise<MessageType[]> => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }


  const response = await axios.get(`${API_BASE_URL}/Chat/history/${exchangeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("API response:", response.data);

  
  return response.data;
};
