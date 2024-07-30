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
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ProductDetails = () => {
  const location = useLocation();
  const { productData } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState(productData || {});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [productSizePrices, setProductSizePrices] = useState([]);
  const [editingSizePrice, setEditingSizePrice] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Fetch categories data
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://3.1.81.96/api/Categories?pageSize=1000');
        const categoryMap = response.data.reduce((acc, category) => {
          acc[category.categoryId] = {
            name: category.categoryName,
            brandId: category.brandId
          };
          return acc;
        }, {});
        setCategories(categoryMap);
        fetchBrands(); // Fetch brands after categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch brands data
    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://3.1.81.96/api/Brands'); // Adjust URL if needed
        const brandMap = response.data.reduce((acc, brand) => {
          acc[brand.brandId] = brand.brandName;
          return acc;
        }, {});
        setBrands(brandMap);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    // Fetch product size prices if productData exists
    const fetchProductSizePrices = async () => {
      try {
        const response = await axios.get(`https://3.1.81.96/api/ProductSizePrices?productId=${productData.productId}`);
        setProductSizePrices(response.data);
      } catch (error) {
        console.error('Error fetching product size prices:', error);
      }
    };

    if (productData?.productId) {
      fetchCategories();
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

  const validateProductData = () => {
    const errors = {};
    if (!updatedProductData.categoryId) errors.categoryId = 'Category is required';
    if (!updatedProductData.productName) errors.productName = 'Product Name is required';
    if (!updatedProductData.productDescription) errors.productDescription = 'Product Description is required';
    return errors;
  };

  const validateSizePrices = (prices) => {
    const sortedPrices = prices.sort((a, b) => a.productSizeType - b.productSizeType);

    for (let i = 0; i < sortedPrices.length - 1; i++) {
      if (sortedPrices[i].price >= sortedPrices[i + 1].price) {
        return `Price of size ${getProductSizeType(sortedPrices[i].productSizeType)} must be less than the price of size ${getProductSizeType(sortedPrices[i + 1].productSizeType)}`;
      }
    }

    if (sortedPrices[0].price <= 0) {
      return 'Price of size S must be greater than 0';
    }

    return null; // No errors
  };

  const checkProductNameDuplicate = async () => {
    try {
      const response = await axios.get(
        `https://3.1.81.96/api/Products?categoryId=${updatedProductData.categoryId}&productName=${updatedProductData.productName}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking product name duplication:', error);
      return false;
    }
  };

  const handleUpdateProduct = async () => {
    const errors = validateProductData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSnackbarMessage('Please fill in all required fields.');
      setOpenSnackbar(true);
      return;
    }

    // Check for product name duplication
    const isDuplicate = await checkProductNameDuplicate();
    if (isDuplicate) {
      setSnackbarMessage('A product with this name already exists in the selected category.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.put(`https://3.1.81.96/api/Products/${updatedProductData.productId}`, updatedProductData);
      if (response.status === 200) {
        location.state.productData = response.data;
        setUpdatedProductData(response.data);
        setOpenSnackbar(true);
        setSnackbarMessage('Product updated successfully!');
        setIsEditing(false);
        setValidationErrors({}); // Clear validation errors
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
    const updatedPrices = productSizePrices.map((price) =>
      price.productSizePriceId === editingSizePrice.productSizePriceId ? { ...price, price: editingSizePrice.price } : price
    );

    // Validate the updated prices
    const validationError = validateSizePrices(updatedPrices);
    if (validationError) {
      setSnackbarMessage(validationError);
      setOpenSnackbar(true);
      return;
    }

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
              Category Name:
            </Typography>
            <Typography variant="body1">
              {categories[productData.categoryId]
                ? `${categories[productData.categoryId].name} - ${brands[categories[productData.categoryId].brandId] || 'Unknown Brand'}`
                : 'Unknown Category'}
            </Typography>
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
                            error={editingSizePrice.price === ''}
                            helpertext={editingSizePrice.price === '' ? 'Price is required' : ''}
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
            <InputLabel error={Boolean(validationErrors.categoryId)}>Category</InputLabel>
            <Select
              label="Category"
              name="categoryId"
              value={updatedProductData.categoryId || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={Boolean(validationErrors.categoryId)}
              helpertext={validationErrors.categoryId}
            >
              {Object.entries(categories).map(([id, { name, brandId }]) => (
                <MenuItem key={id} value={id}>
                  {name} - {brands[brandId] || 'Unknown Brand'}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Product Name"
              name="productName"
              value={updatedProductData.productName}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={Boolean(validationErrors.productName)}
              helpertext={validationErrors.productName}
            />
            <TextField
              label="Product Description"
              name="productDescription"
              value={updatedProductData.productDescription}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={Boolean(validationErrors.productDescription)}
              helpertext={validationErrors.productDescription}
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
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>
    </MainCard>
  );
};

export default ProductDetails;
