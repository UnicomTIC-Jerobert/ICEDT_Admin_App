import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import InlineCrudTable from '../components/common/InlineCrudTable';
import { Level } from '../types/level';
import * as levelApi from '../api/levelApi';
import { LevelCreateDto } from '../api/levelApi';

const LevelsPage: React.FC = () => {
    
    // 1. Define the columns for the table.
    const columns = [
        { field: 'levelName' as keyof Level, headerName: 'Level Name', type: 'string' as const },
        { field: 'sequenceOrder' as keyof Level, headerName: 'Sequence Order', type: 'number' as const }
    ];

    // 2. Define the API service object.
    const apiService = {
        getAll: levelApi.getAll,
        create: levelApi.create,
        update: levelApi.update,
        delete: levelApi.deleteItem
    };

    // 3. *** THE CUSTOMIZATION PART ***
    //    Define a function that returns the custom "Manage Lessons" button.
    //    This function will be passed as a prop to the generic table.
    const renderCustomLevelActions = (level: Level) => (
        <Button 
            component={RouterLink} 
            to={`/lessons?levelId=${level.levelId}`} // Link to the lessons page with the levelId
            variant="outlined" 
            size="small"
            sx={{ mr: 1 }} // Add some margin to the right
        >
            Manage Lessons
        </Button>
    );

    return (
        // 4. Render the generic table, passing in the specific configuration and the custom action renderer.
        <InlineCrudTable<Level, LevelCreateDto>
            entityName="Level"
            apiService={apiService}
            columns={columns}
            idField="levelId" // Tell the component the unique ID is 'levelId'
            renderCustomActions={renderCustomLevelActions} // Pass the custom function here
        />
    );
};

export default LevelsPage;