import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

import { Level } from '../types/level';
import * as levelApi from '../api/levelApi';

const LevelsPage: React.FC = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [editedRowData, setEditedRowData] = useState<Omit<Level, 'levelId'> | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await levelApi.getLevels();
            setLevels(data);
        } catch (error) {
            console.error(error);
            // Here you would set an error state to show in the UI
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (level: Level) => {
        setEditRowId(level.levelId);
        setEditedRowData({ levelName: level.levelName, sequenceOrder: level.sequenceOrder });
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditedRowData(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        if (!editRowId || !editedRowData) return;

        try {
            await levelApi.updateLevel(editRowId, editedRowData);
            setEditRowId(null);
            setEditedRowData(null);
            fetchData(); // Refresh data
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleAddNew = async () => {
        if (!editedRowData || !editedRowData.levelName) {
            alert("Level Name cannot be empty.");
            return;
        }
        try {
            await levelApi.createLevel(editedRowData);
            setIsAdding(false);
            setEditedRowData(null);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleDelete = async (levelId: number) => {
        if (window.confirm("Are you sure you want to delete this level?")) {
            try {
                await levelApi.deleteLevel(levelId);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedRowData(prev => ({ ...prev!, [name]: value }));
    };

    const renderRow = (level: Level) => {
        const isEditing = editRowId === level.levelId;
        return (
            <TableRow key={level.levelId}>
                <TableCell>{level.levelId}</TableCell>
                <TableCell>
                    {isEditing ? (
                        <TextField
                            name="levelName"
                            value={editedRowData?.levelName}
                            onChange={handleInputChange}
                            size="small"
                        />
                    ) : (
                        level.levelName
                    )}
                </TableCell>
                <TableCell>
                    {isEditing ? (
                        <TextField
                            name="sequenceOrder"
                            type="number"
                            value={editedRowData?.sequenceOrder}
                            onChange={handleInputChange}
                            size="small"
                        />
                    ) : (
                        level.sequenceOrder
                    )}
                </TableCell>
                <TableCell>
                    {isEditing ? (
                        <>
                            <IconButton onClick={handleSave} color="primary"><SaveIcon /></IconButton>
                            <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={() => handleEdit(level)} color="primary"><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(level.levelId)} color="error"><DeleteIcon /></IconButton>
                        </>
                    )}
                </TableCell>
            </TableRow>
        );
    };
    
    const renderAddRow = () => (
        <TableRow>
            <TableCell>(New)</TableCell>
            <TableCell>
                <TextField name="levelName" placeholder="New Level Name" onChange={handleInputChange} size="small" autoFocus />
            </TableCell>
            <TableCell>
                <TextField name="sequenceOrder" type="number" placeholder="Order" onChange={handleInputChange} size="small" />
            </TableCell>
            <TableCell>
                <IconButton onClick={handleAddNew} color="primary"><SaveIcon /></IconButton>
                <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
            </TableCell>
        </TableRow>
    );

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">Manage Levels</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setIsAdding(true); setEditedRowData({ levelName: '', sequenceOrder: 0 }); }}>
                    Add New Level
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Level Name</TableCell>
                            <TableCell>Sequence Order</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                           levels.map(renderRow)
                        )}
                        {isAdding && renderAddRow()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LevelsPage;