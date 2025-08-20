import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchDealsByUser = async (userId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${API_BASE_URL}/exchange/searchByUser?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
};

export const updateDealStatus = async (exchangeId: number, status: number, userId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.put(`${API_BASE_URL}/Exchange/update-status`, null, {
        params: {
          exchangeId,
          status,
          userId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};