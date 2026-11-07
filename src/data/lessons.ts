export interface Question {
  id: string;
  type: 'multiple-choice' | 'sentence-builder' | 'dialogue' | 'audio';
  prompt: string;
  englishPrompt: string;
  options?: string[];
  correctAnswer: string | string[]; // For sentence-builder, array of words in order
  audioText?: string; // Text to speak using SpeechSynthesis
  context?: string; // Additional instruction or conversation bubble
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpAward: number;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const LANGUAGE_COURSES: Record<string, { flag: string; nativeName: string; units: Unit[] }> = {
  Spanish: {
    flag: "🇪🇸",
    nativeName: "Español",
    units: [
      {
        id: "es-unit-1",
        title: "Unit 1: Foundations & Greetings",
        subtitle: "Learn basic greetings, introducing yourself, and ordering food",
        lessons: [
          {
            id: "es-l1",
            title: "Essential Greetings",
            description: "Say hello, goodbye, and introduce yourself.",
            xpAward: 15,
            questions: [
              {
                id: "es-q1",
                type: "multiple-choice",
                prompt: "¿Cómo estás?",
                englishPrompt: "How are you?",
                options: ["How are you?", "Good morning", "Goodbye", "My name is"],
                correctAnswer: "How are you?"
              },
              {
                id: "es-q2",
                type: "sentence-builder",
                prompt: "Yo soy un niño.",
                englishPrompt: "I am a boy.",
                options: ["un", "Yo", "niño", "un", "soy", "manzana", "ella"],
                correctAnswer: ["Yo", "soy", "un", "niño"]
              },
              {
                id: "es-q3",
                type: "dialogue",
                prompt: "Hola, buenos días. ¿Cómo te llamas?",
                englishPrompt: "Hello, good morning. What is your name?",
                context: "Teacher: Hola, buenos días. ¿Cómo te llamas?\nYou: ________",
                options: [
                  "Hola, me llamo Carlos.",
                  "Adiós, buenas noches.",
                  "La manzana es roja.",
                  "Mucho gusto, de nada."
                ],
                correctAnswer: "Hola, me llamo Carlos."
              },
              {
                id: "es-q4",
                type: "audio",
                prompt: "Listen carefully and write the greeting in Spanish:",
                englishPrompt: "Hello",
                audioText: "Hola",
                correctAnswer: "hola"
              }
            ]
          },
          {
            id: "es-l2",
            title: "At the Café",
            description: "Ordering coffee, saying please and thank you.",
            xpAward: 20,
            questions: [
              {
                id: "es-q5",
                type: "multiple-choice",
                prompt: "Un café, por favor.",
                englishPrompt: "What does this mean?",
                options: ["A coffee, please.", "A hot tea, thank you.", "A cold beer.", "Goodbye, see you tomorrow."],
                correctAnswer: "A coffee, please."
              },
              {
                id: "es-q6",
                type: "sentence-builder",
                prompt: "Muchas gracias, adiós.",
                englishPrompt: "Thank you very much, goodbye.",
                options: ["gracias", "leche", "Muchas", "adiós", "café", "hola", "por"],
                correctAnswer: ["Muchas", "gracias", "adiós"]
              },
              {
                id: "es-q7",
                type: "audio",
                prompt: "Listen and type what you hear in Spanish:",
                englishPrompt: "Please",
                audioText: "Por favor",
                correctAnswer: "por favor"
              }
            ]
          }
        ]
      },
      {
        id: "es-unit-2",
        title: "Unit 2: Family & Daily Life",
        subtitle: "Talk about your family members and describe your daily schedule",
        lessons: [
          {
            id: "es-l3",
            title: "Meet the Family",
            description: "Learn words for father, mother, brother, and sister.",
            xpAward: 25,
            questions: [
              {
                id: "es-q8",
                type: "multiple-choice",
                prompt: "Mi madre es simpática.",
                englishPrompt: "What does this mean?",
                options: ["My mother is nice.", "My father is tall.", "My brother is smart.", "My friend is friendly."],
                correctAnswer: "My mother is nice."
              },
              {
                id: "es-q9",
                type: "sentence-builder",
                prompt: "Tengo un hermano mayor.",
                englishPrompt: "I have an older brother.",
                options: ["Tengo", "una", "hermano", "mayor", "un", "perro", "gato"],
                correctAnswer: ["Tengo", "un", "hermano", "mayor"]
              }
            ]
          }
        ]
      }
    ]
  },
  Japanese: {
    flag: "🇯🇵",
    nativeName: "日本語",
    units: [
      {
        id: "jp-unit-1",
        title: "Unit 1: Hiragana & Greetings",
        subtitle: "Master basic characters and fundamental everyday greetings",
        lessons: [
          {
            id: "jp-l1",
            title: "First Encounters",
            description: "Learn hello, thank you, and farewell.",
            xpAward: 15,
            questions: [
              {
                id: "jp-q1",
                type: "multiple-choice",
                prompt: "こんにちは (Konnichiwa)",
                englishPrompt: "Translate this greeting:",
                options: ["Hello / Good afternoon", "Thank you", "Good night", "Excuse me"],
                correctAnswer: "Hello / Good afternoon"
              },
              {
                id: "jp-q2",
                type: "sentence-builder",
                prompt: "はじめまして、よろしく。(Hajimemashite, yoroshiku.)",
                englishPrompt: "Nice to meet you, please be kind.",
                options: ["はじめまして", "ありがとう", "よろしく", "さようなら", "、"],
                correctAnswer: ["はじめまして", "、", "よろしく"]
              },
              {
                id: "jp-q3",
                type: "dialogue",
                prompt: "ありがとう ございます！ (Arigatou gozaimasu!)",
                englishPrompt: "Thank you very much!",
                context: "Shopkeeper: ありがとうございました！\nYou: ________",
                options: [
                  "どういたしまして (You're welcome)",
                  "こんにちは (Hello)",
                  "さようなら (Goodbye)",
                  "ごめんなさい (Sorry)"
                ],
                correctAnswer: "どういたしまして (You're welcome)"
              },
              {
                id: "jp-q4",
                type: "audio",
                prompt: "Listen and write down the word in Romaji or Hiragana:",
                englishPrompt: "Water",
                audioText: "Mizu",
                correctAnswer: "mizu"
              }
            ]
          }
        ]
      }
    ]
  },
  French: {
    flag: "🇫🇷",
    nativeName: "Français",
    units: [
      {
        id: "fr-unit-1",
        title: "Unit 1: Bienvenue!",
        subtitle: "Introduce yourself and talk about where you live",
        lessons: [
          {
            id: "fr-l1",
            title: "Introductions",
            description: "Introduce yourself and state your nationality.",
            xpAward: 15,
            questions: [
              {
                id: "fr-q1",
                type: "multiple-choice",
                prompt: "Je m'appelle Pierre.",
                englishPrompt: "What is Pierre saying?",
                options: ["My name is Pierre.", "I live with Pierre.", "I like Pierre.", "Pierre is my brother."],
                correctAnswer: "My name is Pierre."
              },
              {
                id: "fr-q2",
                type: "sentence-builder",
                prompt: "Enchanté de vous rencontrer.",
                englishPrompt: "Delighted to meet you.",
                options: ["vous", "rencontrer", "Enchanté", "de", "tu", "merci"],
                correctAnswer: ["Enchanté", "de", "vous", "rencontrer"]
              }
            ]
          }
        ]
      }
    ]
  },
  German: {
    flag: "🇩🇪",
    nativeName: "Deutsch",
    units: [
      {
        id: "de-unit-1",
        title: "Unit 1: Hello Germany",
        subtitle: "Master simple social phrases and count to ten",
        lessons: [
          {
            id: "de-l1",
            title: "Getting Started",
            description: "Learn to say hello and ask how someone is.",
            xpAward: 15,
            questions: [
              {
                id: "de-q1",
                type: "multiple-choice",
                prompt: "Wie geht es dir?",
                englishPrompt: "What does this question mean?",
                options: ["How are you?", "What is your name?", "Where are you from?", "How old are you?"],
                correctAnswer: "How are you?"
              },
              {
                id: "de-q2",
                type: "sentence-builder",
                prompt: "Es geht mir gut, danke.",
                englishPrompt: "I am doing well, thank you.",
                options: ["gut", "Es", "danke", "geht", "mir", "schlecht", "hallo"],
                correctAnswer: ["Es", "geht", "mir", "gut", "danke"]
              }
            ]
          }
        ]
      }
    ]
  }
};
