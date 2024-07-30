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
import { AddCircleOutlined, Visibility, Delete } from '@mui/icons-material';

const UtilitiesProduct = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const navigate = useNavigate();
  const [newProductData, setNewProductData] = useState({
    categoryId: '',
    productName: '',
    productDescription: ''
  });
  const [filter, setFilter] = useState('');
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [productsByCategory, setProductsByCategory] = useState({});

  // Function to validate new product data
  const validateNewProductData = () => {
    const errors = {};
    if (!newProductData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    if (!newProductData.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    if (!newProductData.productDescription.trim()) {
      errors.productDescription = 'Product description is required';
    }

    // Check for duplicate product in the selected category
    const categoryProducts = productsByCategory[newProductData.categoryId] || [];
    const duplicateProduct = categoryProducts.find((product) => product.productName === newProductData.productName);

    if (duplicateProduct) {
      errors.productName = 'A product with this name already exists in the selected category.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateNewProductData()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.post('https://3.1.81.96/api/Products', newProductData);
      if (response.status === 201) {
        // Successfully created new product
        setNewProductData({
          categoryID: '',
          productName: '',
          productDescription: ''
        });
        setShowAddProductDialog(false);

        // Fetch updated product and category data
        const [updatedProductResponse, categoryResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=100')
        ]);

        if (!updatedProductResponse.data || !categoryResponse.data) {
          throw new Error('Missing data from API response');
        }

        const updatedProductData = updatedProductResponse.data.map((product) => ({
          ...product,
          categoryName: categoryResponse.data.find((c) => c.categoryId === product.categoryId)?.categoryName || 'Unknown Category'
        }));

        setProductData(updatedProductData);

        // Update productsByCategory for new validation
        const updatedProductsByCategory = updatedProductData.reduce((acc, product) => {
          if (!acc[product.categoryId]) acc[product.categoryId] = [];
          acc[product.categoryId].push(product);
          return acc;
        }, {});

        setProductsByCategory(updatedProductsByCategory);

        setNewProductData({
          categoryId: '',
          productName: '',
          productDescription: ''
        });
        setShowAddProductDialog(false);

        setOpenSnackbar(true);
        setSnackbarMessage('Product added successfully!');
      } else {
        console.error('Error creating product:', response);
        // Check if the backend sent a specific error message
        const errorMessage = response.data?.error || response.statusText;
        setError(errorMessage); // Set the error message for display
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(`An error occurred: ${error.message}`); // Display a generic error message
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProductData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseAddProductDialog = () => {
    setShowAddProductDialog(false);
    setValidationErrors({});
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productResponse, categoryResponse, brandResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Brands?pageNumber=1&pageSize=100') // Assuming you have an endpoint for brands
        ]);

        if (!productResponse.data || !categoryResponse.data || !brandResponse.data) {
          throw new Error('Missing data from API response');
        }

        const categoryOptions = categoryResponse.data.map((category) => {
          const brand = brandResponse.data.find((b) => b.brandId === category.brandId); // Adjust property names accordingly
          return {
            id: category.categoryId,
            name: `${category.categoryName} - ${brand ? brand.brandName : 'Unknown Brand'}`
          };
        });
        setCategoryOptions(categoryOptions);

        // Create a map of categoryId to categoryName (correct property name)
        const categoryMap = {};
        categoryResponse.data.forEach((category) => {
          categoryMap[category.categoryId] = category.categoryName; // Use categoryId here
        });
        setCategoryMap(categoryMap);

        // Create a map of categoryId to products
        const productsByCategory = productResponse.data.reduce((acc, product) => {
          if (!acc[product.categoryId]) acc[product.categoryId] = [];
          acc[product.categoryId].push(product);
          return acc;
        }, {});

        setProductsByCategory(productsByCategory);
        setProductData(productResponse.data); // Don't need to map category name here anymore
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Products/${productId}`);
      if (response.status === 200) {
        // Successfully deleted product
        const updatedProductData = productData.filter((product) => product.productId !== productId);
        setProductData(updatedProductData);

        // Update productsByCategory
        const updatedProductsByCategory = updatedProductData.reduce((acc, product) => {
          if (!acc[product.categoryId]) acc[product.categoryId] = [];
          acc[product.categoryId].push(product);
          return acc;
        }, {});

        setProductsByCategory(updatedProductsByCategory);

        setOpenSnackbar(true);
        setSnackbarMessage('Product deleted successfully!');
      } else {
        console.error('Error deleting product:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleViewDetails = (product) => {
    navigate('/product-details', { state: { productData: product } });
  };

  const filteredProductData = productData.filter((product) => {
    const productNameMatch = product.productName?.toLowerCase().includes(filter.toLowerCase());
    const categoryIdMatch = product.categoryName?.toLowerCase().includes(filter.toLowerCase());
    return productNameMatch || categoryIdMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Product Table</Typography>}>
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
                onClick={() => setShowAddProductDialog(true)}
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
                Add Product
              </Button>
            </Box>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </div>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProductData.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{categoryMap[product.categoryId]}</TableCell>
                        <TableCell>
                          <Button color="primary" onClick={() => handleViewDetails(product)} startIcon={<Visibility />} sx={{ mr: 1 }}>
                            View
                          </Button>
                          <Button color="error" onClick={() => handleDelete(product.productId)} startIcon={<Delete />}>
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

      <Dialog open={showAddProductDialog} onClose={handleCloseAddProductDialog}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details of the new product.</DialogContentText>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            id="categoryId"
            name="categoryId"
            type="text"
            label="Category"
            fullWidth
            variant="outlined"
            value={newProductData.categoryId}
            onChange={handleChange}
            sx={{ mb: 2 }}
            select
            SelectProps={{ native: true }}
            error={!!validationErrors.categoryId}
            helperText={validationErrors.categoryId}
          >
            <option value="" disabled></option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="productName"
            name="productName"
            label="Product Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProductData.productName}
            onChange={handleChange}
            error={!!validationErrors.productName}
            helperText={validationErrors.productName}
          />
          <TextField
            margin="dense"
            id="productDescription"
            name="productDescription"
            label="Product Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newProductData.productDescription}
            onChange={handleChange}
            sx={{ mb: 2 }}
            error={!!validationErrors.productDescription}
            helperText={validationErrors.productDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProductDialog}>Cancel</Button>
          <Button onClick={handleAddProduct} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UtilitiesProduct;
