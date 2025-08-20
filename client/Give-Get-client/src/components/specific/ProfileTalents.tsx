import React from 'react';
import { TalentType } from '../../Types/123types'; // ייבוא הסוגים מהמיקום המתאים

interface ProfileTalentsProps {
  talents: TalentType[];
}

const ProfileTalents: React.FC<ProfileTalentsProps> = ({ talents }) => (
  <div className="profile-talents">
    <h2>הכשרונות שלי</h2>
    {talents.length === 0 ? (
      <div className="no-talents-message">לא נמצאו לך כשרונות. נסה שוב מאוחר יותר.</div>
    ) : (
      <div className="my-talents-container">
        <div className="offered-talents">
          <h3>כשרונות מוצעים</h3>
          <ul>
            {talents
              .filter((talent: TalentType) => talent.isOffered)
              .map((talent: TalentType) => (
                <li key={talent.id}>{talent.talentName}</li>
              ))}
          </ul>
        </div>
        <div className="wanted-talents">
          <h3>כשרונות רצויים</h3>
          <ul>
            {talents
              .filter((talent: TalentType) => !talent.isOffered)
              .map((talent: TalentType) => (
                <li key={talent.id}>{talent.talentName}</li>
              ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);

export default ProfileTalents;