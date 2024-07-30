import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  Snackbar,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutlined, Edit, Delete } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const EntityCollection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddCollectionDialog, setShowAddCollectionDialog] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({
    brandId: '',
    collectionName: '',
    collectionDescription: ''
  });
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null); // To track the collection to delete
  const open = Boolean(anchorEl); // To track the menu to delete
  const [showEditCollectionDialog, setShowEditCollectionDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const filteredCollections = collectionData.filter((collection) => collection.collectionName.toLowerCase().includes(filter.toLowerCase()));
  const [validationErrors, setValidationErrors] = useState({});

  const validateNewCollectionData = () => {
    const errors = {};
    if (!newCollectionData.brandId) {
      errors.brandId = 'Brand is required';
    }
    if (!newCollectionData.collectionName.trim()) {
      errors.collectionName = 'Collection name is required';
    }
    if (!newCollectionData.collectionDescription.trim()) {
      errors.collectionDescription = 'Collection description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setShowEditCollectionDialog(true);
  };

  const handleCloseEditCollectionDialog = () => {
    setEditingCollection(null);
    setShowEditCollectionDialog(false);
    handleClose();
  };

  const handleSaveEdit = async (collectionId) => {
    try {
      const updatedCollection = {
        collectionName: editingCollection.collectionName,
        collectionDescription: editingCollection.collectionDescription
      };

      const response = await axios.put(`https://3.1.81.96/api/Collections/${collectionId}`, updatedCollection, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        setCollectionData((prevData) =>
          prevData.map((collection) => (collection.collectionId === collectionId ? response.data : collection))
        );
        setOpenSnackbar(true);
        setSnackbarMessage('Collection updated successfully!');
      } else {
        console.error('Error updating collection:', response);
        setError(response.data?.error || response.statusText);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      setError('An error occurred while updating the collection.');
    } finally {
      handleCloseEditCollectionDialog();
    }
  };

  const handleAddCollectionChange = (event) => {
    const { name, value } = event.target;
    setNewCollectionData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleAddCollection = async () => {
    if (!validateNewCollectionData()) {
      return;
    }
    try {
      const response = await axios.post('https://3.1.81.96/api/Collections', newCollectionData);
      if (response.status === 201) {
        setNewCollectionData({ brandId: '', collectionName: '', collectionDescription: '' });
        setShowAddCollectionDialog(false);
        const updatedResponse = await axios.get('https://3.1.81.96/api/Collections/ProductGroup');
        setCollectionData(updatedResponse.data);
        setOpenSnackbar(true);
        setSnackbarMessage('Collection created successfully!');
      } else {
        console.error('Error creating collection:', response);
        setError(response.data?.error || response.statusText);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      setError('An error occurred while creating the collection.');
    }
  };

  const handleCloseAddCollectionDialog = () => {
    setShowAddCollectionDialog(false);
    setValidationErrors({});
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [collectionResponse, brandResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Collections/ProductGroup'),
          axios.get('https://3.1.81.96/api/Brands')
        ]);
        setCollectionData(collectionResponse.data);
        setBrandData(brandResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (collection) => {
    navigate('/collection-details', { state: { collectionData: collection } });
  };

  const handleClick = (event, collection) => {
    event.stopPropagation(); // Stop event propagation
    setAnchorEl(event.currentTarget);
    setSelectedCollection(collection);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Collections/${selectedCollection.collectionId}`);
      if (response.status === 200) {
        setCollectionData((prevData) => prevData.filter((collection) => collection.collectionId !== selectedCollection.collectionId));
        setOpenSnackbar(true);
        setSnackbarMessage('Collection deleted successfully!');
      } else {
        console.error('Error deleting collection:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      setError(`Error: ${error.message}`);
    } finally {
      handleClose();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Collections</Typography>}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ mr: 2, flexGrow: 1 }}
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
                  px: 4, // Increase horizontal padding further
                  py: 1.5,
                  whiteSpace: 'nowrap' // Prevent text from wrapping
                }}
              >
                Add Collection
              </Button>
            </Box>
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredCollections.map((collection) => (
                  <Grid item xs={12} sm={6} md={4} key={collection.collectionId}>
                    <Card
                      elevation={4} // Add elevation for a raised effect
                      sx={{
                        borderRadius: 2, // Slightly rounded corners
                        transition: 'box-shadow 0.3s ease', // Add a smooth transition
                        '&:hover': {
                          boxShadow: 6 // Increase the elevation on hover
                        }
                      }}
                    >
                      <CardContent>
                        {editingCollection === collection.collectionId ? (
                          <>
                            <TextField
                              label="Collection Name"
                              name="collectionName"
                              value={collection.collectionName}
                              onChange={(e) => handleChange(e, collection.collectionId)}
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Collection Description"
                              name="collectionDescription"
                              value={collection.collectionDescription}
                              onChange={(e) => handleChange(e, collection.collectionId)}
                              fullWidth
                              margin="normal"
                            />
                          </>
                        ) : (
                          <>
                            <Typography gutterBottom variant="h5" component="div">
                              {collection.collectionName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {collection.collectionDescription}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <IconButton aria-label="settings" onClick={(event) => handleClick(event, collection)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Button size="small" color="primary" onClick={() => handleViewDetails(collection)}>
                          View Details
                        </Button>
                        {editingCollection === collection.collectionId ? (
                          <>
                            <Button variant="outlined" color="primary" onClick={handleCloseEditCollectionDialog} startIcon={<CancelIcon />}>
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSaveEdit(collection.collectionId)}
                              startIcon={<SaveIcon />}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <div></div>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
            <Dialog open={showAddCollectionDialog} onClose={handleCloseAddCollectionDialog}>
              <DialogTitle>Add New Collection</DialogTitle>
              <DialogContent>
                <DialogContentText>Please enter the details of the new collection.</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="brand-select"
                  name="brandId"
                  type="text"
                  label="Brand Name"
                  fullWidth
                  variant="outlined"
                  value={newCollectionData.brandId}
                  onChange={handleAddCollectionChange}
                  select
                  SelectProps={{ native: true }}
                  required
                  error={!!validationErrors.brandId}
                  helperText={validationErrors.brandId}
                >
                  <option value="" disabled></option>
                  {brandData.map((brand) => (
                    <option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </option>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  name="collectionName"
                  label="Collection Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newCollectionData.collectionName}
                  onChange={handleAddCollectionChange}
                  required
                  error={!!validationErrors.collectionName}
                  helperText={validationErrors.collectionName}
                />
                <TextField
                  margin="dense"
                  name="collectionDescription"
                  label="Collection Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={newCollectionData.collectionDescription}
                  onChange={handleAddCollectionChange}
                  required
                  error={!!validationErrors.collectionDescription}
                  helperText={validationErrors.collectionDescription}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAddCollectionDialog}>Cancel</Button>
                <Button onClick={handleAddCollection} variant="contained">
                  Add Collection
                </Button>
              </DialogActions>
            </Dialog>

            <Menu
              id="menu-actions"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            >
              <MenuItem onClick={() => handleEditCollection(selectedCollection)}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary={<Typography color="error">Delete</Typography>} />
              </MenuItem>
            </Menu>

            <Dialog open={showEditCollectionDialog} onClose={handleCloseEditCollectionDialog}>
              <DialogTitle>Edit Collection</DialogTitle>
              <DialogContent>
                <DialogContentText>Make changes to the collection details:</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  name="collectionName"
                  label="Collection Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={editingCollection?.collectionName || ''}
                  onChange={(e) => setEditingCollection((prevCollection) => ({ ...prevCollection, collectionName: e.target.value }))}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  name="collectionDescription"
                  label="Collection Description"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={editingCollection?.collectionDescription || ''}
                  onChange={(e) => setEditingCollection((prevCollection) => ({ ...prevCollection, collectionDescription: e.target.value }))}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditCollectionDialog}>Cancel</Button>
                <Button onClick={() => handleSaveEdit(editingCollection?.collectionId)} variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntityCollection;
