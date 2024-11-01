// import React, { useState, useContext, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Button from '@mui/material/Button';
// import { AppBar, Box, Toolbar, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';
// import versions from './version.json'; // Import the versions JSON file

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// export default function RMTool() {
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);
//   const theme = useTheme();
//   const [selectedVersion, setSelectedVersion] = useState('');

//   // Extract version keys from the JSON data
//   const versionKeys = Object.keys(versions);
//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setSelectedVersion(value);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const handleSubmit = async () => {
//     if (selectedVersion) {
//       try {
//         const response = await fetch(`https://cmtools.csez.zohocorpin.com/api/v1/lock_or_protect_builds?product_id=${productId}&checkout_label=${checkoutLabel}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ version: selectedVersion }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Success:', data);
//         } else {
//           console.error('Error:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error:', error.message);
//       }
//     } else {
//       console.error('Error: Please select a version');
//     }
//   };

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar style={{ backgroundColor: 'black', borderRadius: '5px' }}>
//           <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
//             RM - Tool
//           </Typography>
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#bff5c1',
//               color: 'black',
//               '&:hover': {
//                 backgroundColor: '#9cc99a',
//                 border: '2px solid red',
//                 transition: '0.1s',
//                 transform: 'scale(1.05)',
//               },
//             }}
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
//         <Typography variant="h4">Build Unlock</Typography>
//         <FormControl sx={{ m: 1, width: 300 }}>
//           <InputLabel id="select-version-label">Select Version</InputLabel>
//           <Select
//             labelId="select-version-label"
//             id="select-version"
//             value={selectedVersion}
//             onChange={handleChange}
//             input={<OutlinedInput label="Select Version" />}
//             MenuProps={MenuProps}
//           >
//             {versionKeys.map((version) => (
//               <MenuItem key={version} value={version}>
//                 {version}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Box sx={{ marginTop: '20px' }}>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             sx={{
//               backgroundColor: '#1040de',
//               color: 'white',
//               '&:hover': {
//                 backgroundColor: '#061a5c',
//                 border: '2px solid black',
//                 transition: '0.1s',
//                 transform: 'scale(1.07)',
//               },
//             }}
//           >
//             Submit
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// }

import React, { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import versions from './version.json'; // Import the versions JSON file

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function RMTool() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const theme = useTheme();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [versionComponents, setVersionComponents] = useState([]); // State to hold version components
  const [submissionResults, setSubmissionResults] = useState([]); // State to hold submission results

  // Extract version keys from the JSON data
  const versionKeys = Object.keys(versions);

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleVersionChange = (event) => {
    const version = event.target.value;
    setSelectedVersion(version);
    retrieveVersionComponents(version); // Retrieve components when version is selected
  };

  const retrieveVersionComponents = (version) => {
    // Get the components for the selected version
    const components = versions[version];
    if (components) {
      setVersionComponents(Object.entries(components)); // Store the components in state as an array
    } else {
      setVersionComponents([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async () => {
    if (selectedVersion) {
      // Filter components that have isHaving as true
      console.log(versionComponents);
      const activeComponents = versionComponents.filter(([_, details]) => details.isHaving === "true");
      console.log(activeComponents[0]);
      
      const results = []; // Initialize an array to hold the results
  
      for (const [componentName, details] of activeComponents) {
        const checkoutLabel = details.branch;
        console.log(checkoutLabel); 
        console.log(details.product_id);
  
        try {
            const response = await fetch(`https://cmtools.csez.zohocorpin.com/api/v1/lock_or_protect_builds?product_id=${details.product_id}&checkout_label=${checkoutLabel}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'PRIVATE-TOKEN': '4xtpMMBe34CHyPQH64zn', // Add your token here
              },
            });
    
  
          if (!response.ok) {
            throw new Error(`Error for component ${componentName}: ${response.statusText}`);
          }
  
          const data = await response.json();
          results.push({
            componentName,
            success: true,
            data,
          });
        } catch (error) {
          results.push({
            componentName,
            success: false,
            error: error.message,
          });
        }
      }
  
      setSubmissionResults(results); // Store results in state
    } else {
      console.error('There are some errors');
    }
  };
  

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: 'black', borderRadius: '5px' }}>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            RM - Tool
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#bff5c1',
              color: 'black',
              '&:hover': {
                backgroundColor: '#9cc99a',
                border: '2px solid red',
                transition: '0.1s',
                transform: 'scale(1.05)',
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h4">Build Unlock</Typography>
       
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="select-version-label">Select Version</InputLabel>
          <Select
            labelId="select-version-label"
            id="select-version"
            value={selectedVersion}
            onChange={handleVersionChange}
            input={<OutlinedInput label="Select Version" />}
            MenuProps={MenuProps}
          >
            {versionKeys.map((version) => (
              <MenuItem key={version} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#1040de',
              color: 'white',
              '&:hover': {
                backgroundColor: '#061a5c',
                border: '2px solid black',
                transition: '0.1s',
                transform: 'scale(1.07)',
              },
            }}
          >
            Submit
          </Button>
        </Box>

        {/* Display submission results */}
        {submissionResults.length > 0 && (
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6">Submission Results:</Typography>
            {submissionResults.map(({ componentName, success, data, error }) => (
              <Box key={componentName} sx={{ margin: '10px 0' }}>
                <Typography>Component: {componentName}</Typography>
                {success ? (
                  <Typography>Success: {JSON.stringify(data)}</Typography>
                ) : (
                  <Typography color="error">Error: {error}</Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
