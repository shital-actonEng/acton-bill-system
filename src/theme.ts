'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5', // Set your desired background color for light mode
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Change to your desired font
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#37C2CC"
        }
      }
    }
  },
  cssVariables: true,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Change to your desired font
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#1E1E1E"
        }
      }
    }
  },
  cssVariables: true,
});

export default theme;