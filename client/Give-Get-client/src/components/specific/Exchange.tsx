import React, { useEffect, useState } from 'react';
import { ThumbUp, ThumbDown, NewReleases, HourglassEmpty, Cached, Done } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDealsByUser, updateDealStatus } from '../../apis/exchangeApi';
import { getNotSecret, updateUserScore } from '../../apis/userApi';
import { fetchTalentById } from '../../apis/talentApi';
import '../../styles/Exchange.css';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { log } from 'console';

const Exchange = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedDeals, setLikedDeals] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const [tabIndex, setTabIndex] = useState(0);
  const [dealsLoaded, setDealsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  useEffect(() => {
    console.log('Fetching deals for user ID:', userId);
    
    const getDeals = async () => {
      console.log('Fetching deals for user ID:', userId);
      
      try {
        if (dealsLoaded) return;  // אם כבר טענת את הנתונים, אל תעשה זאת שוב

        if (userId) {
          console.log(`Fetching deals for user ID: ${userId}`);

          // // בדיקה אם המידע כבר קיים במטמון
          // const cachedDeals = localStorage.getItem(`deals_${userId}`);
          // if (cachedDeals) {
          //   console.log('Loading deals from cache');
          //   setDeals(JSON.parse(cachedDeals));
          //   setLoading(false);
          //   setDealsLoaded(true); 
          //   return;
          // }          
          const dealsData = await fetchDealsByUser(Number(userId));
          
          console.log('Deals data:', dealsData);

          const updatedDeals = await Promise.all(
            dealsData.map(async (deal: any) => {
              const user1 = await getNotSecret(deal.user1Id);
              const user2 = await getNotSecret(deal.user2Id);
              const talent1 = await fetchTalentById(deal.talent1Offered);
              const talent2 = await fetchTalentById(deal.talent2Offered);

              return {
                ...deal,
                user1Name: user1 ? user1.userName : 'משתמש לא נמצא',
                user2Name: user2 ? user2.userName : 'משתמש לא נמצא',
                talent1Name: talent1 ? talent1.talentName : 'כישרון לא נמצא',
                talent2Name: talent2 ? talent2.talentName : 'כישרון לא נמצא',
                status: deal.status.toString(),
                user1Confirmed: deal.user1Confirmed,
                user2Confirmed: deal.user2Confirmed
              };
            })
          );

          setDeals(updatedDeals);

          // שמירת התוצאה במטמון
          localStorage.setItem(`deals_${userId}`, JSON.stringify(updatedDeals));

          const storedLikes = JSON.parse(localStorage.getItem(`likedDeals_${userId}`) || '{}');
          console.log('Stored likes:', storedLikes);
          setLikedDeals(storedLikes);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
        setDealsLoaded(true);  // סימן שסיימת לטעון את הנתונים
      }
    };

    // נקרא רק אם userId קיים
    console.log('User ID:', userId);
    if (userId) {
      getDeals();
    }
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(`Tab changed to index: ${newValue}`);
    setTabIndex(newValue);
  };

  const handleLikeDislike = async (dealId: number, action: number, deal: any) => {
    try {
      const targetUserId = deal.user1Id === Number(userId) ? deal.user2Id : deal.user1Id;
      await updateUserScore(targetUserId, action);
      console.log(`Updated score for user ID: ${targetUserId} with action: ${action}`);

      const dealKey = `${userId}_${dealId}`;

      setLikedDeals((prev) => {
        const current = prev[dealKey];
        const newLikedDeals = { ...prev };

        switch (action) {
          case 3:
            if (current === 'like') {
              newLikedDeals[dealKey] = null;
            }
            break;
          case 2:
            if (current === 'dislike') {
              newLikedDeals[dealKey] = null;
            }
            break;
          case 1:
            newLikedDeals[dealKey] = 'like';
            break;
          case 0:
            newLikedDeals[dealKey] = 'dislike';
            break;
          default:
            return prev;
        }

        console.log('Updated liked deals:', newLikedDeals);
        localStorage.setItem(`likedDeals_${userId}`, JSON.stringify(newLikedDeals));
        return newLikedDeals;
      });
    } catch (error) {
      console.error('Error updating like/dislike:', error);
      alert('שגיאה בעדכון הניקוד');
    }
  };

  const handleApproveDeal = async (deal: any) => {
    try {
      let newStatus = deal.status;
      let userConfirmedField = '';

      if (deal.status === '0') {
        newStatus = '1';
        userConfirmedField = deal.user1Id === Number(userId) ? 'user1Confirmed' : 'user2Confirmed';
      } else if (deal.status === '1') {
        userConfirmedField = deal.user1Id === Number(userId) ? 'user1Confirmed' : 'user2Confirmed';
        if (deal.user1Confirmed && deal.user2Confirmed) {
          newStatus = '2';
        }
      } else if (deal.status === '2') {
        userConfirmedField = deal.user1Id === Number(userId) ? 'user1Confirmed' : 'user2Confirmed';
        if (deal.user1Confirmed && deal.user2Confirmed) {
          newStatus = '3';
        }
      }

      console.log(`Updating deal status: dealId=${deal.id}, newStatus=${newStatus}, userConfirmedField=${userConfirmedField}`);
      const updatedDeal = await updateDealStatus(deal.id, Number(newStatus), Number(userId));
      console.log('Updated deal from server:', updatedDeal);

      setDeals((prevDeals) =>
        prevDeals.map((d) => {
          if (d.id === deal.id) {
            return {
              ...d,
              status: updatedDeal.status.toString(),
              user1Confirmed: updatedDeal.user1Confirmed,
              user2Confirmed: updatedDeal.user2Confirmed,
            };
          }
          return d;
        })
      );
    //   // עדכון המטמון עם הנתונים החדשים
    //   localStorage.setItem(`deals_${userId}`, JSON.stringify(deals.map(d => 
    //     d.id === deal.id ? { 
    //         ...d, 
    //         status: updatedDeal.status.toString(),
    //         user1Confirmed: updatedDeal.user1Confirmed,
    //         user2Confirmed: updatedDeal.user2Confirmed,
    //     } : d
    // )));
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  const renderDeals = (status: string) => {
    const filteredDeals = deals.filter(deal => {
      if (status === '0') {
        return deal.status === '0' || (deal.status === '1' && ((deal.user1Id === Number(userId) && !deal.user1Confirmed) || (deal.user2Id === Number(userId) && !deal.user2Confirmed)));
      } else if (status === '1') {
        return deal.status === '1' && ((deal.user1Id === Number(userId) && deal.user1Confirmed) || (deal.user2Id === Number(userId) && deal.user2Confirmed));
      } else if (status === '2') {
        return deal.status === '2';
      } else if (status === '3') {
        return deal.status === '3';
      }
      return false;
    });

    // console.log(`Filtered deals for status ${status}:`, filteredDeals);
    if (filteredDeals.length === 0) {
      return <div id='no-deals-message' className="no-deals-message">לא נמצאו עסקאות בקטגוריה זו.</div>;
    }

    return (
      <ul >
        {filteredDeals.map(deal => (
          <li key={deal.id} className="deal-item">
            <div className="user"><strong>משתמש 1:</strong> {deal.user1Name}</div>
            <div className="user"><strong>משתמש 2:</strong> {deal.user2Name}</div>
            <div className="status"><strong>סטטוס:</strong> {deal.status}</div>
            <div className="talent"><strong>כישרון משתמש 1:</strong> {deal.talent1Name}</div>
            <div className="talent"><strong>כישרון משתמש 2:</strong> {deal.talent2Name}</div>
            <div className="date"><strong>תאריך יצירת ההתאמה:</strong> {new Date(deal.dateCreated).toLocaleDateString()}</div>
            <div className="actions">
              {status === '0' && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  אשר עסקה
                </Button>
              )}
              {status === '1' && deal.user1Id === Number(userId) && !deal.user1Confirmed && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  אשר עסקה
                </Button>
              )}
              {status === '1' && deal.user2Id === Number(userId) && !deal.user2Confirmed && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  אשר עסקה
                </Button>
              )}
              {status === '2' && deal.user1Id === Number(userId) && !deal.user1Confirmed && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  סיים עסקה
                </Button>
              )}
              {status === '2' && deal.user2Id === Number(userId) && !deal.user2Confirmed && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  סיים עסקה
                </Button>
              )}
              {status === '2' && deal.user1Id === Number(userId) && deal.user2Confirmed && !deal.user1Confirmed && (
                <div className="notification confirmed">
                  המשתמש השני כבר אישר סיום עסקה
                </div>
              )}
              {status === '2' && deal.user2Id === Number(userId) && deal.user1Confirmed && !deal.user2Confirmed && (
                <div className="notification confirmed">
                  המשתמש השני כבר אישר סיום עסקה
                </div>
              )}
              {status === '2' && ((deal.user1Id === Number(userId) && deal.user1Confirmed) || (deal.user2Id === Number(userId) && deal.user2Confirmed)) && (
                <div className="notification self-confirmed">
                  אישרת סיום עסקה
                </div>
              )}
              <button
                className={`like-button ${likedDeals[`${userId}_${deal.id}`] === 'like' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'like' ? 3 : 1, deal)}
                disabled={likedDeals[`${userId}_${deal.id}`] === 'dislike'}
                title="לחץ כדי לתת לייק"
              >
                <ThumbUp />
              </button>
              <button
                className={`dislike-button ${likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 2 : 0, deal)}
                disabled={likedDeals[`${userId}_${deal.id}`] === 'like'}
                title="לחץ כדי לתת דיסלייק"
              >
                <ThumbDown />
              </button>
            </div>
            <button
              className="chat-button"
              onClick={() => {
                const otherUserId = deal.user1Id === Number(userId) ? deal.user2Id : deal.user1Id;
                navigate(`/chat/${deal.id}?userId=${userId}&userId2=${otherUserId}`);
              }}            >
              מעבר לצ'אט
            </button>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <div className="no-deals-message">טוען נתונים...</div>;
  }

  if (!deals.length) {
    return <div className="no-deals-message">לא נמצאו התאמות בשבילך. נסה שוב מאוחר יותר.</div>;
  }

  return (
    <div className="deals-container">
      <h2>התאמות ליוזר</h2>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="status tabs">
        <Tab label="עסקאות חדשות" icon={<NewReleases />} />
        <Tab label="עסקאות בהמתנה" icon={<HourglassEmpty />} />
        <Tab label="עסקאות באמצע" icon={<Cached />} />
        <Tab label="עסקאות שהסתימו" icon={<Done />} />
      </Tabs>
      <Box className = "deals-box">
        {tabIndex === 0 && renderDeals('0')}
        {tabIndex === 1 && renderDeals('1')}
        {tabIndex === 2 && renderDeals('2')}
        {tabIndex === 3 && renderDeals('3')}
      </Box>
    </div>
  );
};

export default Exchange;