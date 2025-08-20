import React from 'react';
import { ProfileDetailsProps } from '../../Types/123types'; // ייבוא של סוג המשתמש מהמיקום המתאים



  
  const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => (
    <div className="profile-details">
      <p><strong>שם משתמש:</strong> {user.userName}</p>
      <p><strong>אימייל:</strong> {user.email}</p>
      <p><strong>מספר טלפון:</strong> {user.phoneNumber}</p>
      <p><strong>תפקיד:</strong> {user.isAdmin ? 'מנהל' : 'משתמש'}</p>
      <p><strong>גיל:</strong> {user.age}</p>
      <p><strong>מין:</strong> {user.gender === 'Male' ? 'זכר' : 'נקבה'}</p>
      <p><strong>ציון:</strong> {user.score}</p>
      <p><strong>פעיל:</strong> {user.isActive ? 'כן' : 'לא'}</p>
      <p><strong>תאור:</strong> {user.desc}</p>
    </div>
  );
  
  export default ProfileDetails;