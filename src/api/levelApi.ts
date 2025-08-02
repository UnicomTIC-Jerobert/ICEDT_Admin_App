import { Level } from '../types/level';

const API_BASE_URL = '/api/levels'; // The proxy will handle the full URL

export const getLevels = async (): Promise<Level[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch levels');
    }
    return response.json();
};

export const createLevel = async (level: Omit<Level, 'levelId'>): Promise<Level> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(level)
    });

    if (!response.ok) {
        throw new Error('Failed to create level');
    }
    return response.json();
};

export const updateLevel = async (levelId: number, level: Omit<Level, 'levelId'>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${levelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(level)
    });

    if (!response.ok) {
        throw new Error('Failed to update level');
    }
};

export const deleteLevel = async (levelId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${levelId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete level');
    }
};
