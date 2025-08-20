import React, { useEffect, useState } from 'react';
import { fetchTopUsers,getProfileImage} from '../../apis/userApi';
import '../../styles/TopUsers.css';
import { TopUserType } from '../../Types/123types';
import defaultUserImage from '../../assets/images/default-user.png';

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<(TopUserType & { profileImage: string })[]>([]); // הוספת profileImage דינמית
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        const users = await fetchTopUsers();
    
        // שליפת תמונת הפרופיל עבור כל משתמש
        const usersWithImages = await Promise.all(
          users.map(async (user: TopUserType) => {
            // שליפת המזהה מתוך ה-URL של תמונת הפרופיל
            const userId = user.profileImageUrl.split('/').pop(); // חיתוך ה-URL והפקת המזהה
            let profileImage = '';
    
            if (userId) {
              try {
                profileImage = await getProfileImage(Number(userId)); // שליחה של המזהה לפונקציה
              } catch (error) {
                console.error('Error fetching profile image for user:', userId, error);
                profileImage =defaultUserImage; // תמונת ברירת מחדל במקרה של שגיאה
              }
            }
    
            return { ...user, profileImage }; // הוספת תמונת הפרופיל למידע של המשתמש
          })
        );
    
        setTopUsers(usersWithImages);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };
    

    getTopUsers();
  }, []);

  if (loading) {
    return <div className="loading">טוען משתמשים מובילים...</div>;
  }

  return (
    <div className="top-users-container">
      <h2>משתמשים מובילים</h2>
      <ul className="top-users-list">
        {topUsers.map((user, index) => (
          <li key={index} className="top-user-item">
            <img src={user.profileImage} alt={user.userName} className="user-image" />
            <div className="user-details">
              <h3>{user.userName}</h3>
              <p>ציון: {user.score}</p>
              <p>{user.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;
