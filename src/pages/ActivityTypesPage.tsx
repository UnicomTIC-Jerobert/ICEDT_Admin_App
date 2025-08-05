import React from 'react';
import InlineCrudTable from '../components/common/InlineCrudTable';
import { ActivityType } from '../types/activityType';
import * as activityTypeApi from '../api/activityTypeApi';
import { ActivityTypeCreateDto } from '../api/activityTypeApi';

const ActivityTypesPage: React.FC = () => {
    
    // 1. Define the columns for the table.
    const columns = [
        { field: 'activityName' as keyof ActivityType, headerName: 'Activity Type Name', type: 'string' as const }
    ];

    // 2. Define the API service object.
    const apiService = {
        getAll: activityTypeApi.getAll,
        create: activityTypeApi.create,
        update: activityTypeApi.update,
        delete: activityTypeApi.deleteItem
    };

    return (
        // 3. Render the generic table with the specific configuration.
        <InlineCrudTable<ActivityType, ActivityTypeCreateDto>
            entityName="Activity Type"
            apiService={apiService}
            columns={columns}
            idField="activityTypeId" // Tell the component the unique ID property is 'id'
        />
    );
};

export default ActivityTypesPage;