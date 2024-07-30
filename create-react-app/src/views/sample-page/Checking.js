import { CircularProgress, Box } from '@mui/material';
const Checking = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Checking;
