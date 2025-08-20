import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// פונקציה לשליפת כישרון לפי ID
export const fetchTalentById = async (id: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Talent/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching talent by ID:', error);
      throw error;
    }
  };
  
  // פונקציה להבאת רשימת הכישורים לפי קטגורית האב
  export const fetchTalentsByParent = async (parentId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Talent/byParent/${parentId}`);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
  };
  