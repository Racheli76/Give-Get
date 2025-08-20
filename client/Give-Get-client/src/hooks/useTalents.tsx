import { useState } from 'react';
import { fetchTalentsByUserId } from '../apis/talentUserApi';
import {fetchTalentById } from '../apis/talentApi';

const useTalents = (userId: number) => {
  const [talents, setTalents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUserTalents = async () => {
    try {
      const talents = await fetchTalentsByUserId(userId);
      const talentDetails = await Promise.all(
        talents.map(async (talent: any) => {
          const details = await fetchTalentById(talent.talentId);
          return { ...details, isOffered: talent.isOffered };
        })
      );
      setTalents(talentDetails);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching talents:', error);
      setErrorMessage('לא נמצאו כשרונות עבור המשתמש הנתון.');
    }
  };

  return { talents, errorMessage, fetchUserTalents };
};

export default useTalents;