import React from "react";
import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useDispatch } from "react-redux";
import { setCategory, getNews, loadLikes } from "../newsSlice";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const pages = ["Latest", "Market", "Crypto", "Likes"];

function Header() {
  const dispatch = useDispatch();

  const handleClick = (page) => {
    if (page === "Likes") {
      dispatch(setCategory("likes"));
      dispatch(loadLikes());
      return;
    }

    const category = page.toLowerCase();
    dispatch(setCategory(category));
    dispatch(getNews(category));
  };

  const appBarHeight = 64;

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            NEWS
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: alpha(darkTheme.palette.common.white, 0.1),
                  },
                }}
                onClick={() => handleClick(page)}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: appBarHeight }} />
    </ThemeProvider>
  );
}

export default Header;
