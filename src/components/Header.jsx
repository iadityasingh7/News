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
  const [activePage, setActivePage] = useState("Latest");

  const handleClick = (page) => {
    setActivePage(page);
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
              display: { xs: "none", md: "flex" },
            }}
          />

          {/* Mobile Logo */}
          <Box
            component="img"
            src="/logotype.png"
            alt="News Logo"
            sx={{
              height: 40,
              width: "auto",
              cursor: "pointer",
              display: { xs: "flex", md: "none" },
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
                onClick={() => handleClick(page)}
                sx={{
                  textTransform: "none",
                  fontWeight: activePage === page ? 500 : 300,
                  color: activePage === page ? "white" : "#C5C5C5",
                  borderRadius: 0,
                  px: 2,
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              display: { xs: "flex", md: "none" },
            }}
          >
            {activePage}
          </Typography>

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
                  width: "200px",
                  minWidth: "180px",
                  maxWidth: "90vw",
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "flex-start",
                  textAlign: "left",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.95S)",
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
