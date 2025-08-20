import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Avatar, Grid } from '@mui/material';
import { fetchComments, addComment} from '../apis/commentApi';
import {getProfileImage , fetchUserById} from '../apis/userApi';
import { useNavigate } from 'react-router-dom';
import '../styles/Comments.css';
import { CommentType } from '../Types/123types';
import HeaderFooter from '../components/common/HeaderFooter';

const Comments = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const response = await fetchComments();

        // שליפת פרטי המשתמש ותמונת הפרופיל עבור כל תגובה
        const commentsWithUserDetails = await Promise.all(
          response.map(async (comment: CommentType) => {
            if (comment.userId !== 0) {
              // const user = await fetchUserById(comment.userId);
              const profileImage = await getProfileImage(comment.userId);
              // return { ...comment, userName: user ? user.userName : "לא ידוע", profileImage };
              return { ...comment,profileImage };

            }
            return comment;
          })
        );

        setComments(commentsWithUserDetails);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchAllComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError('נא למלא תוכן תגובה.');
      return;
    }

    try {
      await addComment(newComment);
      setNewComment('');
      setError(null);
      const response = await fetchComments();

      // שליפת פרטי המשתמש ותמונת הפרופיל עבור כל תגובה
      const commentsWithUserDetails = await Promise.all(
        response.map(async (comment: CommentType) => {
          if (comment.userId !== 0) {
            // const user = await fetchUserById(comment.userId);
            const profileImage = await getProfileImage(comment.userId);
            // return { ...comment, userName: user ? user.userName : "לא ידוע", profileImage };
            return { ...comment,profileImage };
            
          }
          return comment;
        })
      );

      setComments(commentsWithUserDetails);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('כדי לשלוח תגובה יש להיות רשום ולבצע התחברות');
    }
  };

  return (
      <Container maxWidth="md" className="comments-container">
        <Typography variant="h4" gutterBottom>
          תגובות
        </Typography>
        <div className="comments-grid">
          {comments.map((comment) => (
            <Paper key={comment.id} elevation={3} className="comment-card">
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar src={comment.profileImage}  />
                </Grid>
                <Grid item xs>
                  {/* <Typography variant="h6">{comment.userName}</Typography> */}
                  <Typography variant="body1">{comment.content}</Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </div>
        <Paper elevation={3} className="add-comment-card">
          <Typography variant="h6" gutterBottom>
            הוסף תגובה
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button variant="contained" color="primary" onClick={handleAddComment}>
            הוסף תגובה
          </Button>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
            שים לב: הוספת תגובה אפשרית רק למשתמשים רשומים ומחוברים.
          </Typography>
        </Paper>
      </Container>
  );
};

export default Comments;