import { useEffect, useState } from 'react';
import { fetchUserData, updateUserData } from '../apis/userApi';

const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const data = await fetchUserData();
      // console.log('User data from API:', data); // הדפסה לקונסול
      if (JSON.stringify(data) !== JSON.stringify(user)) {  // אם המידע שונה
        setUser(data);  // עדכון הסטייט רק אם הנתונים השתנו
      }
      setErrorMessage(null); // איפוס הודעת השגיאה במקרה של הצלחה
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage('Error fetching user data');
    }
  };

  const updateUserDataAndRefresh = async (updatedData: any) => {
    if (!user) {
      setErrorMessage('User not found');
      return;
    }
    try {
      const updatedUser = await updateUserData(user.id, updatedData); // עדכון עם userId
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {  // אם המידע שונה
        setUser(updatedUser);  // עדכון הסטייט עם הנתונים החדשים
      }
    } catch (error) {
      // console.error('Error updating user data:', error);
      setErrorMessage('Error updating user data');
    }
  };

  // קריאה ראשונית לנתוני המשתמש
  useEffect(() => {
    if (!user) {
      fetchUser(); // קריאה רק אם אין נתונים
    }
  }, [user]); // התנאי הזה גורם לקריאה רק אם `user` משתנה

  return { user, errorMessage, refreshUserData: fetchUser, updateUserData: updateUserDataAndRefresh };
};

export default useUserData;
