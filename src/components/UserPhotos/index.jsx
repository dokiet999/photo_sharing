import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Button,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import UploadPhotoButton from "../UploadButton";
import Comment from "../Comment";
import "./styles.css";

function UserPhotos({ currentUser, advancedFeaturesEnabled }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    photoIndex ? parseInt(photoIndex, 10) : 0
  );
  const [currentUserId, setCurrentUserId] = useState(null);

  // Lấy ID người dùng hiện tại để đăng comment
  useEffect(() => {
    if (currentUser?.login_name) {
      fetch(`http://localhost:8081/user/login/${currentUser.login_name}`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((userData) => setCurrentUserId(userData._id))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [currentUser]);

  // Lấy thông tin người dùng cần xem ảnh
  useEffect(() => {
    fetch(`http://localhost:8081/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Error loading user data");
      });
  }, [userId]);

  // Lấy toàn bộ ảnh của người dùng
  const fetchPhotos = () => {
    fetch(`http://localhost:8081/photos/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch photos");
        return res.json();
      })
      .then((data) => setPhotos(data))
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setError("Error loading photos");
      });
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  useEffect(() => {
    setCurrentPhotoIndex(photoIndex ? parseInt(photoIndex, 10) : 0);
  }, [photoIndex]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) return <Typography variant="h4">{error}</Typography>;
  if (!user || !photos) return <Typography variant="h4">Loading...</Typography>;
  if (photos.length === 0) return <Typography variant="h4">No photos found</Typography>;

  // Nếu không bật advanced features → hiển thị toàn bộ ảnh
  if (!advancedFeaturesEnabled) {
    return (
      <div className="photo-container">
        {photos.map((photo) => (
          <Card key={photo._id} className="photo-card">
            <CardMedia
              component="img"
              image={`http://localhost:8081/images/${photo.file_name}`}
              alt="user photo"
              className="photo-image"
              loading="lazy"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Posted on {formatDate(photo.date_time)}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              {photo.comments?.length > 0 ? (
                photo.comments.map((comment) => (
                  <Card key={comment._id} className="comment-card">
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(comment.date_time)} –{" "}
                      {comment.user_id ? (
                        <Link
                          component={RouterLink}
                          to={`/users/${comment.user_id._id}`}
                          color="primary"
                        >
                          {comment.user_id.first_name} {comment.user_id.last_name}
                        </Link>
                      ) : (
                        "[Deleted User]"
                      )}
                    </Typography>
                    <Typography variant="body1">{comment.comment}</Typography>
                  </Card>
                ))
              ) : (
                <Typography>No comments</Typography>
              )}
              <Comment photoId={photo._id} user={currentUserId} onCommentAdded={fetchPhotos} />
              <UploadPhotoButton userId={currentUserId}></UploadPhotoButton>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Chế độ Advanced: chỉ hiển thị 1 ảnh theo index
  const photo = photos[currentPhotoIndex];
  if (!photo) return <Typography variant="h4">Invalid photo index</Typography>;

  return (
    <div className="photo-container">
      <Card key={photo._id} className="photo-card">
        <CardMedia
          component="img"
          image={`http://localhost:8081/images/${photo.file_name}`}
          alt="user photo"
          className="photo-image"
          loading="lazy"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Posted on {formatDate(photo.date_time)}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          {photo.comments?.length > 0 ? (
            photo.comments.map((comment) => (
              <Card key={comment._id} className="comment-card">
                <Typography variant="body2" color="textSecondary">
                  {formatDate(comment.date_time)} –{" "}
                  {comment.user_id ? (
                    <Link
                      component={RouterLink}
                      to={`/users/${comment.user_id._id}`}
                      color="primary"
                    >
                      {comment.user_id.first_name} {comment.user_id.last_name}
                    </Link>
                  ) : (
                    "[Deleted User]"
                  )}
                </Typography>
                <Typography variant="body1">{comment.comment}</Typography>
              </Card>
            ))
          ) : (
            <Typography>No comments</Typography>
          )}
          <Comment photoId={photo._id} user={currentUserId} onCommentAdded={fetchPhotos} />
          <UploadPhotoButton userId={currentUserId}></UploadPhotoButton>
        </CardContent>
      </Card>

      {/* Stepper buttons */}
      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          disabled={currentPhotoIndex <= 0}
          onClick={() => navigate(`/photos/${userId}/${currentPhotoIndex - 1}`)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          disabled={currentPhotoIndex >= photos.length - 1}
          onClick={() => navigate(`/photos/${userId}/${currentPhotoIndex + 1}`)}
          style={{ marginLeft: 16 }}
        >
          Next
        </Button>
      </div>
     
    </div>
  );
}

export default UserPhotos;
