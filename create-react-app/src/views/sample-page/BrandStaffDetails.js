import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { Typography, Box, IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const BrandStaffDetails = () => {
  const location = useLocation();
  const { userData } = location.state;
  const [showPassword, setShowPassword] = useState(false);

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Brand Manager';
      case 2:
        return 'Store Manager';
      default:
        return 'User';
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MainCard title={<Typography variant="h5">User Details</Typography>}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">User ID: {userData?.userID}</Typography>
        <Typography variant="subtitle1">User Name: {userData?.userName}</Typography>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={userData?.password || ''} // Use optional chaining for safety
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            disabled
          />
        </FormControl>
        <Typography variant="subtitle1">Email: {userData?.email}</Typography>
        <Typography variant="subtitle1">Role: {getRoleName(userData?.role)}</Typography>
      </Box>
    </MainCard>
  );
};

export default BrandStaffDetails;
