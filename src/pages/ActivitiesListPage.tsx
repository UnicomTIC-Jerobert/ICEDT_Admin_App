import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Activity } from '../types/activity';
import * as activityApi from '../api/activityApi';
import * as lessonApi from '../api/lessonApi'; // To get the lesson name

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivitiesListPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const lessonId = query.get('lessonId');
    
    const [activities, setActivities] = useState<Activity[]>([]);
    const [lessonName, setLessonName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!lessonId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch both lesson name and activities in parallel
                const lessonPromise = lessonApi.getLessonById(lessonId); // You'll need to create this simple API function
                const activitiesPromise = activityApi.getActivitiesByLessonId(lessonId);

                const [lesson, activitiesData] = await Promise.all([lessonPromise, activitiesPromise]);

                setLessonName(lesson.lessonName);
                setActivities(activitiesData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [lessonId]);

    const handleDelete = async (activityId: number) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            try {
                await activityApi.deleteActivity(activityId);
                // Refresh the list after deleting
                setActivities(prev => prev.filter(act => act.activityId !== activityId));
            } catch (error) {
                console.error(error);
                alert("Failed to delete activity.");
            }
        }
    };

    if (!lessonId) {
        return <Typography color="error">Error: No Lesson ID provided.</Typography>;
    }

    return (
        <Box p={3}>
            <IconButton onClick={() => navigate('/lessons')} sx={{ mb: 2 }}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to Lessons</Typography>
            </IconButton>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    Activities for: "{lessonName}"
                </Typography>
                <Button 
                    component={RouterLink} 
                    to={`/activity-edit?lessonId=${lessonId}`}
                    variant="contained" 
                    startIcon={<AddIcon />}
                >
                    Add New Activity
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Order</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                           activities.map(activity => (
                               <TableRow key={activity.activityId}>
                                   <TableCell>{activity.activityId}</TableCell>
                                   <TableCell>{activity.title}</TableCell>
                                   <TableCell>{activity.sequenceOrder}</TableCell>
                                   <TableCell>
                                       <IconButton 
                                           component={RouterLink} 
                                           to={`/activity-edit?activityId=${activity.activityId}`}
                                           color="primary"
                                        >
                                           <EditIcon />
                                       </IconButton>
                                       <IconButton onClick={() => handleDelete(activity.activityId)} color="error">
                                           <DeleteIcon />
                                       </IconButton>
                                   </TableCell>
                               </TableRow>
                           ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ActivitiesListPage;