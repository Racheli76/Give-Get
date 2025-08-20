import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { jwtDecode } from 'jwt-decode';
import '../../styles/HeaderFooter.css';
import { getProfileImage } from '../../apis/userApi';
import Logo from '../../assets/images/logo.png';
import { HeaderFooterPropsType } from '../../Types/123types';


const HeaderFooter: React.FC<HeaderFooterPropsType> = ({ children }) => {
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  const messages = [
    "ברוכים הבאים לאתר של שולמית ורחלי אתר הכישרונות",
    "האתר שנותן במה לכישרונות שלכם",
    "Give&Get",
    "באו לתרום כשרון ולקנות כשרון חדש",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 10000); // Change message every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token); // Properly decode the token
      console.log('Decoded Token:', decodedToken); // Log the decoded token
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      setUser({ id: userId, name: userName });
      // Fetch user profile image
      getProfileImage(userId).then((imageUrl: string) => {
        setProfileImage(imageUrl);
      });
    }
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <AppBar position="sticky" className="app-bar">
        <Toolbar>

          {user ? (
            <div className="user-info">
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar alt={user.name} src={profileImage || undefined} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/profile')}>פרופיל</MenuItem>
                <MenuItem onClick={handleLogout}>התנתקות</MenuItem>
              </Menu>
              <Typography variant="body1" className="user-name">
                {user.name}
              </Typography>
            </div>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">התחברות</Button>
          )}

          <IconButton edge="start" color="inherit" component={RouterLink} to="/">
            <img src={Logo} alt="לוגו האתר" className="logo" />
          </IconButton>
          <Typography variant="h6" className="app-title animated-text">
            {messages[messageIndex]}
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">דף הבית</Button>
          <Button color="inherit" component={RouterLink} to="/about">אודות</Button>
          <Button color="inherit" component={RouterLink} to="/comments">תגובות</Button>
          <Button color="inherit" component={RouterLink} to="/talents">הכישרונות שלנו</Button>
        </Toolbar>
      </AppBar>

      <div className="content-container">
        {children}
      </div>

      <footer className="footer">
        <Container maxWidth="xl">
          <Typography variant="body2" align="center" id="footer-text">
            © 2025 אתר הכישרונות. כל הזכויות שמורות ️❤️ לרחלי ולשולמית❤.
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default HeaderFooter;