import React, { useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InlineCrudTable from '../components/common/InlineCrudTable';
import { Lesson } from '../types/lesson';
import * as lessonApi from '../api/lessonApi';
import { LessonCreateDto } from '../api/lessonApi';

// A custom hook to easily get URL query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LessonsPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const levelId = query.get('levelId');

    // Define the API service with the levelId baked in.
    // useMemo ensures this object is not recreated on every render.
    const apiService = useMemo(() => {
        if (!levelId) return null;
        
        const numericLevelId = parseInt(levelId, 10);

        return {
            getAll: () => lessonApi.getLessonsByLevelId(numericLevelId),
            create: (newItem: LessonCreateDto) => lessonApi.create({ ...newItem, levelId: numericLevelId }),
            update: (id: number | string, itemToUpdate: Partial<LessonCreateDto>) => lessonApi.update(id, { ...itemToUpdate, levelId: numericLevelId }),
            delete: lessonApi.deleteItem
        };
    }, [levelId]);

    // Define the columns for the table.
    const columns = [
        { field: 'lessonName' as keyof Lesson, headerName: 'Lesson Name', type: 'string' as const },
        { field: 'description' as keyof Lesson, headerName: 'Description', type: 'string' as const },
        { field: 'sequenceOrder' as keyof Lesson, headerName: 'Sequence Order', type: 'number' as const }
    ];

    // Define the custom "Manage Activities" button.
    const renderCustomLessonActions = (lesson: Lesson) => (
        <Button 
            component={RouterLink} 
            to={`/activities?lessonId=${lesson.lessonId}`}
            variant="outlined" 
            size="small"
            sx={{ mr: 1 }}
        >
            Manage Activities
        </Button>
    );

    // If levelId is missing from the URL, show an error and a way back.
    if (!apiService || !levelId) {
        return (
            <div style={{ padding: '20px' }}>
                <Typography variant="h5" color="error">Error: No Level ID provided.</Typography>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => navigate('/levels')}
                >
                    Back to Levels
                </Button>
            </div>
        );
    }
    
    return (
        <div>
            <IconButton onClick={() => navigate('/levels')} sx={{ mb: 2 }}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to Levels</Typography>
            </IconButton>

            <InlineCrudTable<Lesson, LessonCreateDto>
                entityName={`Lesson for Level ${levelId}`}
                apiService={apiService}
                columns={columns}
                idField="lessonId"
                renderCustomActions={renderCustomLessonActions}
            />
        </div>
    );
};

export default LessonsPage;