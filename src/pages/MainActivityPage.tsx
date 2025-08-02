import React from 'react';
import InlineCrudTable from '../components/common/InlineCrudTable';
import type { MainActivity } from '../types/mainActivity';
import * as mainActivityApi from '../api/mainActivityApi';
import type { MainActivityCreateDto } from '../api/mainActivityApi'; // Import the DTO type

const MainActivityPage: React.FC = () => {
    
    // 1. Define the columns for the table.
    // 'field' must match a property in the MainActivity interface.
    // 'headerName' is what the user sees.
    const columns = [
        { field: 'name' as keyof MainActivity, headerName: 'Activity Name', type: 'string' as const }
    ];

    // 2. Define the API service object that the table will use.
    // The keys (getAll, create, etc.) must match the CrudApiService interface.
    const apiService = {
        getAll: mainActivityApi.getAll,
        create: mainActivityApi.create,
        update: mainActivityApi.update,
        delete: mainActivityApi.deleteItem // Use the specific name from the import
    };

    return (
        // 3. Render the generic table with the specific configuration.
        <InlineCrudTable<MainActivity, MainActivityCreateDto>
            entityName="Main Activity"
            apiService={apiService}
            columns={columns}
            idField="id" // Tell the component which property is the unique ID.
        />
    );
};

export default MainActivityPage;