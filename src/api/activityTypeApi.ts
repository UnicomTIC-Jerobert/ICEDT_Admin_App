import { ActivityType } from '../types/activityType';

const API_BASE_URL = '/api/activitytypes';

// Define the type for the data needed to create/update an ActivityType
export type ActivityTypeCreateDto = Omit<ActivityType, 'id'>;

// GET all activity types
export const getAll = async (): Promise<ActivityType[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch activity types');
    }
    return response.json();
};

// POST a new activity type
export const create = async (newItem: ActivityTypeCreateDto): Promise<ActivityType> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!response.ok) {
        throw new Error('Failed to create activity type');
    }
    return response.json();
};

// PUT (update) an existing activity type
export const update = async (id: number | string, itemToUpdate: Partial<ActivityTypeCreateDto>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToUpdate)
    });
    if (!response.ok) {
        throw new Error('Failed to update activity type');
    }
};

// DELETE an activity type
export const deleteItem = async (id: number | string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete activity type');
    }
};