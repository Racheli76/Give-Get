import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// פונקציה להבאת כישורים לפי מזהה משתמש
export const fetchTalentsByUserId = async (userId: number) => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/TalentUser/getTalents/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  };