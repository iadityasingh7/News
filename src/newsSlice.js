import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchNews from "./sideEffects/FetchLatestNews";

export const getNews = createAsyncThunk(
  "news/getNews",
  async (category, { getState }) => {
    const { newsByCategory } = getState().news;

    if (newsByCategory[category]?.length > 0) {
      return { 
        cached: true, 
        category, 
        data: newsByCategory[category],
        nextPage: null
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
    },

    loadLikes(state) {
      const saved = localStorage.getItem("likedNews");
      state.newsByCategory["likes"] = saved ? JSON.parse(saved) : [];
    },

    addToLikes(state, action) {
      const item = action.payload;
      const existing = localStorage.getItem("likedNews");
      let likes = existing ? JSON.parse(existing) : [];

      // prevent duplicates
      if (!likes.some((i) => i.id === item.id)) {
        likes.push(item);
      }

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
        const { category, data, nextPage } = action.payload;
        state.loading = false;

        // Save fetched or cached data
        state.newsByCategory[category] = data;
        // Store nextPage for pagination
        if (nextPage !== undefined) {
          state.nextPageByCategory[category] = nextPage;
        }
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

        // Append new data to existing news
        const existingNews = state.newsByCategory[category] || [];
        state.newsByCategory[category] = [...existingNews, ...data];
        // Update nextPage for pagination
        state.nextPageByCategory[category] = nextPage;
      })

      .addCase(loadMoreNews.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setCategory, loadLikes, addToLikes } = newsSlice.actions;
export default newsSlice.reducer;
