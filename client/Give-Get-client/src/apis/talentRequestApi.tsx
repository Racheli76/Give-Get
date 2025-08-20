import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// פונקציה להוספת בקשת כישרון חדשה
export const addTalentRequest = async (talentRequest: { UserId: number; TalentName: string; ParentCategory: number; RequestDate: Date; }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/TalentRequest`, talentRequest, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// פונקציה לשליפת בקשות הכישרונות
  export const fetchTalentRequests = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/TalentRequest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// פונקציה למחיקת בקשת כישרון
  export const deleteTalentRequest = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      await axios.delete(`${API_BASE_URL}/TalentRequest/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// פונקציה לעדכון בקשת כישרון
  export const updateTalentRequest = async (id: number, updatedTalent: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      await axios.put(`${API_BASE_URL}/TalentRequest/${id}`, updatedTalent, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};