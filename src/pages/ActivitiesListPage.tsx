import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Activity } from '../types/activity';
import * as activityApi from '../api/activityApi';
import * as lessonApi from '../api/lessonApi';
import ActivityPlayerModal from '../components/activities/ActivityPlayerModal'; // <-- IMPORT THE NEW PLAYER

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivitiesListPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const lessonId = query.get('lessonId');

    const [activities, setActivities] = useState<Activity[]>([]);
    const [lesson, setLesson] = useState<{ id: string, name: string, levelId: number } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // --- State for the Preview Modal ---
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [activityToPreview, setActivityToPreview] = useState<Activity | null>(null);

    useEffect(() => {
        if (!lessonId) return;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const lessonData = await lessonApi.getLessonById(lessonId);
                const activitiesData = await activityApi.getActivitiesByLessonId(lessonId);
                setLesson({ id: lessonId, name: lessonData.lessonName, levelId: lessonData.levelId });
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
                setActivities(prev => prev.filter(act => act.activityId !== activityId));
            } catch (error) {
                console.error(error);
                alert("Failed to delete activity.");
            }
        }
    };

    const handleOpenPreview = (activity: Activity) => {
        setActivityToPreview(activity);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setActivityToPreview(null);
    };

    if (!lessonId) {
        return <Typography color="error">Error: No Lesson ID provided.</Typography>;
    }

    return (
        <Box p={3}>
            <IconButton onClick={() => navigate(`/lessons?levelId=${lesson?.levelId || ''}`)} sx={{ mb: 2 }} disabled={isLoading}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to Lessons</Typography>
            </IconButton>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    Activities for: "{lesson?.name}"
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

                                        <IconButton onClick={() => handleOpenPreview(activity)} color="info" title="Preview Activity">
                                            <VisibilityIcon />
                                        </IconButton>
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


            {/* --- The Preview Modal --- */}
            {activityToPreview && (
                <ActivityPlayerModal
                    isOpen={isPreviewOpen}
                    onClose={handleClosePreview}
                    activity={activityToPreview}
                />
            )}
        </Box>
    );
};

export default ActivitiesListPage;