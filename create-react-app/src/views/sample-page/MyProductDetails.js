import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Stack,
  Divider,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';

const MyProductDetails = () => {
  const location = useLocation();
  const { productData } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState(productData || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productSizePrices, setProductSizePrices] = useState([]); // Initialize as an array
  const [editingSizePrice, setEditingSizePrice] = useState(null);
  const [showAddSizePriceDialog, setShowAddSizePriceDialog] = useState(false);
  const [newSizePriceData, setNewSizePriceData] = useState({
    productSizeType: '',
    price: ''
  });

  const handleAddSizePrice = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/ProductSizePrices', {
        productId: productData.productId,
        productSizeType: parseInt(newSizePriceData.productSizeType, 10),
        price: parseFloat(newSizePriceData.price)
      });

      if (response.status === 201) {
        setProductSizePrices((prevData) => [...prevData, response.data]); // Update as an array
        setOpenSnackbar(true);
        setSnackbarMessage('Size price added successfully!');
        setShowAddSizePriceDialog(false);
      } else {
        console.error('Error adding size price:', response);
        setSnackbarMessage('Error adding size price.');
      }
    } catch (error) {
      console.error('Error adding product group item:', error);
      setSnackbarMessage('An error occurred while creating the size price.');
    }
  };

  const handleAddSizePriceChange = (event) => {
    const { name, value } = event.target;
    setNewSizePriceData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    setUpdatedProductData(productData);
    if (productData?.productId) {
      const fetchProductSizePrices = async () => {
        try {
          const response = await axios.get(`https://3.1.81.96/api/ProductSizePrices?productId=${productData.productId}`);
          setProductSizePrices(response.data);
        } catch (error) {
          console.error('Error fetching product size prices:', error);
        }
      };

      fetchProductSizePrices();
    }
  }, [productData]);

  const getProductSizeType = (sizeType) => {
    switch (sizeType) {
      case 0:
        return 'S';
      case 1:
        return 'M';
      case 2:
        return 'L';
      case 3:
        return 'N';
      default:
        return 'Unknown';
    }
  };

  const filteredProductSizePrices = productSizePrices.filter((sizePrice) => sizePrice.productId === productData.productId);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(`https://3.1.81.96/api/Products/${updatedProductData.productId}`, updatedProductData);
      if (response.status === 200) {
        location.state.productData = response.data;
        setUpdatedProductData(response.data);
        setOpenSnackbar(true);
        setSnackbarMessage('Product updated successfully!');
        setIsEditing(false);
      } else {
        console.error('Error updating product:', response);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!productData) return <p>Product data not found.</p>;

  const handleDeleteSizePrice = async (sizePriceId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/ProductSizePrices/${sizePriceId}`);
      if (response.status === 200) {
        setProductSizePrices((prevPrices) => prevPrices.filter((p) => p.productSizePriceId !== sizePriceId));
        setOpenSnackbar(true);
        setSnackbarMessage('Size price deleted successfully!');
      } else {
        console.error('Error deleting size price:', response);
      }
    } catch (error) {
      console.error('Error deleting size price:', error);
    }
  };

  const handleEditSizePrice = (sizePrice) => {
    setEditingSizePrice(sizePrice);
  };

  const handleCancelEdit = () => {
    setEditingSizePrice(null);
  };

  const handleSaveSizePrice = async () => {
    try {
      const response = await axios.put(`https://3.1.81.96/api/ProductSizePrices/${editingSizePrice.productSizePriceId}`, {
        productSizeType: editingSizePrice.productSizeType,
        price: editingSizePrice.price
      });

      if (response.status === 200) {
        setProductSizePrices((prevPrices) =>
          prevPrices.map((sizePrice) => (sizePrice.productSizePriceId === editingSizePrice.productSizePriceId ? response.data : sizePrice))
        );
        setOpenSnackbar(true);
        setSnackbarMessage('Size price updated successfully!');
      } else {
        console.error('Error updating size price:', response);
      }
    } catch (error) {
      console.error('Error updating size price:', error);
    } finally {
      setEditingSizePrice(null);
    }
  };

  return (
    <MainCard title={<Typography variant="h5">Product Details</Typography>}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product ID:
            </Typography>
            <Typography variant="body1">{productData.productId}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Category ID:
            </Typography>
            <Typography variant="body1">{productData.categoryId || 'Unknown Category'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product Name:
            </Typography>
            <Typography variant="body1">{productData.productName}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Product Description:
            </Typography>
            <Typography variant="body1">{productData.productDescription}</Typography>
          </Box>
          <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>
            Update
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Size Prices:</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setShowAddSizePriceDialog(true)} startIcon={<AddCircleOutlined />}>
              Add Size Price
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="size prices table">
              <TableHead>
                <TableRow>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductSizePrices
                  .sort((a, b) => a.productSizeType - b.productSizeType)
                  .map((sizePrice) => (
                    <TableRow key={sizePrice.productSizePriceId}>
                      <TableCell>{getProductSizeType(sizePrice.productSizeType)}</TableCell>
                      <TableCell align="right">
                        {editingSizePrice?.productSizePriceId === sizePrice.productSizePriceId ? (
                          <TextField
                            type="number"
                            value={editingSizePrice.price}
                            onChange={(e) => setEditingSizePrice({ ...editingSizePrice, price: e.target.value })}
                            autoFocus
                            onBlur={handleSaveSizePrice}
                          />
                        ) : (
                          `$${sizePrice.price}`
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editingSizePrice?.productSizePriceId === sizePrice.productSizePriceId ? (
                          <IconButton onClick={handleCancelEdit} color="primary">
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEditSizePrice(sizePrice)} color="primary">
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleDeleteSizePrice(sizePrice.productSizePriceId)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!isEditing && filteredProductSizePrices.length === 0 && <p>No size prices found</p>}
        </Box>

        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>Update Product</DialogTitle>
          <DialogContent>
            <DialogContentText>Make changes to the product details:</DialogContentText>
            <TextField
              label="Category ID"
              name="categoryID"
              value={updatedProductData.categoryId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product Name"
              name="productName"
              value={updatedProductData.productName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product Description"
              name="productDescription"
              value={updatedProductData.productDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} color="primary" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showAddSizePriceDialog} onClose={() => setShowAddSizePriceDialog(false)}>
          <DialogTitle>Add New Size Price</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the size and price details:</DialogContentText>
            <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
              <InputLabel id="size-select-label">Size</InputLabel>
              <Select
                labelId="size-select-label"
                id="size-select"
                name="productSizeType"
                value={newSizePriceData.productSizeType}
                onChange={handleAddSizePriceChange}
                label="Size"
              >
                <MenuItem value={0}>S</MenuItem>
                <MenuItem value={1}>M</MenuItem>
                <MenuItem value={2}>L</MenuItem>
                <MenuItem value={3}>Normal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={newSizePriceData.price}
              onChange={handleAddSizePriceChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddSizePriceDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSizePrice} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
    </MainCard>
  );
};

export default MyProductDetails;
