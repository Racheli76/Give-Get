import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// פונקציה לשליפת תגובות
export const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Comment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
};

// פונקציה להוספת תגובה חדשה
export const addComment = async (content: string) => {
    const formData = new FormData();
    formData.append('content', content);
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/Comment`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`      },
          withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
};