import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (userName: string, pwd: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Login`, null, {
        params: { userName, pwd }
      });
  
      console.log('Server response:', response.data); // נבדוק מה מחזיר השרת
  
      if (response.data) {
        localStorage.setItem('authToken', response.data); // שומר את הטוקן נכון
      } else {
        throw new Error('No token received from server'); // במידה ואין טוקן, תזרוק שגיאה ברורה
      }
  
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response ? error.response.data : error.message;
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };