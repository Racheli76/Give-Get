import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchInspiration = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Inspiration`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      throw error;
    }
  };
  