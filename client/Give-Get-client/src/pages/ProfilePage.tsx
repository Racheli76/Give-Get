import React, { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import useTalents from '../hooks/useTalents';
import '../styles/Profile.css';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Avatar, Typography, Button } from '@mui/material';
import UpdateProfile from '../components/specific/UpdateProfile';
import Exchange from '../components/specific/Exchange';
import TalentRequests from '../components/specific/TalentRequests';
import ProfileDetails from '../components/specific/ProfileDetails';
import ProfileTalents from '../components/specific/ProfileTalents';

const Profile = () => {
  const { user, errorMessage: userError, refreshUserData } = useUserData();
  const { talents, errorMessage: talentsError, fetchUserTalents } = useTalents(user?.id);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // אם אין משתמש, אין צורך לבצע את הקריאה
    if (user) {
      const refreshData = async () => {
        await refreshUserData(); // רענון נתוני המשתמש
        await fetchUserTalents(); // רענון נתוני הכישרונות
      };
      refreshData();
    }
  }, [user, refreshUserData, fetchUserTalents]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleViewDetails = async () => {
    try {
      await refreshUserData(); // רענון נתוני המשתמש
      navigate('/profile');
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const handleViewTalents = async () => {
    setErrorMessage(null);
    await fetchUserTalents(); // רענון נתוני הכישרונות
    navigate('/profile/talents');
  };

  const handleUpdateProfile = () => {
    setErrorMessage(null);
    navigate('/profile/update');
  };

  const handleViewMatches = () => {
    setErrorMessage(null);
    navigate(`/profile/exchange?userId=${user.id}`);
  };

  const handleViewTalentRequests = () => {
    setErrorMessage(null);
    navigate('/profile/talent-requests');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="header-buttons">
        <button onClick={handleLogout} className="logout-button">
          התנתקות
        </button>
        <IconButton onClick={() => navigate('/')} className="home-button">
          <HomeIcon />
        </IconButton>
      </div>
      <div className="profile-content">
        <div className="sidebar">
          <Button onClick={handleViewDetails} className="menu-button">פרטים</Button>
          <Button onClick={handleViewTalents} className="menu-button">כשרונות</Button>
          <Button onClick={handleUpdateProfile} className="menu-button">עדכון פרופיל</Button>
          <Button onClick={handleViewMatches} className="menu-button">התאמות</Button>
          {user.isAdmin && (
            <Button onClick={handleViewTalentRequests} className="menu-button">
              ניהול בקשת הכשרונות
            </Button>
          )}
        </div>
        <div className="main-content">
          <div className="profile-header">
            <Avatar alt={user.userName} src={user.profileImageUrl} className="profile-image" />
            <Typography variant="h6" className="profile-title">שלום, {user.userName}</Typography>
          </div>

          {(errorMessage || userError || talentsError) && (
            <div className="error-message">{errorMessage || userError || talentsError}</div>
          )}
          <Routes>
            <Route path="/" element={<ProfileDetails user={user} />} />
            <Route path="talents" element={<ProfileTalents talents={talents} />} />
            <Route path="update" element={<UpdateProfile />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="talent-requests" element={<TalentRequests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;