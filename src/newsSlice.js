import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchNews from "./sideEffects/FetchLatestNews";

export const getNews = createAsyncThunk(
  "news/getNews",
  async (category, { getState }) => {
    const { newsByCategory, nextPageByCategory } = getState().news;

    if (newsByCategory[category]?.length > 0) {
      // Preserve existing nextPage when using cached data
      return { 
        cached: true, 
        category, 
        data: newsByCategory[category],
        nextPage: nextPageByCategory[category] || null
      };
    }

    const result = await fetchNews(category);
    return { 
      cached: false, 
      category, 
      data: result.data,
      nextPage: result.nextPage
    };
  }
);

export const loadMoreNews = createAsyncThunk(
  "news/loadMoreNews",
  async (category, { getState }) => {
    const { nextPageByCategory } = getState().news;
    const nextPage = nextPageByCategory[category];

    if (!nextPage) {
      return { category, data: [], nextPage: null, hasMore: false };
    }

    const result = await fetchNews(category, nextPage);
    return { 
      category, 
      data: result.data,
      nextPage: result.nextPage,
      hasMore: !!result.nextPage
    };
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    currentCategory: "latest",
    newsByCategory: {},
    nextPageByCategory: {}, // Store nextPage for each category
    loading: false,
    loadingMore: false,
    error: null,
  },

  reducers: {
    setCategory(state, action) {
      state.currentCategory = action.payload;
      // Clear error when switching categories
      state.error = null;
    },

    loadLikes(state) {
      const saved = localStorage.getItem("likedNews");
      state.newsByCategory["likes"] = saved ? JSON.parse(saved) : [];
    },

    addToLikes(state, action) {
      const item = action.payload;
      const existing = localStorage.getItem("likedNews");
      let likes = existing ? JSON.parse(existing) : [];

      // prevent duplicates by newsUrl
      if (!likes.some((i) => i.newsUrl === item.newsUrl)) {
        likes.push(item);
      }

      localStorage.setItem("likedNews", JSON.stringify(likes));
      state.newsByCategory["likes"] = likes;
    },

    removeFromLikes(state, action) {
      const newsUrl = action.payload;
      const existing = localStorage.getItem("likedNews");
      let likes = existing ? JSON.parse(existing) : [];

      // Remove item by newsUrl
      likes = likes.filter((item) => item.newsUrl !== newsUrl);

      localStorage.setItem("likedNews", JSON.stringify(likes));
      state.newsByCategory["likes"] = likes;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getNews.fulfilled, (state, action) => {
        const { category, data, nextPage, cached } = action.payload;
        state.loading = false;

        // Save fetched or cached data
        state.newsByCategory[category] = data;
        // Only update nextPage if it's a new fetch (not cached), or if nextPage is explicitly provided
        if (!cached && nextPage !== undefined) {
          state.nextPageByCategory[category] = nextPage;
        }
        // If cached, preserve existing nextPage (already set in the thunk return value)
      })

      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(loadMoreNews.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })

      .addCase(loadMoreNews.fulfilled, (state, action) => {
        const { category, data, nextPage } = action.payload;
        state.loadingMore = false;
        state.error = null; // Clear error on successful load

        // Append new data to existing news
        const existingNews = state.newsByCategory[category] || [];
        state.newsByCategory[category] = [...existingNews, ...data];
        // Update nextPage for pagination
        state.nextPageByCategory[category] = nextPage;
      })

      .addCase(loadMoreNews.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || "Something went wrong";
        // Clear nextPage to prevent infinite retry loop on error
        // This stops the scroll handler from continuously trying to load more
        const category = action.meta.arg;
        state.nextPageByCategory[category] = null;
      });
  },
});

export const { setCategory, loadLikes, addToLikes, removeFromLikes } = newsSlice.actions;
export default newsSlice.reducer;
