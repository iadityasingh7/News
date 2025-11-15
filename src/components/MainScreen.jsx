import React, { useEffect, useCallback, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import NewsCard from "./NewsCard";
import { useSelector, useDispatch } from "react-redux";
import { getNews, loadMoreNews } from "../newsSlice";
import { SkeletonCardGrid } from "./SkeletonCard";

function MainScreen() {
  const dispatch = useDispatch();
  const {
    currentCategory,
    newsByCategory,
    loading,
    loadingMore,
    nextPageByCategory,
  } = useSelector((s) => s.news);

  const news = newsByCategory[currentCategory] || [];
  const nextPage = nextPageByCategory[currentCategory];
  const observerTarget = useRef(null);

  // Skip API call when category is likes load from localStorage
  useEffect(() => {
    if (currentCategory === "likes") {
      // Don't dispatch getNews for likes category
      return;
    }
    dispatch(getNews(currentCategory));
  }, [currentCategory, dispatch]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || loadingMore || !nextPage || currentCategory === "likes") {
      return;
    }

    if (observerTarget.current) {
      const rect = observerTarget.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 100) {
        // Load more when user is within 100px of the bottom
        dispatch(loadMoreNews(currentCategory));
      }
    }
  }, [loading, loadingMore, nextPage, currentCategory, dispatch]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Initial loading state
  if (loading && currentCategory !== "likes") {
    return (
      <Box sx={{ pt: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        <SkeletonCardGrid rows={3} />
      </Box>
    );
  }

  if (news.length === 0)
    return (
      <Box sx={{ pt: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography textAlign="center" mt={5}>
          No news found
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ pt: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {news.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={item.article_id || index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <NewsCard data={item} />
          </Grid>
        ))}
      </Grid>

      {/* Infinite scroll trigger element */}
      {nextPage && currentCategory !== "likes" && (
        <Box
          ref={observerTarget}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100px",
            mt: 3,
          }}
        >
          {loadingMore && <SkeletonCardGrid rows={1} />}
        </Box>
      )}
    </Box>
  );
}

export default MainScreen;
