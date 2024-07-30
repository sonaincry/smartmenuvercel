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

const MyTemplate = () => {
    const [templateData, setTemplateData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
    const [showEditTemplateDialog, setShowEditTemplateDialog] = useState(false);
    const navigate = useNavigate();
    const [newTemplateData, setNewTemplateData] = useState({
        brandId: '',
        templateName: '',
        templateDescription: '',
        templateWidth: '',
        templateHeight: '',
        templateImgPath: '',
        isDeleted: false
    });
    const [filter, setFilter] = useState('');
    const [editTemplateData, setEditTemplateData] = useState({
        templateId: '',
        brandId: '',
        templateName: '',
        templateDescription: '',
        templateWidth: '',
        templateHeight: '',
        templateImgPath: '',
        isDeleted: false
    });

    const handleAddTemplate = async () => {
        try {
            // Retrieve brandId from localStorage
            const brandId = localStorage.getItem('brandId');

            const response = await axios.post('https://3.1.81.96/api/Templates', {
                ...newTemplateData,
                brandId: brandId // Set brandId fetched from localStorage
            });

            if (response.status === 201) {
                // Successfully created new template
                setNewTemplateData({
                    brandId: '',
                    templateName: '',
                    templateDescription: '',
                    templateWidth: '',
                    templateHeight: '',
                    templateImgPath: '',
                    isDeleted: false
                });
                setShowAddTemplateDialog(false);
                fetchTemplateData(); // Refresh template list
                setOpenSnackbar(true);
                setSnackbarMessage('Template added successfully!');
            } else {
                console.error('Error creating template:', response);
                setError(response.statusText);
            }
        } catch (error) {
            console.error('Error creating template:', error);
            setError(error.message);
        }
    };

    const handleEditTemplate = async () => {
        try {
            const response = await axios.put(`https://3.1.81.96/api/Templates/${editTemplateData.templateId}`, {
                ...editTemplateData,
                brandId: localStorage.getItem('brandId') // Ensure brandId is included in the update payload
            });

            if (response.status === 200) {
                // Successfully updated template
                setShowEditTemplateDialog(false);
                fetchTemplateData();
                setOpenSnackbar(true);
                setSnackbarMessage('Template updated successfully!');
            } else {
                console.error('Error updating template:', response);
                setError(response.statusText);
            }
        } catch (error) {
            console.error('Error updating template:', error);
            setError(error.message);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewTemplateData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditTemplateData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCloseAddTemplateDialog = () => {
        setShowAddTemplateDialog(false);
    };

    const handleCloseEditTemplateDialog = () => {
        setShowEditTemplateDialog(false);
    };

    const handleEditClick = (template) => {
        setEditTemplateData(template);
        setShowEditTemplateDialog(true);
    };

    const fetchTemplateData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const brandId = localStorage.getItem('brandId');
            const response = await axios.get('https://3.1.81.96/api/Templates', {
                params: {
                    brandId: brandId,
                    pageNumber: 1,
                    pageSize: 10 // Adjust pageSize as needed
                }
            });
            if (!response.data) {
                throw new Error('Missing data from API response');
            }
            setTemplateData(response.data);
        } catch (error) {
            console.error('Error fetching template data:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplateData();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    const handleDelete = async (templateId) => {
        try {
            const response = await axios.delete(`https://3.1.81.96/api/Templates/${templateId}`);
            if (response.status === 200) {
                // Successfully deleted template
                setTemplateData(templateData.filter((template) => template.templateId !== templateId));
                setOpenSnackbar(true);
                setSnackbarMessage('Template deleted successfully!');
            } else {
                console.error('Error deleting template:', response);
                setError(response.statusText);
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            setError(error.message);
        }
    };

    const handleViewDetails = (template) => {
        navigate('/template-details', { state: { templateData: template } });
    };

    const filteredTemplateData = templateData.filter((template) => {
        const templateNameMatch = template.templateName?.toLowerCase().includes(filter.toLowerCase());
        const brandIdMatch = template.brandId?.toString().includes(filter.toLowerCase());
        return templateNameMatch || brandIdMatch;
    });

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard title={<Typography variant="h5">Template Table</Typography>}>
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
                                onClick={() => setShowAddTemplateDialog(true)}
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
                                Add Template
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
                                            <TableCell>Width</TableCell>
                                            <TableCell>Height</TableCell>
                                            <TableCell>Image</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredTemplateData.map((template) => (
                                            <TableRow key={template.templateId}>
                                                <TableCell>{template.templateName}</TableCell>
                                                <TableCell>{template.templateDescription}</TableCell>
                                                <TableCell>{template.templateWidth}</TableCell>
                                                <TableCell>{template.templateHeight}</TableCell>
                                                <TableCell>
                                                    <img
                                                        src={template.templateImgPath}
                                                        alt={template.templateName}
                                                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleViewDetails(template)}
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
                                                        onClick={() => handleEditClick(template)}
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
                                                        onClick={() => handleDelete(template.templateId)}
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
                open={showAddTemplateDialog}
                onClose={handleCloseAddTemplateDialog}
                aria-labelledby="add-template-dialog-title"
                aria-describedby="add-template-dialog-description"
            >
                <DialogTitle id="add-template-dialog-title">Add New Template</DialogTitle>
                <DialogContent>
                    <DialogContentText id="add-template-dialog-description">Please enter the details of the new template.</DialogContentText>
                    <TextField
                        margin="dense"
                        name="templateName"
                        label="Template Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newTemplateData.templateName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateDescription"
                        label="Template Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newTemplateData.templateDescription}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateWidth"
                        label="Template Width"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newTemplateData.templateWidth}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateHeight"
                        label="Template Height"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newTemplateData.templateHeight}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateImgPath"
                        label="Template Image Path"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newTemplateData.templateImgPath}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddTemplateDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddTemplate}>
                        Add Template
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showEditTemplateDialog}
                onClose={handleCloseEditTemplateDialog}
                aria-labelledby="edit-template-dialog-title"
                aria-describedby="edit-template-dialog-description"
            >
                <DialogTitle id="edit-template-dialog-title">Edit Template</DialogTitle>
                <DialogContent>
                    <DialogContentText id="edit-template-dialog-description">Please update the details of the template.</DialogContentText>
                    <TextField
                        margin="dense"
                        name="templateName"
                        label="Template Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editTemplateData.templateName}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateDescription"
                        label="Template Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editTemplateData.templateDescription}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateWidth"
                        label="Template Width"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={editTemplateData.templateWidth}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateHeight"
                        label="Template Height"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={editTemplateData.templateHeight}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        name="templateImgPath"
                        label="Template Image Path"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editTemplateData.templateImgPath}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditTemplateDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditTemplate}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyTemplate;
