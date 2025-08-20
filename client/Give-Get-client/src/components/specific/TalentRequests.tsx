import React, { useEffect, useState } from 'react';
import { fetchTalentRequests, deleteTalentRequest, updateTalentRequest } from '../../apis/talentRequestApi';
import { fetchTalentById } from '../../apis/talentApi';
import { fetchUserById } from '../../apis/userApi';
import { Container, Typography, Paper, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { TalentRequestType } from '../../Types/123types';
import '../../styles/TalentRequests.css';

const TalentRequests: React.FC = () => {
  const [talentRequests, setTalentRequests] = useState<TalentRequestType[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedTalent, setEditedTalent] = useState<TalentRequestType | null>(null);
  const [openDialog, setOpenDialog] = useState<{ [key: number]: boolean }>({});
  const [parentCategoryNames, setParentCategoryNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchTalentRequests();  // שליפת בקשות הכשרונות
        const updatedRequests = await Promise.all(
          data.map(async (request: TalentRequestType) => {
            if (!request.userId || request.userId === 0) {
              return { ...request, userName: "משתמש לא רשום" };  // אם userId הוא 0 או לא קיים, מחזירים שם ברירת מחדל
            }
            const user = await fetchUserById(request.userId);  // שליפת אובייקט המשתמש
            return { ...request, userName: user ? user.userName : "משתמש לא רשום" };  // עדכון שם המשתמש
          })
        );
        setTalentRequests(updatedRequests);  // עדכון הסטייט עם הבקשות המעודכנות

        // שליפת שמות הקטגוריות
        const parentCategories = await Promise.all(
          updatedRequests.map(async (request) => {
            if (request.parentCategory === "0") {
              return { id: request.parentCategory, name: "קטגוריה ראשית" };
            }
            const parentTalent = await fetchTalentById(parseInt(request.parentCategory));
            return { id: request.parentCategory, name: parentTalent ? parentTalent.talentName : "קטגוריה ראשית" };
          })
        );

        const parentCategoryNamesMap = parentCategories.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {} as { [key: string]: string });

        setParentCategoryNames(parentCategoryNamesMap);
      } catch (error) {
        console.error('Error fetching talent requests:', error);
      }
    };
    // הגדרת polling
    const interval = setInterval(() => {
      fetchRequests();
    }, 3000); // כל 5 שניות

    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    setOpenDialog(prev => ({ ...prev, [id]: true }));
  };

  const confirmDelete = async (id: number) => {
    try {
      await deleteTalentRequest(id);
      console.log(`Deleted talent request ID: ${id}`);
      setTalentRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      setOpenDialog(prev => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error('Error deleting talent request:', error);
    }
  };

  const cancelDelete = (id: number) => {
    setOpenDialog(prev => ({ ...prev, [id]: false }));
  };

  const handleEdit = (request: TalentRequestType) => {
    console.log("Editing request:", request);
    setEditMode({ ...editMode, [request.id]: true });
    setEditedTalent({ ...request });
  };

  const handleCancelEdit = (id: number) => {
    console.log(`Canceled edit for request ID: ${id}`);
    setEditMode(prev => ({ ...prev, [id]: false }));
    setEditedTalent(null);
  };

  const handleUpdate = async (id: number) => {
    if (!editedTalent) return;
    try {
      console.log("Updating talent request:", editedTalent);
      await updateTalentRequest(id, editedTalent);
      setTalentRequests(prevRequests =>
        prevRequests.map(req => (req.id === id ? editedTalent : req))
      );
      setEditMode({ ...editMode, [id]: false });
      setEditedTalent(null);
      window.location.reload(); // רענון הדף לאחר עדכון ושמירה
    } catch (error) {
      console.error('Error updating talent request:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Changing field ${name} to ${value}`);
    setEditedTalent(prev => (prev ? { ...prev, [name]: value } : prev));
  };

  return (
    <Container maxWidth="md" className='head'>
      <div className='req'>
        <Typography variant="h2" gutterBottom className="req-title">
          בקשות להוספת כשרונות
        </Typography>
        {talentRequests.map((request) => {
          console.log("Rendering request:", request);
          return (
            <Paper key={request.id} className="talent-request-card">
              {editMode[request.id] && editedTalent?.id === request.id ? (
                <Box>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="שם כישרון"
                    name="talentName"
                    value={editedTalent?.talentName || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="קטגוריה"
                    name="parentCategory"
                    value={editedTalent?.parentCategory || ''}
                    onChange={handleChange}
                  />
                  <Box mt={2}>
                    <Button onClick={() => handleUpdate(request.id)} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      עדכן ושמור
                    </Button>
                    <Button onClick={() => handleCancelEdit(request.id)} variant="contained" color="secondary">
                      ביטול
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6">שם כישרון: {request.talentName}</Typography>
                  <Typography variant="body1">
                    קטגוריה: {parentCategoryNames[request.parentCategory] || "לא ידוע"}
                  </Typography>
                  <Typography variant="body1">נשלח ע"י: {request.userName || "לא ידוע"}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    תאריך שליחה: {request.requestDate ? new Date(request.requestDate).toLocaleString() : "לא ידוע"}
                  </Typography>
                  <Box mt={2}>
                    <Button onClick={() => handleEdit(request)} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      ערוך
                    </Button>
                    <Button onClick={() => handleDelete(request.id)} variant="contained" color="secondary">
                      מחק
                    </Button>
                  </Box>
                </Box>
              )}
              <Dialog
                open={openDialog[request.id] || false}
                onClose={() => cancelDelete(request.id)}
              >
                <DialogTitle>אישור מחיקה</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    האם אתה בטוח שברצונך למחוק את הבקשה?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => cancelDelete(request.id)} color="primary">
                    ביטול
                  </Button>
                  <Button onClick={() => confirmDelete(request.id)} color="secondary">
                    מחק
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          );
        })}
      </div>
    </Container>
  );
};

export default TalentRequests;