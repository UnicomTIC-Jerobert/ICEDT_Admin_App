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

    5: {
      "title": "At the Market",
      "audioUrl": "https://your-bucket.../market_conversation.mp3",
      "messages": [
        {
          "speaker": "Seller",
          "avatar": "https://.../seller_avatar.png",
          "text": "வணக்கம்! என்ன வேண்டும்?",
          "timestamp": 0.5
        },
        {
          "speaker": "Buyer",
          "avatar": "https://.../buyer_avatar.png",
          "text": "எனக்கு ஒரு கிலோ தக்காளி வேண்டும்.",
          "timestamp": 3.2
        },
        {
          "speaker": "Seller",
          "text": "சரி, இதோ இருக்கிறது. வேறு என்ன வேண்டும்?",
          "timestamp": 6.8
        },
        {
          "speaker": "Buyer",
          "text": "போதும், நன்றி. எவ்வளவு?",
          "timestamp": 10.1
        }
      ]
    },
    6: {
      "title": "நிலா நிலா ஓடி வா",
      "artist": "Traditional",
      "albumArtUrl": "https://your-bucket.../nila_nila_album_art.jpg",
      "audioUrl": "https://your-bucket.../nila_nila_odi_vaa.mp3",
      "lyrics": [
        { "text": "நிலா நிலா ஓடி வா", "timestamp": 2.5 },
        { "text": "நில்லாமல் ஓடி வா", "timestamp": 5.0 },
        { "text": "மலை மேலே ஏறி வா", "timestamp": 7.8 },
        { "text": "மல்லிகைப் பூ கொண்டு வா", "timestamp": 10.5 }
      ]
    }

    // Add templates for all 18 activity types here...
  };

  const template = templates[activityTypeId] || { note: "No template defined for this activity type yet." };

  // Return as a nicely formatted string
  return JSON.stringify(template, null, 2);
};