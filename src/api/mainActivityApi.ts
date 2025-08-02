import { MainActivity } from '../types/mainActivity';

const API_BASE_URL = '/api/mainactivities';

// Define the type for the data needed to create/update a MainActivity
export type MainActivityCreateDto = Omit<MainActivity, 'id'>;

// GET all main activities
export const getAll = async (): Promise<MainActivity[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch main activities');
    }
    return response.json();
};

// POST a new main activity
export const create = async (newItem: MainActivityCreateDto): Promise<MainActivity> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!response.ok) {
        throw new Error('Failed to create main activity');
    }
    return response.json();
};

// PUT (update) an existing main activity
export const update = async (id: number | string, itemToUpdate: Partial<MainActivityCreateDto>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToUpdate)
    });
    if (!response.ok) {
        throw new Error('Failed to update main activity');
    }
};

// DELETE a main activity
export const deleteItem = async (id: number | string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete main activity');
    }
};