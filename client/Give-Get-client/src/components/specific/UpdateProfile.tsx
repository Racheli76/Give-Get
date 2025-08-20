import React, { useState, useEffect, useRef } from 'react';
import { Button, Box, Typography, Alert, Snackbar, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUserData } from '../../apis/userApi';
import { fetchTalentsByParent } from '../../apis/talentApi';
import { fetchTalentsByUserId } from '../../apis/talentUserApi';
import { TalentType, TalentUserType, UserType } from '../../Types/123types';
import { validateEmail, validatePhoneNumber, validateAge } from '../../utils/validation';
import '../../styles/AuthForm.css';
import PersonalDetailsForm from './PersonalDetailsForm';
import useUserData from '../../hooks/useUserData';
import useTalents from '../../hooks/useTalents';
import TalentSelection from './TalentSelection'; // עדכן את הנתיב בהתאם למיקום הקובץ

const UpdateProfile = () => {


  const [formData, setFormData] = useState<Pick<UserType, "userName" | "email" | "phoneNumber" | "age" | "gender" | "desc"> & {
    password: string;
    profileImage: File | null;
    offeredTalents: number[];
    wantedTalents: number[];
  }>({
    userName: '',
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
  const [userId, setUserId] = useState<number | null>(null);
  const [talents, setTalents] = useState<TalentType[]>([]);
  const [subTalents, setSubTalents] = useState<{ [key: number]: TalentType[] }>({});
  const { fetchUserTalents } = useTalents(userId ?? 0);
  const { refreshUserData } = useUserData();


  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData.id === userId) {
          // מונע עדכון במידה והנתונים לא השתנו
          return;
        }
        setUserId(userData.id);

        const talentsData = await fetchTalentsByUserId(userData.id);
        const offeredTalents = talentsData.filter((talent: TalentUserType) => talent.isOffered).map((talent: TalentUserType) => talent.talentId);
        const wantedTalents = talentsData.filter((talent: TalentUserType) => !talent.isOffered).map((talent: TalentUserType) => talent.talentId);

        // Fetch all talents and sub-talents
        const allTalents = await fetchAllTalentsWithSubTalents();

        // Ensure parent talents are selected if any sub-talents are selected
        const parentOfferedTalents = new Set<number>(offeredTalents);
        const parentWantedTalents = new Set<number>(wantedTalents);

        Object.keys(allTalents).forEach((parentId: string) => {
          const parentIntId = parseInt(parentId, 10);
          if (allTalents[parentIntId]?.some((subTalent: TalentType) => offeredTalents.includes(subTalent.id))) {
            parentOfferedTalents.add(parentIntId);
          }
          if (allTalents[parentIntId]?.some((subTalent: TalentType) => wantedTalents.includes(subTalent.id))) {
            parentWantedTalents.add(parentIntId);
          }
        });

        setFormData({
          userName: userData.userName,
          email: userData.email,
          password: '',
          age: userData.age,
          gender: userData.gender === 0 ? 'Male' : 'Female',
          desc: userData.desc,
          profileImage: null,
          phoneNumber: userData.phoneNumber,
          offeredTalents: Array.from(parentOfferedTalents),
          wantedTalents: Array.from(parentWantedTalents),
        });
        setFileName(userData.profile);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('שגיאה בקבלת נתוני המשתמש');
      }
    };

    const fetchAllTalentsWithSubTalents = async () => {
      try {
        const response = await fetchTalentsByParent(0);
        setTalents(response);
        const allTalents: { [key: number]: TalentType[] } = {};
        await Promise.all(response.map(async (talent: TalentType) => {
          const subTalentsResponse = await fetchTalentsByParent(talent.id);
          allTalents[talent.id] = subTalentsResponse;
          setSubTalents(prevSubTalents => ({
            ...prevSubTalents,
            [talent.id]: subTalentsResponse,
          }));
        }));
        return allTalents;
      } catch (error) {
        console.error('Error fetching all talents:', error);
        return {};
      }
    };

    getUserData();
  }, [navigate, userId]);



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
    } else {
      setFormData({
        ...formData,
        profileImage: null,
      });
    }
  };

  const handleTalentChange = async (e: SelectChangeEvent<number[]>, type: 'offered' | 'wanted') => {
    const selectedTalents = e.target.value as number[];

    // Check if any parent talent is being deselected
    const deselectedParents = formData[type === 'offered' ? 'offeredTalents' : 'wantedTalents'].filter(talentId => !selectedTalents.includes(talentId));

    // Collect all sub-talents of the deselected parent talents
    const subTalentsToDeselect = deselectedParents.flatMap(parentId => {
      return subTalents[parentId]?.map(subTalent => subTalent.id) || [];
    });

    // Create the final list of selected talents, excluding sub-talents of deselected parents
    const finalSelectedTalents = selectedTalents.filter(talentId => !subTalentsToDeselect.includes(talentId));

    setFormData((prevData) => ({
      ...prevData,
      [type === 'offered' ? 'offeredTalents' : 'wantedTalents']: finalSelectedTalents,
    }));

    // Fetch sub-talents for the newly selected main talents
    for (const talentId of finalSelectedTalents) {
      if (!subTalents[talentId]) {
        try {
          const response = await fetchTalentsByParent(talentId);
          setSubTalents((prevSubTalents) => ({
            ...prevSubTalents,
            [talentId]: response,
          }));
        } catch (error) {
          console.error('Error fetching sub-talents:', error);
        }
      }
    }
  };


  // יצירת refs עבור כל אחד מהשדות בטופס
  const errorRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      username: !formData.userName,
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
      // גלילה לשדה הראשון שיש בו שגיאה
      if (newFieldErrors.username) {
        usernameRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.email) {
        emailRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.password) {
        passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.age) {
        ageRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.gender) {
        genderRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.phoneNumber) {
        phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.desc) {
        descRef.current?.scrollIntoView({ behavior: 'smooth' });
      }

      return;
    }

    // בדיקה אם יש כשרון שנבחר גם ברשימת הכשרונות המוצעים וגם ברשימת הכשרונות הרצויים
    const commonTalents = formData.offeredTalents.filter(talentId => formData.wantedTalents.includes(talentId));

    const hasCommonParentTalentWithDifferentSubTalents = commonTalents.some(talentId => {
      const offeredSubTalents = subTalents[talentId]?.filter(subTalent => formData.offeredTalents.includes(subTalent.id)) || [];
      const wantedSubTalents = subTalents[talentId]?.filter(subTalent => formData.wantedTalents.includes(subTalent.id)) || [];

      const isParentTalentWithoutSubTalents = offeredSubTalents.length === 0 && wantedSubTalents.length === 0;

      // אם זה שני תתי כשרונות ואותו אב אך התתי כשרונות שונים זה כן טוב
      const hasDifferentSubTalents = offeredSubTalents.length > 0 && wantedSubTalents.length > 0 && !offeredSubTalents.every(subTalent => wantedSubTalents.includes(subTalent));

      return isParentTalentWithoutSubTalents || !hasDifferentSubTalents;
    });

    if (commonTalents.length > 0 && hasCommonParentTalentWithDifferentSubTalents) {
      setError('אין אפשרות לבחור את אותו כשרון גם ברשימת הכשרונות המוצעים וגם ברשימת הכשרונות הרצויים.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // סינון הכשרונות
    const filterTalents = (talentIds: number[], otherTalentIds: number[]) => {
      const filteredTalents: Set<number> = new Set();

      talentIds.forEach(talentId => {
        const subTalentIds = subTalents[talentId] || [];
        let hasSelectedSubTalent = false;

        subTalentIds.forEach(subTalent => {
          if (formData.offeredTalents.includes(subTalent.id) || formData.wantedTalents.includes(subTalent.id)) {
            filteredTalents.add(subTalent.id);
            hasSelectedSubTalent = true;
          }
        });

        // אם לא נבחרו תתי-כשרונות, נוסיף את כשרון האב
        if (!hasSelectedSubTalent) {
          filteredTalents.add(talentId);
        }
      });

      return Array.from(filteredTalents).filter(talentId => !otherTalentIds.includes(talentId));
    };

    const finalOfferedTalents = filterTalents(formData.offeredTalents, formData.wantedTalents);
    const finalWantedTalents = filterTalents(formData.wantedTalents, formData.offeredTalents);

    const talentsToSend = [
      ...finalOfferedTalents.map(talentId => ({ TalentId: talentId, IsOffered: true })),
      ...finalWantedTalents.map(talentId => ({ TalentId: talentId, IsOffered: false })),
    ];

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

      if (formData.profileImage && formData.profileImage.name !== 'default_profile_image.png') {
        formDataToSend.append('File', formData.profileImage);
      } else {
        formDataToSend.append('ProfileImage', 'null');
        formDataToSend.append('File', 'null');
      }

      if (talentsToSend.length > 0) {
        formDataToSend.append('talents', JSON.stringify(talentsToSend));
      } else {
        formDataToSend.append('talents', JSON.stringify([]));
      }

      const response = await updateUserData(userId!, formDataToSend);
      await refreshUserData(); // רענון נתוני המשתמש
      await fetchUserTalents(); // רענון נתוני הכישרונות

      console.log('Update successful:', response);
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile'); // חזרה לדף הפרופיל
      }, 2000);
    } catch (error: any) {
      console.error('Update failed:', error);
      setError(error.message || 'העדכון נכשל');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isTalentChecked = (talentId: number, type: 'offered' | 'wanted') => {
    const selectedTalents = type === 'offered' ? formData.offeredTalents : formData.wantedTalents;

    // Check if the talent is selected directly or any of its sub-talents are selected
    const isChecked = selectedTalents.includes(talentId) ||
      talents.some(talent => talent.parentCategory === talentId && selectedTalents.includes(talent.id));

    return isChecked;
  };




  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form-update">
      <Typography variant="h6" className="form-title">עדכון פרופיל</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success">הפרופיל התעדכן בהצלחה</Alert>
        </Snackbar>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        <PersonalDetailsForm
          formData={formData}
          handleChange={handleChange}
          fieldErrors={fieldErrors}
          usernameRef={usernameRef}
          emailRef={emailRef}
          passwordRef={passwordRef}
          ageRef={ageRef}
          genderRef={genderRef}
          phoneNumberRef={phoneNumberRef}
          descRef={descRef}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
        />
        <TalentSelection
          talents={talents}
          subTalents={subTalents}
          offeredTalents={formData.offeredTalents}   
          wantedTalents={formData.wantedTalents}    
          handleTalentChange={handleTalentChange}
          isTalentChecked={isTalentChecked}
        />
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
          עדכון פרופיל
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProfile;