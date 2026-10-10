import { ActivityType } from './activityType';
import { MainActivity } from './mainActivity';

export interface Activity {
    activityId: number;
    lessonId: number;
    title: string;
    sequenceOrder: number;
    activityTypeId: number;
    mainActivityId: number;
    contentJson: string;
    isHidden?: boolean;
    
    // Optional navigation properties for display purposes
    activityType?: ActivityType; 
    mainActivity?: MainActivity;
}