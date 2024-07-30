import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  Box,
  Typography,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutlined, Visibility, Delete, Edit } from '@mui/icons-material';

const MyStore = () => {
  const [storeData, setStoreData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [showEditStoreDialog, setShowEditStoreDialog] = useState(false);
  const navigate = useNavigate();
  const [newStoreData, setNewStoreData] = useState({
    brandId: '',
    storeLocation: '',
    storeContactEmail: '',
    storeContactNumber: '',
    isDeleted: false
  });
  const [filter, setFilter] = useState('');
  const [editStoreData, setEditStoreData] = useState({
    storeId: '',
    brandId: '',
    storeLocation: '',
    storeContactEmail: '',
    storeContactNumber: '',
    isDeleted: false
  });

  const handleAddStore = async () => {
    try {
      // Retrieve brandId from localStorage
      const brandId = localStorage.getItem('brandId');
      const response = await axios.post('https://3.1.81.96/api/Stores', {
        ...newStoreData,
        brandId: brandId // Set brandId fetched from localStorage
      });
      if (response.status === 201) {
        // Successfully created new store
        setNewStoreData({
          brandId: '',
          storeLocation: '',
          storeContactEmail: '',
          storeContactNumber: '',
          isDeleted: false
        });
        setShowAddStoreDialog(false);
        fetchStoreData(); // Refresh store list
        setOpenSnackbar(true);
        setSnackbarMessage('Store added successfully!');
      } else {
        console.error('Error creating store:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error creating store:', error);
      setError(error.message);
    }
  };

  const handleEditStore = async () => {
    try {
      const response = await axios.put(`https://3.1.81.96/api/Stores/${editStoreData.storeId}`, {
        ...editStoreData,
        brandId: localStorage.getItem('brandId') // Ensure brandId is included in the update payload
      });
      if (response.status === 200) {
        // Successfully updated store
        setShowEditStoreDialog(false);
        fetchStoreData();
        setOpenSnackbar(true);
        setSnackbarMessage('Store updated successfully!');
      } else {
        console.error('Error updating store:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error updating store:', error);
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewStoreData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditStoreData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddStoreDialog = () => {
    setShowAddStoreDialog(false);
  };

  const handleCloseEditStoreDialog = () => {
    setShowEditStoreDialog(false);
  };

  const handleEditClick = (store) => {
    setEditStoreData(store);
    setShowEditStoreDialog(true);
  };

  const fetchStoreData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const brandId = localStorage.getItem('brandId');
      const response = await axios.get('https://3.1.81.96/api/Stores', {
        params: {
          brandId: brandId,
          pageNumber: 1,
          pageSize: 10 // Adjust pageSize as needed
        }
      });
      if (!response.data) {
        throw new Error('Missing data from API response');
      }
      setStoreData(response.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleDelete = async (storeId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Stores/${storeId}`);
      if (response.status === 200) {
        // Successfully deleted store
        setStoreData(storeData.filter((store) => store.storeId !== storeId));
        setOpenSnackbar(true);
        setSnackbarMessage('Store deleted successfully!');
      } else {
        console.error('Error deleting store:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      setError(error.message);
    }
  };

  const handleViewDetails = (store) => {
    navigate('/store-details', { state: { storeData: store } });
  };

  const filteredStoreData = storeData.filter((store) => {
    const storeLocationMatch = store.storeLocation?.toLowerCase().includes(filter.toLowerCase());
    const brandIdMatch = store.brandId?.toString().includes(filter.toLowerCase());
    return storeLocationMatch || brandIdMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Store Table</Typography>}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '500px',
                  mr: 60, // Set a fixed width (adjust as needed)
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    paddingRight: 1
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddStoreDialog(true)}
                startIcon={<AddCircleOutlined />}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2, // Increase horizontal padding further
                  py: 1.5,
                  whiteSpace: 'nowrap' // Prevent text from wrapping
                }}
                size="small"
              >
                Add Store
              </Button>
            </Box>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </div>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Store Location</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone number</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStoreData.map((store) => (
                      <TableRow key={store.storeId}>
                        <TableCell>{store.storeLocation}</TableCell>
                        <TableCell>{store.storeContactEmail}</TableCell>
                        <TableCell>{store.storeContactNumber}</TableCell>
                        <TableCell sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => handleViewDetails(store)}
                            startIcon={<Visibility />}
                            sx={{
                              color: 'info.main',
                              borderColor: 'info.main',
                              '&:hover': {
                                backgroundColor: 'info.light'
                              }
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(store)}
                            startIcon={<Edit />}
                            sx={{
                              color: 'primary.main',
                              borderColor: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light'
                              }
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(store.storeId)}
                            startIcon={<Delete />}
                            sx={{
                              color: 'error.main',
                              borderColor: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light'
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </MainCard>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
      <Dialog
        open={showAddStoreDialog}
        onClose={handleCloseAddStoreDialog}
        aria-labelledby="add-store-dialog-title"
        aria-describedby="add-store-dialog-description"
      >
        <DialogTitle id="add-store-dialog-title">Add New Store</DialogTitle>
        <DialogContent>
          <DialogContentText id="add-store-dialog-description">Please enter the details of the new store.</DialogContentText>
          <TextField
            margin="dense"
            name="storeLocation"
            label="Store Location"
            type="text"
            fullWidth
            variant="standard"
            value={newStoreData.storeLocation}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="storeContactEmail"
            label="Store Contact Email"
            type="email"
            fullWidth
            variant="standard"
            value={newStoreData.storeContactEmail}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="storeContactNumber"
            label="Store Contact Number"
            type="text"
            fullWidth
            variant="standard"
            value={newStoreData.storeContactNumber}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStoreDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStore}>
            Add Store
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showEditStoreDialog}
        onClose={handleCloseEditStoreDialog}
        aria-labelledby="edit-store-dialog-title"
        aria-describedby="edit-store-dialog-description"
      >
        <DialogTitle id="edit-store-dialog-title">Edit Store</DialogTitle>
        <DialogContent>
          <DialogContentText id="edit-store-dialog-description">Please update the details of the store.</DialogContentText>
          <TextField
            margin="dense"
            name="storeLocation"
            label="Store Location"
            type="text"
            fullWidth
            variant="standard"
            value={editStoreData.storeLocation}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="storeContactEmail"
            label="Store Contact Email"
            type="email"
            fullWidth
            variant="standard"
            value={editStoreData.storeContactEmail}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="storeContactNumber"
            label="Store Contact Number"
            type="text"
            fullWidth
            variant="standard"
            value={editStoreData.storeContactNumber}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditStoreDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleEditStore}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyStore;
