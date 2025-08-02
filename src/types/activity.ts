import { ActivityType } from './activityType';
import { MainActivity } from './mainActivity';

export interface Activity {
    activityId: number;
    lessonId: number;
    title: string | null;
    sequenceOrder: number;
    activityTypeId: number;
    mainActivityId: number;
    contentJson: string;
    
    // Optional navigation properties for display purposes
    activityType?: ActivityType; 
    mainActivity?: MainActivity;
}