import React, { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { AppBar, Box, Toolbar, Typography, CircularProgress } from '@mui/material';
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
  const [selectedVersion, setSelectedVersion] = useState('');
  const [versionComponents, setVersionComponents] = useState([]);
  const [submissionResults, setSubmissionResults] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [result,setResult]=useState('');

  // Extract version keys from the JSON data
  const versionKeys = Object.keys(versions);

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
      const activeComponents = versionComponents.filter(([_, details]) => details.isHaving === "true");
      const results = []; // Initialize an array to hold the results
      setLoading(true); // Start loading

      for (const [componentName, details] of activeComponents) {
        const checkoutLabel = details.branch;

        try {
          const response = await fetch(`http://localhost:5000/api/lock_or_protect_builds?product_id=${details.product_id}&checkout_label=${checkoutLabel}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Error for component ${componentName}: ${response.statusText}`);
          }

          const data = await response.json();
          // console.log(data.lock_or_protect_builds[0].details);
          const array=data.lock_or_protect_builds[0].details;
          for(let i=0;i<array.length;i++)
          {
            // console.log(array[i]);
            var res;
            try {
              const action = 'Lock';
              const buildlog_id = array[i];
              const response = await fetch(`http://localhost:5000/api/lock_build?product_id=${details.product_id}&action=${action}&buildlog_id=${buildlog_id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
          
              if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
              }
          
              res = await response.json();
              console.log(res.lock_or_protect_builds[0].id); // Handle the response data
            } catch (error) {
              console.error('Error fetching lock build:', error.message);
            }

            //Put API
            try {
              const action = 'UnLock'; // Ensure consistent casing
              const buildlog_id = array[i];
            
              // Prepare the body with the required parameters
              const bodyData = {
                product_id: details.product_id,
                buildlog_id: buildlog_id,
                action: action,
                id: res.lock_or_protect_builds[0].id, // Include the id in the body if needed
              };
            
              const response = await fetch('http://localhost:5000/api/unlock_build', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData), // Send the parameters in the body
              });


              if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
              }
          
              const data = await response.json();
              console.log("Response",data); // Handle the response data
              setResult("Build Unlocked Sucessfully");
            } catch (error) {
              console.error('Error fetching unlock build:', error.message);
            }


          }
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

      setSubmissionResults(results); 
      console.log(results);
      setLoading(false); // Stop loading
    } else {
      console.error('Error: Please select a version');
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
        <Typography variant="h6" sx={{ marginTop: '20px' }}> {result} </Typography>
        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ marginTop: '20px' }}>
            <CircularProgress />
            <Typography variant="h6">Loading...</Typography>
          </Box>
        )}

        {/* Display submission results */}
  
      </Box>
    </>
  );
}
