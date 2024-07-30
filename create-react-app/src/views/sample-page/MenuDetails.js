import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import {
  Typography,
  Box,
  CircularProgress,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  Chip,
  Grid,
  ListItemText,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit Icon

const MenuDetails = () => {
  const location = useLocation();
  const { menuData: initialMenuData } = location.state || {}; // Get menu data from location state
  const [menuData, setMenuData] = useState(initialMenuData || {});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(null);
  const [productData, setProductData] = useState({}); // State to store product details
  const [productGroupItemsData, setProductGroupItemsData] = useState({});
  const [productSizePrices, setProductSizePrices] = useState({});
  const [showAddProductGroupDialog, setShowAddProductGroupDialog] = useState(false);
  const [newProductGroupData, setNewProductGroupData] = useState({
    productGroupName: '',
    productGroupMaxCapacity: '',
    haveNormalPrice: true // Initialize with an empty string
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productGroupToDelete, setProductGroupToDelete] = useState(null);
  const [showEditProductGroupDialog, setShowEditProductGroupDialog] = useState(false);
  const [editingProductGroup, setEditingProductGroup] = useState(null);
  const [showAddProductGroupItemDialog, setShowAddProductGroupItemDialog] = useState(false);
  const [newProductGroupItemData, setNewProductGroupItemData] = useState({
    productGroupId: '', // Now include productGroupId
    productId: ''
  });
  const [showDeleteItemConfirmation, setShowDeleteItemConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const validateNewProductGroupData = () => {
    const errors = {};
    if (!newProductGroupData.productGroupName) {
      errors.productGroupName = 'Product group name is required';
    }
    if (!newProductGroupData.productGroupMaxCapacity.trim()) {
      errors.productGroupMaxCapacity = 'Product group max capacity is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewProductGroupItemData = () => {
    const errors = {};
    if (!newProductGroupItemData.productGroupId) {
      errors.productGroupId = 'Product group name is required';
    }
    if (!newProductGroupItemData.productId) {
      errors.productId = 'Product is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeleteProductGroupItem = (itemId) => {
    // Set the item to delete and open the confirmation dialog
    setItemToDelete(itemId);
    setShowDeleteItemConfirmation(true);
  };

  const confirmDeleteProductGroupItem = async () => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/ProductGroupItem/${itemToDelete}`);
      if (response.status === 200) {
        // Update productGroupItemsData
        setProductGroupItemsData((prevData) => {
          const newData = { ...prevData };
          Object.values(newData).forEach((groupItems) => {
            groupItems.splice(
              groupItems.findIndex((item) => item.productGroupItemId === itemToDelete),
              1
            );
          });
          return newData;
        });
      } else {
        console.error('Error deleting product group item:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting product group item:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setShowDeleteItemConfirmation(false);
    }
  };

  const handleAddProductGroupItemChange = (event) => {
    const { name, value } = event.target;
    setNewProductGroupItemData((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' // Clear error for the field being updated
    }));
  };

  const handleSaveAddProductGroupItem = async () => {
    if (!validateNewProductGroupItemData()) {
      return;
    }
    try {
      const dataToSend = {
        productGroupId: parseInt(newProductGroupItemData.productGroupId, 10),
        productId: parseInt(newProductGroupItemData.productId, 10)
      };

      const response = await axios.post(`https://3.1.81.96/api/ProductGroupItem`, dataToSend);

      if (response.status === 201) {
        // Successful response code for created item
        const newItem = response.data;

        // Update the productGroupItemsData
        setProductGroupItemsData((prevData) => {
          const newData = { ...prevData };
          // If the group doesn't exist yet, create an empty array for it
          if (!newData[newItem.productGroupId]) {
            newData[newItem.productGroupId] = [];
          }
          newData[newItem.productGroupId].push(newItem);
          return newData;
        });

        setOpenSnackbar(true);
        setSnackbarMessage('Product group item added successfully!');
      } else {
        // Handle the error response from the API
        console.error('Error adding product group item:', response);
        const errorResponse = response.data; // Assuming your API returns error details
        setError(errorResponse?.error || 'An error occurred while adding the product group item.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error adding product group item:', error);
      setError('An error occurred while adding the product group item.');
      setOpenSnackbar(true);
    } finally {
      setShowAddProductGroupItemDialog(false);
      setNewProductGroupItemData({
        productGroupId: '',
        productId: ''
      }); // Reset the form fields
    }
  };

  const handleEditProductGroup = (group) => {
    setEditingProductGroup(group);
    setShowEditProductGroupDialog(true);
  };

  const handleCloseEditProductGroupDialog = () => {
    setShowEditProductGroupDialog(false);
    setEditingProductGroup(null); // Reset editingProductGroup when dialog closes
  };

  const handleSaveEditProductGroup = async () => {
    try {
      const updatedGroupData = {
        productGroupName: editingProductGroup.productGroupName,
        haveNormalPrice: editingProductGroup.haveNormalPrice,
        productGroupMaxCapacity: parseInt(editingProductGroup.productGroupMaxCapacity, 10) || 0
      };
      const response = await axios.put(`https://3.1.81.96/api/ProductGroup/${editingProductGroup.productGroupId}`, updatedGroupData);
      if (response.status === 200) {
        setMenuData((prevMenuData) => ({
          ...prevMenuData,
          productGroups: prevMenuData.productGroups.map((group) =>
            group.productGroupId === editingProductGroup.productGroupId ? response.data : group
          )
        }));
        setOpenSnackbar(true);
        setSnackbarMessage('Product group updated successfully!');
      } else {
        console.error('Error updating product group:', response);
        setError(response.data?.error || response.statusText);
      }
    } catch (error) {
      console.error('Error updating product group:', error);
      setError('An error occurred while updating the product group.');
    } finally {
      handleCloseEditProductGroupDialog();
    }
  };

  const handleChangeProductGroup = (event) => {
    const { name, value, checked } = event.target;
    setEditingProductGroup((prevGroup) => ({
      ...prevGroup,
      [name]: name === 'haveNormalPrice' ? checked : value
    }));
  };

  const handleDeleteProductGroup = (productGroupId) => {
    // Set the product group to delete and open the confirmation dialog
    setProductGroupToDelete(productGroupId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteProductGroup = async () => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/ProductGroup/${productGroupToDelete}`); // Assuming this is your API endpoint

      if (response.status === 200) {
        // Update the menu data to remove the deleted product group
        setMenuData((prevMenuData) => ({
          ...prevMenuData,
          productGroups: prevMenuData.productGroups.filter((group) => group.productGroupId !== productGroupToDelete)
        }));

        // Update the productGroupItemsData and productSizePrices to remove deleted items
        setProductGroupItemsData((prevData) => {
          const newData = { ...prevData };
          delete newData[productGroupToDelete];
          return newData;
        });

        // Remove deleted items from productSizePrices
        setProductSizePrices((prevData) => {
          const newData = { ...prevData };
          for (const item of productGroupItemsData[productGroupToDelete]) {
            delete newData[item.productId];
          }
          return newData;
        });

        setOpenSnackbar(true);
        setSnackbarMessage('Product group deleted successfully!');
      } else {
        console.error('Error deleting product group:', response);
        setError(response.data?.error || response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product group:', error);
      setError('An error occurred while deleting the product group.');
    } finally {
      setShowDeleteConfirmation(false); // Close the dialog
    }
  };

  const handleAddProductGroupChange = (event) => {
    const { name, value, checked } = event.target;
    setNewProductGroupData((prevState) => ({
      ...prevState,
      [name]: name === 'haveNormalPrice' ? checked : value // Update boolean for Switch
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' // Clear error for the field being updated
    }));
  };

  const handleAddProductGroup = async () => {
    if (!validateNewProductGroupData()) {
      return;
    }

    try {
      // Prepare data to send to the API
      const dataToSend = {
        menuId: menuData.menuId,
        collectionId: null,
        productGroupName: newProductGroupData.productGroupName,
        productGroupMaxCapacity: parseInt(newProductGroupData.productGroupMaxCapacity, 10) || 0, // Parse to int or default to 0
        haveNormalPrice: newProductGroupData.haveNormalPrice
      };

      const response = await axios.post('https://3.1.81.96/api/ProductGroup', dataToSend);
      if (response.status === 201) {
        // Successfully created new product group
        setMenuData((prevMenuData) => {
          const updatedProductGroups = [...(prevMenuData.productGroups || []), response.data];
          return { ...prevMenuData, productGroups: updatedProductGroups };
        });

        setOpenSnackbar(true);
        setSnackbarMessage('Product group added successfully!');
      } else {
        console.error('Error adding product group:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding product group:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setShowAddProductGroupDialog(false);
      setNewProductGroupData({
        productGroupName: '',
        productGroupMaxCapacity: '',
        haveNormalPrice: true
      }); // Reset all the fields in newProductGroupData
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://3.1.81.96/api/Categories?pageNumber=1&pageSize=100'); // Replace with your API endpoint
        setCategories(response.data); // Assuming response.data is an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('An error occurred while fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://3.1.81.96/api/Products?pageNumber=1&pageSize=100'); // Replace with your API endpoint
        setProducts(response.data); // Assuming response.data is an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('An error occurred while fetching products.');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch product group items for this menu
        const productGroupResponse = await axios.get(`https://3.1.81.96/api/ProductGroup/GroupItem?menuId=${menuData.menuId}`);
        setProductGroups(productGroupResponse.data);
        const productGroupItems = productGroupResponse.data;
        // Get unique product IDs from all product groups
        const productIds =
          menuData.productGroups && menuData.productGroups.length > 0
            ? [...new Set(productGroupItems.flatMap((group) => group.productGroupItems?.map((item) => item.productId) || []))]
            : [];
        // Fetch product details for all unique product IDs
        if (productIds.length > 0) {
          // Fetch product size prices for all unique product IDs
          const productResponses = await Promise.all(
            productIds.map((id) => axios.get(`https://3.1.81.96/api/Products?productId=${id}`)) // Assuming query parameter
          );

          const newProductMap = {};
          productResponses.forEach((response) => {
            // Access the first product in the response array
            const product = response.data[0];
            if (product && product.productId) {
              newProductMap[product.productId] = product; // Access the first element of the array
            }
          });
          setProductData(newProductMap);
          const productSizePromises = productIds.map(
            (id) => axios.get(`https://3.1.81.96/api/ProductSizePrices?productId=${id}`) // Assuming API supports filtering by productId
          );
          const productSizeResponses = await Promise.all(productSizePromises);

          const newProductSizePricesData = {};
          productSizeResponses.forEach((response) => {
            const productId = response.data[0]?.productId; // Get the first product id in response
            if (productId) {
              // Check if the productId exists
              newProductSizePricesData[productId] = response.data;
            }
          });

          setProductSizePrices(newProductSizePricesData);
        }

        // Re-organize product group items based on productGroupId
        const reorganizedProductGroups = {};
        productGroupItems.forEach((group) => {
          reorganizedProductGroups[group.productGroupId] = group.productGroupItems;
        });

        setProductGroupItemsData(reorganizedProductGroups); // Update state
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message); // Store the error message as a string
      } finally {
        setIsLoading(false);
      }
    };

    if (menuData?.menuId) {
      // Check if menuData is not undefined
      fetchData();
    }
  }, [menuData]);

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

  return (
    <MainCard title={<Typography variant="h5">Menu Details</Typography>}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Menu ID: {menuData.menuId}</Typography>
        <Typography variant="subtitle1">Brand ID: {menuData.brandId}</Typography>
        <Typography variant="subtitle1">Name: {menuData.menuName}</Typography>
        <Typography variant="subtitle1">Description: {menuData.menuDescription}</Typography>
        <Typography variant="h6">Product Groups:</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => setShowAddProductGroupDialog(true)}>
                Add Product Group
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => setShowAddProductGroupItemDialog(true)}>
                Add Product Group Item
              </Button>
            </Box>
            <List>
              {menuData.productGroups?.map((group) => (
                <Accordion key={group.productGroupId} sx={{ border: '1px solid lightgray', mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{group.productGroupName}</Typography>
                    <IconButton aria-label="delete" onClick={() => handleDeleteProductGroup(group.productGroupId)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEditProductGroup(group)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <List>
                      {productGroupItemsData[group.productGroupId]?.map((item) => {
                        const product = productData[item.productId];
                        const sizePrices = productSizePrices[item.productId];

                        return product ? (
                          <ListItem key={item.productGroupItemId} disablePadding>
                            <Grid container alignItems="center">
                              {/* Product Name and Description */}
                              <Grid item xs={8} md={9}>
                                <ListItemText primary={product.productName} />
                              </Grid>

                              {/* Size and Price (horizontal layout) */}
                              <Grid item xs={4} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Stack direction="row" spacing={8}>
                                  {sizePrices?.map((sizePrice) => (
                                    <Chip
                                      key={sizePrice.productSizePriceId}
                                      label={`${getProductSizeType(sizePrice.productSizeType)} - $${sizePrice.price}`}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#f0f0f0',
                                        color: 'text.primary',
                                        border: '1px solid #e0e0e0'
                                      }}
                                    />
                                  ))}
                                </Stack>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleDeleteProductGroupItem(item.productGroupItemId)}
                                  sx={{ ml: 1 }} // Margin left for spacing
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </ListItem>
                        ) : null;
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </>
        )}
        <Dialog open={showDeleteItemConfirmation} onClose={() => setShowDeleteItemConfirmation(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this product group item? This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteItemConfirmation(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDeleteProductGroupItem} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showAddProductGroupItemDialog} onClose={() => setShowAddProductGroupItemDialog(false)}>
          <DialogTitle>Add New Product Group Item</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the product group ID and product ID:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="product-group-select-label"
              name="productGroupId"
              type="text"
              label="Product Group"
              fullWidth
              variant="outlined"
              value={newProductGroupItemData.productGroupId}
              onChange={handleAddProductGroupItemChange}
              select
              SelectProps={{ native: true }}
              error={!!validationErrors.productGroupId}
              helperText={validationErrors.productGroupId}
              required
            >
              <option value="" disabled></option>
              {productGroups.map((group) => (
                <option key={group.productGroupId} value={group.productGroupId}>
                  {group.productGroupName}
                </option>
              ))}
            </TextField>
            <TextField
              autoFocus
              margin="dense"
              id="product-select-label"
              name="productId"
              type="text"
              label="Product"
              fullWidth
              variant="outlined"
              value={newProductGroupItemData.productId}
              onChange={handleAddProductGroupItemChange}
              select
              SelectProps={{ native: true }}
              error={!!validationErrors.productId}
              helperText={validationErrors.productId}
              required
            >
              <option value="" disabled></option>
              {products.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productName}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowAddProductGroupItemDialog(false);
                setValidationErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAddProductGroupItem} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog open={showAddProductGroupDialog} onClose={() => setShowAddProductGroupDialog(false)}>
        <DialogTitle>Add New Product Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the details of the new product group:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="product-group-name-label"
            name="productGroupName"
            type="text"
            label="Product Group Name"
            fullWidth
            variant="outlined"
            value={newProductGroupData.productGroupName}
            onChange={handleAddProductGroupChange}
            select
            SelectProps={{ native: true }}
            required
            error={!!validationErrors.productGroupName}
            helperText={validationErrors.productGroupName}
          >
            <option value="" disabled></option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="productGroupMaxCapacity"
            label="Max Capacity"
            type="number"
            fullWidth
            variant="outlined"
            name="productGroupMaxCapacity" // Add name attribute to bind to state
            value={newProductGroupData.productGroupMaxCapacity} // Bind to newProductGroupData
            onChange={handleAddProductGroupChange}
            required
            error={!!validationErrors.productGroupMaxCapacity}
            helperText={validationErrors.productGroupMaxCapacity}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={newProductGroupData.haveNormalPrice}
                  onChange={handleAddProductGroupChange}
                  name="haveNormalPrice" // Connect the Switch to the state
                />
              }
              label="Have Normal Price"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddProductGroupDialog(false);
              setValidationErrors({});
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddProductGroup} variant="contained">
            Add Product Group
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditProductGroupDialog} onClose={handleCloseEditProductGroupDialog}>
        <DialogTitle>Edit Product Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the details of the product group:</DialogContentText>
          <FormControl fullWidth variant="standard" required>
            <InputLabel id="product-group-name-label">Product Group Name</InputLabel>
            <Select
              fullWidth
              variant="standard"
              name="productGroupName"
              value={editingProductGroup?.productGroupName || ''}
              onChange={handleChangeProductGroup}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryName}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="productGroupMaxCapacity"
            label="Max Capacity"
            type="number"
            fullWidth
            variant="standard"
            name="productGroupMaxCapacity"
            value={editingProductGroup?.productGroupMaxCapacity || ''}
            onChange={handleChangeProductGroup}
            required
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={editingProductGroup?.haveNormalPrice || false}
                  onChange={handleChangeProductGroup}
                  name="haveNormalPrice"
                />
              }
              label="Have Normal Price"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProductGroupDialog}>Cancel</Button>
          <Button onClick={handleSaveEditProductGroup} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this product group? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProductGroup} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default MenuDetails;
