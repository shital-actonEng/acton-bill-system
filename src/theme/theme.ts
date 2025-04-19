'use client';
import { createTheme } from '@mui/material/styles';
import "@fontsource/abeezee"; 
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5', // Set your desired background color for light mode
    },
  },
  typography: {
    fontFamily: "'ABeeZee','Poppins', sans-serif", // Change to your desired font
    fontSize: 14
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#09becb"
        }
      }
    } , 

  },
  
  cssVariables: true,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "'ABeeZee', 'Poppins', sans-serif", // Change to your desired font
    fontSize: 14
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

const blueTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#16344c', // Set your desired background color for light mode
    },
  },
  
  typography: {
    fontFamily: "'ABeeZee','Poppins', sans-serif", // Change to your desired font
    fontSize: 14
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1C425F", // ✅ Correct property
        },
      }
    } ,
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C425F', // Change to desired color
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C425F', // Change this to your desired color
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1C425F', // Change menu background color
          // color: '#ffffff', 
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C425F', // Change this to your desired color
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1C425F', // Background color
          },
        },
        popper: {
          '& .MuiPaper-root': {
            backgroundColor: '#1C425F', // Background color for dropdown options
          },
        },
      },
    },
  },
  cssVariables: true,
});

export  {theme , darkTheme , blueTheme};