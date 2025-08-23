// This file stores the boilerplate JSON for each activity type.

export const getActivityTemplate = (activityTypeId: number): string => {
    const templates: Record<number, object> = {
        1: { // FlashCards
            title: "உடல் உறுப்புகள் (Body Parts)",
            word: "காது",
            imageUrl: "https://.../kaathu.jpg",
            audioUrl: "https://.../kaathu_sound.mp3"
        },
        2: {
  "title": "'க்' சொற்கள்",
  "spotlightLetter": "க்",
  "items": [
    {
      "text": "கொக்கு",
      "imageUrl": "siruvar/lesson5/kokku.jpg",
      "audioUrl": "siruvar/lesson5/kokku.mp3"
    },
    {
      "text": "பாக்கு",
      "imageUrl": "siruvar/lesson5/paakku.jpg",
      "audioUrl": "siruvar/lesson5/paakku.mp3"
    },
    {
      "text": "தக்காளி",
      "imageUrl": "siruvar/lesson5/thakkali.jpg",
      "audioUrl": "siruvar/lesson5/thakkali.mp3"
    }
  ]
},
        3: {
  "title": "'அ' வில் தொடங்கும் சொற்கள்",
  "spotlightLetter": "அ",
  "item": {
    "text": "அம்மா",
    "imageUrl": "malaiyar/lesson1/amma.png",
    "audioUrl": "malaiyar/lesson1/amma.mp3"
  }
},
        4: { // Equation
            leftOperand: "க்",
            rightOperand: "அ",
            correctAnswer: "க",
            options: ["கா", "கி", "க", "கூ"]
        },

        5: { // Matching
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