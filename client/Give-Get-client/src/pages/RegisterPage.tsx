import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, IconButton, InputAdornment, Alert, Snackbar, FormControl, InputLabel, Select, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import { Visibility, VisibilityOff,Home } from '@mui/icons-material';
import {  fetchTalentsByParent } from '../apis/talentApi';
import { registerUser} from '../apis/userApi';
import { useNavigate,Link } from 'react-router-dom';
import '../styles/AuthForm.css';
import axios from 'axios';
import {TalentType} from '../Types/123types';
import { validateEmail, validatePhoneNumber, validateAge } from '../utils/validation';


const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'Female',
    desc: '',
    profileImage: null as File | null,
    phoneNumber: '',
    offeredTalents: [] as number[],
    wantedTalents: [] as number[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    email: false,
    password: false,
    age: false,
    gender: false,
    phoneNumber: false,
    desc: false,
  });
  const [talents, setTalents] = useState<TalentType[]>([]);
  const [subTalents, setSubTalents] = useState<{ [key: number]: TalentType[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetchTalentsByParent(0);
        setTalents(response);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };

    fetchTalents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
      setFileName(e.target.files[0].name);
    }
  };

  const handleTalentChange = (e: SelectChangeEvent<number[]>, type: 'offered' | 'wanted') => {
    const value = e.target.value as number[];
    setFormData({
      ...formData,
      [type === 'offered' ? 'offeredTalents' : 'wantedTalents']: value,
    });

    const selectedTalentId = value[value.length - 1];
    const selectedTalent = talents.find(talent => talent.id === selectedTalentId);
    if (selectedTalent && selectedTalent.parentCategory === 0) {
      fetchTalentsByParent(selectedTalentId).then(response => {
        setSubTalents(prev => ({ ...prev, [selectedTalentId]: response }));
      }).catch(error => {
        console.error('Error fetching sub-talents:', error);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      username: !formData.username,
      email: !formData.email || !validateEmail(formData.email),
      password: !formData.password,
      age: !formData.age || !validateAge(formData.age),
      gender: !formData.gender,
      phoneNumber: !formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber),
      desc: !formData.desc,
    };

    if (Object.values(newFieldErrors).some(error => error)) {
      setFieldErrors(newFieldErrors);
      setError('נא למלא את כל השדות החובה המסומנים באדום.');
      return;
    }

    setError(null);

    try {
      const formDataToSend = new FormData();
  
      Object.keys(formData).forEach(key => {
          const value = formData[key as keyof typeof formData];
          if (value !== null && key !== 'offeredTalents' && key !== 'wantedTalents') {
              if (key === 'password') {
                  formDataToSend.append('hashPwd', value as string);
              } else {
                  formDataToSend.append(key, value as string | Blob);
              }
          }
      });

      const talentsToSend = JSON.stringify([
          ...(formData.offeredTalents || []).map((talentId: number) => {
              const hasSubTalent = subTalents[talentId]?.some(sub => formData.offeredTalents.includes(sub.id));
              return hasSubTalent ? null : { TalentId: talentId, IsOffered: true };
          }).filter(Boolean),
          ...(formData.wantedTalents || []).map((talentId: number) => {
              const hasSubTalent = subTalents[talentId]?.some(sub => formData.wantedTalents.includes(sub.id));
              return hasSubTalent ? null : { TalentId: talentId, IsOffered: false };
          }).filter(Boolean)
      ]);
  
      formDataToSend.append('talents', talentsToSend);
  
      if (formData.profileImage) {
          formDataToSend.append('File', formData.profileImage);
      }
  
      const response = await registerUser(formDataToSend);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Redirect to login after success
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || 'הרישום נכשל');
      } else {
        setError('הרישום נכשל');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
      <IconButton
      component={Link}
      to="/"
      className="home-icon"
      aria-label="Go to home"
    >
      <Home />
    </IconButton>
      <Typography variant="h6" className="form-title">הרשמה</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success">
            הרישום התבצע בהצלחה!!
          </Alert>
        </Snackbar>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="שם משתמש"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        error={fieldErrors.username}
        helperText={fieldErrors.username && "נא למלא שם משתמש"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="כתובת אימייל"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        helperText={fieldErrors.email && "נא למלא כתובת אימייל תקינה"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="סיסמא"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        helperText={fieldErrors.password && "נא למלא סיסמא"}
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
      <TextField
        margin="normal"
        required
        fullWidth
        name="age"
        label="גיל"
        type="number"
        id="age"
        value={formData.age}
        onChange={handleChange}
        error={fieldErrors.age}
        helperText={fieldErrors.age && "נא למלא גיל תקין"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="gender"
        label="מין"
        select
        value={formData.gender}
        onChange={handleChange}
        error={fieldErrors.gender}
        helperText={fieldErrors.gender && "נא לבחור מין"}
      >
        <MenuItem value="Male">בן</MenuItem>
        <MenuItem value="Female">בת</MenuItem>
      </TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        name="phoneNumber"
        label="מספר טלפון"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={fieldErrors.phoneNumber}
        helperText={fieldErrors.phoneNumber && "נא למלא מספר טלפון תקין"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="desc"
        label="תיאור"
        multiline
        rows={4}
        value={formData.desc}
        onChange={handleChange}
        error={fieldErrors.desc}
        helperText={fieldErrors.desc && "נא למלא תיאור"}
      />
      <FormControl margin="normal" fullWidth>
        <InputLabel id="offered-talents-label">כישורים מוצעים</InputLabel>
        <Select
          labelId="offered-talents-label"
          multiple
          value={formData.offeredTalents}
          onChange={(e) => handleTalentChange(e, 'offered')}
          renderValue={(selected) => selected.map(id => talents.find(talent => talent.id === id)?.talentName || '').join(', ')}
        >
          {talents.map((talent) => (
            <MenuItem key={talent.id} value={talent.id}>
              <Checkbox checked={formData.offeredTalents.indexOf(talent.id) > -1} />
              <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.offeredTalents.map(talentId => (
        subTalents[talentId] &&
        <FormControl key={talentId} margin="normal" fullWidth>
          <InputLabel id={`sub-talents-label-${talentId}`}>תתי כישורים מוצעים ל-{talents.find(talent => talent.id === talentId)?.talentName}</InputLabel>
          <Select
            labelId={`sub-talents-label-${talentId}`}
            multiple
            value={formData.offeredTalents}
            onChange={(e) => handleTalentChange(e, 'offered')}
            renderValue={(selected: any) => subTalents[talentId].filter(talent => selected.includes(talent.id)).map(talent => talent.talentName).join(', ')}
          >
            {subTalents[talentId].map((subTalent) => (
              <MenuItem key={subTalent.id} value={subTalent.id}>
                <Checkbox checked={formData.offeredTalents.indexOf(subTalent.id) > -1} />
                <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <FormControl margin="normal" fullWidth>
        <InputLabel id="wanted-talents-label">כישורים רצויים</InputLabel>
        <Select
          labelId="wanted-talents-label"
          multiple
          value={formData.wantedTalents}
          onChange={(e) => handleTalentChange(e, 'wanted')}
          renderValue={(selected) => selected.map(id => talents.find(talent => talent.id === id)?.talentName || '').join(', ')}
        >
          {talents.map((talent) => (
            <MenuItem key={talent.id} value={talent.id}>
              <Checkbox checked={formData.wantedTalents.indexOf(talent.id) > -1} />
              <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.wantedTalents.map(talentId => (
        subTalents[talentId] &&
        <FormControl key={talentId} margin="normal" fullWidth>
          <InputLabel id={`sub-talents-label-${talentId}`}>תתי כישורים רצויים ל-{talents.find(talent => talent.id === talentId)?.talentName}</InputLabel>
          <Select
            labelId={`sub-talents-label-${talentId}`}
            multiple
            value={formData.wantedTalents}
            onChange={(e) => handleTalentChange(e, 'wanted')}
            renderValue={(selected: any) => subTalents[talentId].filter(talent => selected.includes(talent.id)).map(talent => talent.talentName).join(', ')}
          >
            {subTalents[talentId].map((subTalent) => (
              <MenuItem key={subTalent.id} value={subTalent.id}>
                <Checkbox checked={formData.wantedTalents.indexOf(subTalent.id) > -1} />
                <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Button variant="contained" component="label" fullWidth className="upload-btn">
        העלאת תמונת פרופיל
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {fileName && (
        <Box sx={{ mt: 1, p: 1, border: '1px dashed grey', borderRadius: '4px' }}>
          {fileName}
        </Box>
      )}
      <Button type="submit" fullWidth variant="contained" className="submit-btn">
        הרשמה
      </Button>
      <Typography variant="body2" className="register-link">
      כבר רשום?{' '}
      <Link to="/login">
        התחבר
      </Link>
    </Typography>
    </Box>
  );
}

export default Register;
