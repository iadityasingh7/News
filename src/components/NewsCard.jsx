import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch } from "react-redux";
import { addToLikes, removeFromLikes } from "../newsSlice";

const NewsCard = ({ data }) => {
  const { title, snippet, images, newsUrl, publisher } = data;
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const dispatch = useDispatch();

  const getValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim() ? url.trim() : null;
  };

  const imgSrc =
    getValidImageUrl(images?.thumbnail) ||
    "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw";

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedNews")) || [];
    const isLiked = storedLikes.some((item) => item.newsUrl === newsUrl);
    setLiked(isLiked);
  }, [newsUrl]);

  // Reset image loaded state when image source changes
  useEffect(() => {
    setImgLoaded(false);
  }, [imgSrc]);

  const handleClick = () => {
    window.open(newsUrl, "_blank", "noopener,noreferrer");
  };

  const toggleLike = (e) => {
    e.stopPropagation();

    if (liked) {
      // Remove from likes
      dispatch(removeFromLikes(newsUrl));
      setLiked(false);
    } else {
      // Add to likes
      dispatch(addToLikes(data));
      setLiked(true);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: "100%",
        maxWidth: 360,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 0,
          "& .MuiCardActionArea-focusHighlight": {
            backgroundColor: "transparent",
          },
        }}
      >
        <div
          style={{
            position: "relative",
            height: 180,
            width: "100%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {!imgLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: 0,
              }}
            />
          )}

          <CardMedia
            component="img"
            image={imgSrc}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              if (
                e.target.src !==
                "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw"
              ) {
                e.target.src =
                  "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw";
              } else {
                setImgLoaded(true);
              }
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease-in-out",
              backgroundColor: "grey.200",
            }}
          />
        </div>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {snippet}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Footer */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, pt: 0 }}
      >
        <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
          {publisher}
        </Typography>

        <IconButton
          onClick={toggleLike}
          sx={{
            color: liked ? "error.main" : "grey.500",
            transition: "all 0.2s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Stack>
    </Card>
  );
};

export default NewsCard;
