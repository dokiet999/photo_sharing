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
import models from "../../modelData/models"; // Vẫn dùng models để lấy tên user
import "./styles.css";
import UploadPhotoButton from "../UploadButton";
import Comment from "../Comment"; // Giả sử bạn có component này để nhập bình luận

function UserPhotos({currentUser}) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  useEffect(() => {
  if (currentUser?.login_name) {
    fetch(`http://localhost:8081/user/login/${currentUser.login_name}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((userData) => {
        setId(userData._id);
        console.log("User ID:", userData._id);
        // setUser(userData); hoặc dùng userData._id để gọi các API khác
      })
      .catch((err) => {
        console.error("Error fetching user by login_name:", err);
      });
  }
}, [currentUser]);


  useEffect(() => {
    fetch(`http://localhost:8081/user/${userId}`).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    }).then((data) => {
      setUser(data);
    }).catch((err) => {
      console.error("Error fetching user:", err);
      setError("Error loading user data");
    });
  }, [userId]);

  const initialIndex = photoIndex ? parseInt(photoIndex, 10) : 0;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialIndex);

  const fetchPhotosAgain = () => {
  fetch(`http://localhost:8081/photos/${userId}`)
    .then((res) => res.json())
    .then((data) => setPhotos(data))
    .catch((err) => {
      console.error("Error refreshing photos:", err);
    });
};

  useEffect(() => {
    setCurrentPhotoIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    fetch(`http://localhost:8081/photos/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        return response.json();
      })
      .then((data) => setPhotos(data))
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setError("Error loading photos");
      });
  }, [userId]);

  if (error) {
    return <Typography variant="h4">{error}</Typography>;
  }

  if (!photos) {
    return <Typography variant="h4">Loading photos...</Typography>;
  }

  if (!user || photos.length === 0) {
    return <Typography variant="h4">No photos found</Typography>;
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNext = () => {
    const next = currentPhotoIndex + 1;
    if (next < photos.length) {
      setCurrentPhotoIndex(next);
      navigate(`/photos/${userId}/${next}`);
    }
     console.log("Current User:", id);
  };

  const handleBack = () => {
    const prev = currentPhotoIndex - 1;
    if (prev >= 0) {
      setCurrentPhotoIndex(prev);
      navigate(`/photos/${userId}/${prev}`);
    }
  };

  const photo = photos[currentPhotoIndex];

  return (
    <div className="photo-container">
      <Card key={photo._id} className="photo-card">
        <CardMedia
          component="img"
          image={`http://localhost:8081/images/${photo.file_name}`} // Đường dẫn ảnh trong thư mục public/images/
          alt={`Photo by ${user.first_name}`}
          className="photo-image"
          loading="lazy"
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Posted on {formatDate(photo.date_time)}
          </Typography>
          <div className="comment-section">
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Card key={comment._id} className="comment-card">
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(comment.date_time)} –
                   {comment.user_id ? (
                      <Link
                        component={RouterLink}
                        to={`/users/${comment.user_id._id}`}
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        {comment.user_id.first_name} {comment.user_id.last_name}
                      </Link>
                    ) : (
                      <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                        [Deleted User]
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {comment.comment}
                  </Typography>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No comments</Typography>
            )}
            <Comment photoId={photo._id} user={id} onCommentAdded={fetchPhotosAgain} />
          </div>
        </CardContent>
      </Card>

      {/* Stepper buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <Button variant="contained" onClick={handleBack} disabled={currentPhotoIndex === 0}>
          Previous
        </Button>
        <Typography variant="body1">
          Photo {currentPhotoIndex + 1} of {photos.length}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentPhotoIndex === photos.length - 1}
        >
          Next
        </Button>
      </div>
       <UploadPhotoButton userId={id} />
    </div>
  );
}

export default UserPhotos;
