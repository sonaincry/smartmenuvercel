import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const MyProduct = () => {
  const location = useLocation();
  const { state } = location;
  const categoryId = state?.categoryId; // Get categoryId from location state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await axios.get('https://3.1.81.96/api/Products', {
            params: {
              pageNumber: 1,
              pageSize: 100, // Adjust pageSize as needed
              categoryId: categoryId // Use categoryId for filtering
            }
          });

          if (!response.data) {
            throw new Error('Missing data from API response');
          }

          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryId]); 

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.productDescription}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
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
    </Box>
  );
};

export default MyProduct;
