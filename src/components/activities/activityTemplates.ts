// This file stores the boilerplate JSON for each activity type.

export const getActivityTemplate = (activityTypeId: number): string => {
    const templates: Record<number, object> = {
        4: { // Matching
            title: "Match the pairs",
            columnA: [
                { id: "A1", content: "Item 1A", matchId: "B1" },
                { id: "A2", content: "Item 2A", matchId: "B2" }
            ],
            columnB: [
                { id: "B1", content: "Item 1B", matchId: "A1" },
                { id: "B2", content: "Item 2B", matchId: "A2" }
            ]
        },
        7: { // FillInTheBlanks (Equation variant)
            leftOperand: "க்",
            rightOperand: "அ",
            correctAnswer: "க",
            options: ["கா", "கி", "க", "கூ"]
        },
        13: { // MCQ
            question: "What is the correct answer?",
            choices: [
                { id: 1, text: "Incorrect Option", isCorrect: false },
                { id: 2, text: "Correct Option", isCorrect: true },
                { id: 3, text: "Another Incorrect Option", isCorrect: false }
            ]
        },
        // Add templates for all 18 activity types here...
    };

    const template = templates[activityTypeId] || { note: "No template defined for this activity type yet." };
    
    // Return as a nicely formatted string
    return JSON.stringify(template, null, 2);
};