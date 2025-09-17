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
    },
    11: { // Scene Finder
      "title": "Find the items on the farm",
      "sceneImageUrl": "https://your-bucket.../farm_scene.jpg",
      "hotspots": [
        {
          "id": 1, "name": "ஆடு", "audioUrl": ".../aadu_find.mp3",
          "x": 60, "y": 70, "width": 15, "height": 15
        },
        {
          "id": 2, "name": "குதிரை", "audioUrl": ".../kuthirai_find.mp3",
          "x": 20, "y": 55, "width": 25, "height": 30
        },
        {
          "id": 3, "name": "சேவல்", "audioUrl": ".../seval_find.mp3",
          "x": 80, "y": 40, "width": 10, "height": 10
        },
        {
          "id": 4, "name": "வைக்கோல்", "audioUrl": ".../vaikkol_find.mp3",
          "x": 5, "y": 75, "width": 20, "height": 15
        }
      ]
    },
    12: { // story player
      "title": "The Thirsty Crow",
      "audioUrl": "https://your-bucket.../thirsty_crow_narration.mp3",
      "scenes": [
        {
          "imageUrl": "https://your-bucket.../crow_sees_pot.jpg",
          "text": "ஒரு காகம் மிகவும் தாகமாக இருந்தது. அது தண்ணீரைத் தேடி எல்லா இடங்களிலும் பறந்தது.",
          "timestamp": 0.5
        },
        {
          "imageUrl": "https://your-bucket.../crow_finds_pebbles.jpg",
          "text": "திடீரென்று, அது ஒரு பானையைக் கண்டது. ஆனால் பானையில் தண்ணீர் குறைவாகவே இருந்தது.",
          "timestamp": 8.2
        },
        {
          "imageUrl": "https://your-bucket.../crow_drops_pebbles.jpg",
          "text": "காகம் யோசித்தது. அது அருகிலிருந்த கூழாங்கற்களை எடுத்து பானையில் போட்டது.",
          "timestamp": 15.6
        },
        {
          "imageUrl": "https://your-bucket.../crow_drinks_water.jpg",
          "text": "தண்ணீர் மட்டம் உயர்ந்தது. காகம் மகிழ்ச்சியுடன் தண்ணீரைக் குடித்தது.",
          "timestamp": 23.0
        }
      ]
    },
    13: {
      "id": 1,
      "title": "Select the Dog",
      "audioUrl": "https://your-bucket.../dog_sound.mp3",
      "options": [
        {
          "id": "1",
          "imageUrl": "https://your-bucket.../dog_image.jpg",
          "isCorrect": true
        },
        {
          "id": "2",
          "imageUrl": "https://your-bucket.../cat_image.jpg",
          "isCorrect": false
        },
        {
          "id": "3",
          "imageUrl": "https://your-bucket.../rabbit_image.jpg",
          "isCorrect": false
        }
      ]
    },
    14: {
      "id": 2,
      "title": "உறைவிடங்கள்",
      "question":
      {
        "id": "1",
        "imageUrl": "house.jpg",
        "text": "வீடு",
        "solliyangal": "மாற்றியின் வீடு என்பது பாடசாலைக்குப் பக்கத்தில் உள்ளது.",
        "audioUrl": "",
        "vinaakkal": "உமது பாடசாலைக்குப் பக்கத்தில் என்ன உள்ளது?",
        "isCorrect": true
        
      }
    },
    16:
    {
      "title": "பாடம் 1: விலங்குகள்",
      "description": "இந்த காணொளியில் விலங்குகளைப் பற்றி கற்போம்.",
      "videoUrl": "https://example.com/media/animals_lesson.mp4"
    },
    17:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 01",
      "instruction": "எழுத்துகளை அறிந்து சொற்களை உருவாக்குதல். கீழே கொடுக்கப்பட்டுள்ள எழுத்துகளிலிருந்து சரியானதை தேர்ந்தெடுத்து இடைவெளியை நிரப்புக.",
      "sentences": [
        "மூக்____",
        "சங்____",
        "பச்____",
        "குட____",
        "வண்____"
      ],
      "options": [
        "கு",
        "சை",
        "ம்",
        "டு",
        "லை",
        "பம்",
        "டம்",
        "சு"
      ],
      "solutions": [
        "கு",
        "கு",
        "சை",
        "ம்",
        "டு"
      ]
    },
    19:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 02",
      "instruction": "ஒரு/ஓர் வேறுபாட்டைக் காணக்கூடியவாறு சொற்களை ஒழுங்குபடுத்தல். கொடுக்கப்பட்டுள்ள சொற்களை சரியான வட்டத்தில் இழுத்துவிடவும்.",
      "categories": [
        {
          "id": "or",
          "title": "ஓர்"
        },
        {
          "id": "oru",
          "title": "ஒரு"
        }
      ],
      "words": [
        {
          "id": "word1",
          "text": "ஏணி",
          "category": "or"
        },
        {
          "id": "word2",
          "text": "எறும்பு",
          "category": "or"
        },
        {
          "id": "word3",
          "text": "ஆடு",
          "category": "or"
        },
        {
          "id": "word4",
          "text": "அன்னம்",
          "category": "or"
        },
        {
          "id": "word5",
          "text": "குழந்தை",
          "category": "oru"
        },
        {
          "id": "word6",
          "text": "வீடு",
          "category": "oru"
        },
        {
          "id": "word7",
          "text": "பூ",
          "category": "oru"
        },
        {
          "id": "word8",
          "text": "தாமரை",
          "category": "oru"
        },
        {
          "id": "word9",
          "text": "முயல்",
          "category": "oru"
        },
        {
          "id": "word10",
          "text": "கரடி",
          "category": "oru"
        },
        {
          "id": "word11",
          "text": "தவளை",
          "category": "oru"
        }
      ]
    },
    21:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 03",
      "instruction": "திரையில் தோன்றும் வடிவங்களை சரியான எழுத்துகளுடன் கோடிட்டு இணைக்கவும்.",
      "leftItems": [
        {
          "id": "left-a",
          "content": "அ"
        },
        {
          "id": "left-aa",
          "content": "ஆ"
        },
        {
          "id": "left-i",
          "content": "இ"
        },
        {
          "id": "left-ii",
          "content": "ஈ"
        },
        {
          "id": "left-u",
          "content": "உ"
        }
      ],
      "rightItems": [
        {
          "id": "right-a",
          "content": "அ"
        },
        {
          "id": "right-aa",
          "content": "ஆ"
        },
        {
          "id": "right-i",
          "content": "இ"
        },
        {
          "id": "right-ii",
          "content": "ஈ"
        },
        {
          "id": "right-u",
          "content": "உ"
        }
      ],
      "solutions": {
        "left-a": "right-a",
        "left-aa": "right-aa",
        "left-i": "right-i",
        "left-ii": "right-ii",
        "left-u": "right-u"
      }




    },
    22:
    {
      "title": "பயிற்சி",
      "activityTitle": "செயல் 04",
      "instruction": "கீழே கொடுக்கப்பட்டுள்ள எழுத்துக்களை சரியான முறையில் வரிசைப்படுத்தி சொற்களை உருவாக்கவும்.",
      "words": [
        {
          "id": "word1",
          "scrambled": ["மி", "ழ்", "த"],
          "solution": "தமிழ்"
        },
        {
          "id": "word2",
          "scrambled": ["ழி", "மொ"],
          "solution": "மொழி"
        },
        {
          "id": "word3",
          "scrambled": ["மை", "னி", "இ"],
          "solution": "இனிமை"
        },
        {
          "id": "word4",
          "scrambled": ["வ", "பு", "ல", "ர்"],
          "solution": "புலவர்"
        },
        {
          "id": "word5",
          "scrambled": ["டு", "வீ"],
          "solution": "வீடு"
        },
        {
          "id": "word6",
          "scrambled": ["டு", "ஆ"],
          "solution": "ஆடு"
        },
        {
          "id": "word7",
          "scrambled": ["வு", "உ", "ண"],
          "solution": "உணவு"
        },
        {
          "id": "word8",
          "scrambled": ["ய்", "தா"],
          "solution": "தாய்"
        },
        {
          "id": "word9",
          "scrambled": ["மை", "ழை", "ப"],
          "solution": "பழைமை"
        },
        {
          "id": "word10",
          "scrambled": ["வு", "அ", "றி"],
          "solution": "அறிவு"
        }
      ]
    },
