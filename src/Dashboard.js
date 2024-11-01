// Dashboard.js
import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Toolbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import RMTool from './RMTool';

// import appBarLabel from '@mui/material/AppBar';


// Create a theme
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
});

function DashboardContent({ pathname }) {
    const navigate = useNavigate();
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    ><div style={{display:'flex',gap:'100px'}}>

<div style={{ display: 'flex', gap: '100px', justifyContent: 'center', marginTop: '50px' }}>
      <Box
      onClick={() => navigate('/rmtool')}
        sx={{
          width: 300,
          height: 130,
          borderRadius: 1,
          bgcolor: 'success.main', // Example color variant
          '&:hover': {
            border: '2px solid black', // Hover effect color
            transition: '0.3s', // Transition effect
            transform: 'scale(1.1)', // Scale effect
            bgcolor: 'success.dark', // Hover effect color
          },
          display: 'flex', // Center text
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
        }}
      >
        <Typography variant="h4" color="white">Build Unlock</Typography> {/* Text inside the box */}
      </Box>

      <Box
        sx={{
          width: 300,
          height: 130,
          borderRadius: 1,
          bgcolor: 'error.main', // Example color variant
          '&:hover': {
            border: '2px solid black',
            transition: '0.3s', // Transition effect
            transform: 'scale(1.1)',
            bgcolor: 'error.dark', // Hover effect color
          },
          display: 'flex', // Center text
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
        }}
      >
        <Typography variant="h4" color="white">Git Automerge</Typography> {/* Text inside the box */}
      </Box>
    </div>
      </div>
      {/* <Typography variant="h4">Dashboard Content for {pathname}</Typography> */}
    </Box>
  );
}

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
      },
    };
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppProvider theme={demoTheme}>
           <AppBar position="static" >
        <Toolbar style={{backgroundColor:'black',borderRadius:'5px'}}>
         
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            RM - Tool
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <Button
  variant="contained"
  sx={{
    backgroundColor: '#bff5c1',
    color: 'black',
    '&:hover': {
      backgroundColor: '#9cc99a', // Darker shade for hover
      border: '2px solid red', // Add a border on hover
      transition: '0.1s', // Smooth transition
      transform: 'scale(1.05)', // Slightly scale the button on hover
    },
  }}
  onClick={handleLogout}
>
  Logout
</Button>
        </Toolbar>
      </AppBar>

      <DashboardContent pathname={pathname} />
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      
      </Box>
    </AppProvider>
  );
}

export default Dashboard;
