import React, { useState } from "react";
import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

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
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const appBarHeight = 64;

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo*/}
          <Box
            component="img"
            src="/logotype.png"
            alt="News Logo"
            sx={{
              height: 60,
              width: "auto",
              cursor: "pointer",
            }}
          />

          {/* Desktop Buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" }, // hide on mobile
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

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  width: "250px",
                  minWidth: "220px",
                  maxWidth: "90vw",
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleClick(page);
                    handleMenuClose();
                  }}
                >
                  {page}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: appBarHeight }} />
    </ThemeProvider>
  );
}

export default Header;
