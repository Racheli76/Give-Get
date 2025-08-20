import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEvent, MutableRefObject } from 'react';
import { UserType } from '../../Types/123types';

export type PersonalDetailsFormProps = {
  formData: Pick<UserType, "userName" | "email" | "phoneNumber" | "age" | "gender" | "desc"> & {
    password: string;
  };
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Partial<Record<keyof PersonalDetailsFormProps["formData"], boolean>>;
  usernameRef: MutableRefObject<HTMLInputElement | null>;
  emailRef: MutableRefObject<HTMLInputElement | null>;
  passwordRef: MutableRefObject<HTMLInputElement | null>;
  ageRef: MutableRefObject<HTMLInputElement | null>;
  genderRef: MutableRefObject<HTMLInputElement | null>;
  phoneNumberRef: MutableRefObject<HTMLInputElement | null>;
  descRef: MutableRefObject<HTMLInputElement | null>;
  showPassword: boolean;
  handleClickShowPassword: () => void;
};

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  handleChange,
  fieldErrors,
  usernameRef,
  emailRef,
  passwordRef,
  ageRef,
  genderRef,
  phoneNumberRef,
  descRef,
  showPassword,
  handleClickShowPassword
}) => {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="שם משתמש"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.userName}
        onChange={handleChange}
        error={fieldErrors.userName}
        helperText={fieldErrors.userName && 'נא למלא שם משתמש'}
        inputRef={usernameRef}
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
        helperText={fieldErrors.email && 'נא למלא כתובת אימייל תקינה'}
        inputRef={emailRef}
      />
      <TextField
        margin="normal"
        fullWidth
        name="password"
        label="סיסמא"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        helperText={fieldErrors.password && 'נא למלא סיסמא'}
        inputRef={passwordRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
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
        value={Number(formData.age)} 
        onChange={handleChange}
        error={fieldErrors.age}
        helperText={fieldErrors.age && 'נא למלא גיל תקין'}
        inputRef={ageRef}
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
        helperText={fieldErrors.gender && 'נא לבחור מין'}
        inputRef={genderRef}
      >
        <MenuItem value="Male">זכר</MenuItem>
        <MenuItem value="Female">נקבה</MenuItem>
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
        helperText={fieldErrors.phoneNumber && 'נא למלא מספר טלפון'}
        inputRef={phoneNumberRef}
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
        helperText={fieldErrors.desc && 'נא למלא תיאור'}
        inputRef={descRef}
      />
    </>
  );
};

export default PersonalDetailsForm;
