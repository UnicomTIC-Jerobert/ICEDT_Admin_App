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
    },
    7: {  // RecognitionGrid
      "title": "Find the picture that matches the sound",
      "pages":
      {
        "gridItems": [
          { "id": 1, "imageUrl": "...", "audioUrl": ".../pal.mp3" },      // பல்
          { "id": 2, "imageUrl": "...", "audioUrl": ".../kal.mp3" },      // கல்
          { "id": 3, "imageUrl": "...", "audioUrl": ".../kan.mp3" },      // கண்
          { "id": 4, "imageUrl": "...", "audioUrl": ".../maram.mp3" },    // மரம்
          { "id": 5, "imageUrl": "...", "audioUrl": ".../vattam.mp3" },   // வட்டம்
          { "id": 6, "imageUrl": "...", "audioUrl": ".../naram.mp3" }     // நகரம்
        ],
        "correctItemIds": [1, 2, 3] // The user must find பல், கல், and கண் on this page
      }
    },
    8: { // CharacterGrid
      "title": "Find the letter that matches the sound",
      "pages":
      {
        "gridItems": [
          { "id": 1, "character": "க", "audioUrl": ".../ka.mp3" },
          { "id": 2, "character": "ங", "audioUrl": ".../nga.mp3" },
          { "id": 3, "character": "ச", "audioUrl": ".../sa.mp3" },
          // ... and so on for all 18 letters
        ],
        "correctItemIds": [1, 2, 3] // The user must find all of them
      }

    },
    9: {// WordPairMCQ
      "title": "Listen to the sound and choose the correct word",
      "questions": [
        {
          "id": 1,
          "promptAudioUrl": ".../paal_sound.mp3",
          "choices": ["பல்", "பால்"],
          "correctAnswer": "பால்"
        },
        {
          "id": 2,
          "promptAudioUrl": ".../aram_sound.mp3",
          "choices": ["அரம்", "ஆரம்"],
          "correctAnswer": "அரம்"
        },
        {
          "id": 3,
          "promptAudioUrl": ".../kaal_sound.mp3",
          "choices": ["கல்", "கால்"],
          "correctAnswer": "கால்"
        }
        // ... and so on for all word pairs
      ]
    },
    10: { // word finder
      "title": "Find the words containing the letter",
      "challenges": [
        {
          "targetLetter": "ல்",
          "wordGrid": ["பல்", "கல்", "கண்", "மண்", "வயல்", "மரம்", "படம்", "தடம்", "அப்பம்", "வள்ளம்"],
          "correctWords": ["பல்", "கல்", "வயல்", "வள்ளம்"]
        },
        {
          "targetLetter": "ட்",
          "wordGrid": ["பம்பரம்", "பட்டம்", "வட்டம்", "நகரம்", "படம்", "தடம்", "கல்", "கண்", "மண்", "அப்பம்"],
          "correctWords": ["பட்டம்", "வட்டம்"]
        }
      ]
    }


    // Add templates for all 18 activity types here...
  };

  const template = templates[activityTypeId] || { note: "No template defined for this activity type yet." };

  // Return as a nicely formatted string
  return JSON.stringify(template, null, 2);
};