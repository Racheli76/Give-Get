import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Profile from './pages/ProfilePage'; // הנתיב שלך לדף פרופיל
import UpdateProfile from './components/specific/UpdateProfile';
import Comments from './pages/CommentsPage';
import Talents from './pages/TalentsPage';
import About from './pages/AboutPage';
import TalentRequests from './components/specific/TalentRequests';
import Exchange from './components/specific/Exchange';
import ChatPage from './pages/ChatPage';
import HeaderFooter from './components/common/HeaderFooter';
// import ExchangePage from './pages/ExchangePage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffb562',
    },
    secondary: {
      main: '#ffb562',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <HeaderFooter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/talents" element={<Talents />} />
            <Route path="/about" element={<About />} />
            <Route path="/talent-requests" element={<TalentRequests />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/chat/:exchangeId" element={<ChatPage />} />
          </Routes>
        </HeaderFooter>
      </Router>
    </ThemeProvider>
  );
};

export default App;