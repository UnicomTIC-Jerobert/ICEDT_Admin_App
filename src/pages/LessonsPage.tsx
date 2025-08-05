import React, { useMemo } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DependentInlineCrudTable from '../components/common/DependentInlineCrudTable';
import { Lesson } from '../types/lesson';
import * as lessonApi from '../api/lessonApi';
import { LessonCreateDto } from '../api/lessonApi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LessonsPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const levelId = query.get('levelId');

    // Handle the error case where levelId is missing from the URL
    if (!levelId) {
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
    
    // Define the API service with the levelId baked in for the create method.
    // useMemo prevents this object from being recreated on every render.
    const apiService = useMemo(() => {
        const numericLevelId = parseInt(levelId, 10);
        return {
            getAllByParentId: () => lessonApi.getLessonsByLevelId(numericLevelId),
            create: (newItem: LessonCreateDto) => lessonApi.create({ ...newItem, levelId: numericLevelId }),
            update: lessonApi.update,
            delete: lessonApi.deleteItem
        };
    }, [levelId]);

    // Define the columns for the table.
    const columns = [
        { field: 'lessonName' as keyof Lesson, headerName: 'Lesson Name', type: 'string' as const },
        { field: 'description' as keyof Lesson, headerName: 'Description', type: 'string' as const },
        { field: 'sequenceOrder' as keyof Lesson, headerName: 'Sequence Order', type: 'number' as const }
    ];

    // Define the custom "Manage Activities" link.
    const renderCustomLessonActions = (lesson: Lesson) => (
        <Button 
            component={RouterLink} 
            to={`/activities?lessonId=${lesson.lessonId}`}
            variant="outlined" size="small" sx={{ mr: 1 }}
        >
            Manage Activities
        </Button>
    );
    
    return (
        // Our DependentInlineCrudTable is now used with a much simpler configuration.
        // It fetches its own data directly.
        <DependentInlineCrudTable<Lesson, LessonCreateDto>
            entityName="Lesson"
            parentName={`Level #${levelId}`} // The title is simple and direct.
            parentRoute="/levels"
            parentId={levelId}
            apiService={apiService}
            columns={columns}
            idField="lessonId"
            renderCustomActions={renderCustomLessonActions}
        />
    );
};

export default LessonsPage;