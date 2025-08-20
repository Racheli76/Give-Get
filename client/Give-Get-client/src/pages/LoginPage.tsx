import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff, Home } from '@mui/icons-material';
import { loginUser } from '../apis/loginApi'; // פונקציה זו מבצעת את הבקשה לשרת
import '../styles/AuthForm.css';

function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    pwd: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    userName: false,
    pwd: false,
  });
  const navigate = useNavigate(); // הוסף את ה-navigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser(formData.userName, formData.pwd);
      console.log('Response from server:', response); // הדפסת תגובת השרת

      if (response) {  // לא בודקים response.token כי זה רק הטוקן עצמו
        console.log('Saving token:', response);
        localStorage.setItem('authToken', response); // שמור את הטוקן
        navigate('/profile'); // נווט לדף הפרופיל
      } else {
        console.error('No token received');
        setError('לא התקבל טוקן מהשרת');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'ההתחברות נכשלה');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form-login">
      <IconButton
        component={Link}
        to="/"
        className="home-icon"
        aria-label="Go to home"
      >
        <Home />
      </IconButton>
      <Typography variant="h6" className="form-title">התחברות</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="userName"
        label="שם משתמש"
        name="userName"
        autoComplete="username"
        autoFocus
        value={formData.userName}
        onChange={handleChange}
        error={fieldErrors.userName}
        helperText={fieldErrors.userName && "נא למלא שם משתמש"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="pwd"
        label="סיסמא"
        type={showPassword ? 'text' : 'password'}
        id="pwd"
        autoComplete="current-password"
        value={formData.pwd}
        onChange={handleChange}
        error={fieldErrors.pwd}
        helperText={fieldErrors.pwd && "נא למלא סיסמא"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" fullWidth variant="contained" className="submit-btn">
        התחברות
      </Button>
      <Typography variant="body2" className="register-link">
        עדיין לא רשום?{' '}
        <Link to="/register">
          הרשם אלינו
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
