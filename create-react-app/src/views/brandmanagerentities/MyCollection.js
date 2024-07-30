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

const MyCollection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddCollectionDialog, setShowAddCollectionDialog] = useState(false);
  const [showEditCollectionDialog, setShowEditCollectionDialog] = useState(false);
  const navigate = useNavigate();
  const [newCollectionData, setNewCollectionData] = useState({
    brandId: '',
    collectionName: '',
    collectionDescription: '',
    isDeleted: false
  });
  const [filter, setFilter] = useState('');
  const [editCollectionData, setEditCollectionData] = useState({
    collectionId: '',
    brandId: '',
    collectionName: '',
    collectionDescription: '',
    isDeleted: false
  });

  const handleAddCollection = async () => {
    try {
      // Retrieve brandId from localStorage
      const brandId = localStorage.getItem('brandId');
  
      const response = await axios.post('https://3.1.81.96/api/Collections', {
        ...newCollectionData,
        brandId: brandId // Set brandId fetched from localStorage
      });
  
      if (response.status === 201) {
        // Successfully created new collection
        setNewCollectionData({
          brandId: '',
          collectionName: '',
          collectionDescription: '',
          isDeleted: false
        });
        setShowAddCollectionDialog(false);
        fetchCollectionData(); // Refresh collection list
        setOpenSnackbar(true);
        setSnackbarMessage('Collection added successfully!');
      } else {
        console.error('Error creating collection:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      setError(error.message);
    }
  };

  const handleEditCollection = async () => {
    try {
      // Retrieve brandId from localStorage
      const brandId = localStorage.getItem('brandId');
  
      const response = await axios.put(`https://3.1.81.96/api/Collections/${editCollectionData.collectionId}`, {
        ...editCollectionData,
        brandId: brandId // Ensure brandId is included in the update payload
      });
  
      if (response.status === 200) {
        // Successfully updated collection
        setShowEditCollectionDialog(false);
        fetchCollectionData();

        setOpenSnackbar(true);
        setSnackbarMessage('Collection updated successfully!');
      } else {
        console.error('Error updating collection:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewCollectionData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditCollectionData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddCollectionDialog = () => {
    setShowAddCollectionDialog(false);
  };

  const handleCloseEditCollectionDialog = () => {
    setShowEditCollectionDialog(false);
  };

  const handleEditClick = (collection) => {
    setEditCollectionData(collection);
    setShowEditCollectionDialog(true);
  };

  const fetchCollectionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Retrieve brandId from localStorage
      const brandId = localStorage.getItem('brandId');
  
      const response = await axios.get('https://3.1.81.96/api/Collections', {
        params: {
          brandId: brandId,
          pageNumber: 1,
          pageSize: 100
        }
      });
  
      if (!response.data) {
        throw new Error('Missing data from API response');
      }
      setCollectionData(response.data);
    } catch (error) {
      console.error('Error fetching collection data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleDelete = async (collectionId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Collections/${collectionId}`);
      if (response.status === 200) {
        // Successfully deleted collection
        setCollectionData(collectionData.filter((collection) => collection.collectionId !== collectionId));
        setOpenSnackbar(true);
        setSnackbarMessage('Collection deleted successfully!');
      } else {
        console.error('Error deleting collection:', response);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      setError(error.message);
    }
  };

  const handleViewDetails = (collection) => {
    navigate('/collection-details', { state: { collectionData: collection } });
  };

  const filteredCollectionData = collectionData.filter((collection) => {
    const collectionNameMatch = collection.collectionName?.toLowerCase().includes(filter.toLowerCase());
    const brandIdMatch = collection.brandId?.toString().includes(filter.toLowerCase());
    return collectionNameMatch || brandIdMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Collection Table</Typography>}>
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
                onClick={() => setShowAddCollectionDialog(true)}
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
                Add Collection
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
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCollectionData.map((collection) => (
                      <TableRow key={collection.collectionId}>
                        <TableCell>{collection.collectionName}</TableCell>
                        <TableCell>{collection.collectionDescription}</TableCell>
                        <TableCell sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => handleViewDetails(collection)}
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
                            color="success"
                            size="small"
                            onClick={() => handleEditClick(collection)}
                            startIcon={<Edit />}
                            sx={{
                              color: 'success.main',
                              borderColor: 'success.main',
                              '&:hover': {
                                backgroundColor: 'success.light'
                              }
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(collection.collectionId)}
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

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={showAddCollectionDialog} onClose={handleCloseAddCollectionDialog}>
        <DialogTitle>Add Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new collection, please fill out the form below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="collectionName"
            label="Collection Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCollectionData.collectionName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="collectionDescription"
            label="Collection Description"
            type="text"
            fullWidth
            variant="standard"
            value={newCollectionData.collectionDescription}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCollectionDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCollection} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditCollectionDialog} onClose={handleCloseEditCollectionDialog}>
        <DialogTitle>Edit Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>To edit this collection, please modify the fields below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="collectionName"
            label="Collection Name"
            type="text"
            fullWidth
            variant="standard"
            value={editCollectionData.collectionName}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="collectionDescription"
            label="Collection Description"
            type="text"
            fullWidth
            variant="standard"
            value={editCollectionData.collectionDescription}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCollectionDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCollection} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyCollection;