25:
{
  "title": "சொற்களை ஒழுங்குபடுத்துதல்",
  "activityTitle": "செயல் 05",
  "instruction": "கீழே கொடுக்கப்பட்டுள்ள சொற்களை சரியான முறையில் வரிசைப்படுத்தி வாக்கியங்களை உருவாக்கவும்.",
  "sentences": [
    {
      "id": "sent1",
      "scrambled": [
        "எங்கள்",
        "தமிழ்",
        "தாய்மொழி"
      ],
      "solution": "தமிழ் எங்கள் தாய்மொழி."
    },
    {
      "id": "sent2",
      "scrambled": [
        "தமிழர்",
        "நாங்கள்"
      ],
      "solution": "நாங்கள் தமிழர்."
    },
    {
      "id": "sent3",
      "scrambled": [
        "ஓர்",
        "மொழி",
        "தமிழ்",
        "இனிய"
      ],
      "solution": "தமிழ் ஓர் இனிய மொழி."
    },
    {
      "id": "sent4",
      "scrambled": [
        "தந்த",
        "மொழி",
        "சொல்லித்",
        "அன்னை"
      ],
      "solution": "அன்னை சொல்லித் தந்த மொழி."
    },
    {
      "id": "sent5",
      "scrambled": [
        "கற்ற",
        "பள்ளி",
        "மொழி",
        "சென்று"
      ],
      "solution": "பள்ளி சென்று கற்ற மொழி."
    }
  ]
}








    // Add templates for all 18 activity types here...
  };

  const template = templates[activityTypeId] || { note: "No template defined for this activity type yet." };

  // Return as a nicely formatted string
  return JSON.stringify(template, null, 2);
};