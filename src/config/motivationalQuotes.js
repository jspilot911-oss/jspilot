/**
 * Daily Motivational Thoughts & Inspiring Quotes Service
 * Curated for Exam Aspirants, Students, and Goal Achievers
 */

export const MOTIVATIONAL_QUOTES = [
  {
    id: 1,
    quote: "Small daily improvements over time lead to stunning results. Stay focused today!",
    author: "Robin Sharma",
    category: "Consistency 🔥"
  },
  {
    id: 2,
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "Action & Mindset ⚡"
  },
  {
    id: 3,
    quote: "Push yourself, because no one else is going to do it for you. Your future self will thank you!",
    author: "JSPilot Discipline",
    category: "Exam Success 📚"
  },
  {
    id: 4,
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    category: "Daily Habits 🎯"
  },
  {
    id: 5,
    quote: "The secret of getting ahead is getting started. Break your complex tasks into small manageable blocks.",
    author: "Mark Twain",
    category: "Task Focus 🧠"
  },
  {
    id: 6,
    quote: "Don't watch the clock; do what it does. Keep going!",
    author: "Sam Levenson",
    category: "Persistence ⏱️"
  },
  {
    id: 7,
    quote: "Future rewards require present discipline. Your target exam is closer than you think!",
    author: "JSPilot Engine",
    category: "Exam Motivation 🏆"
  },
  {
    id: 8,
    quote: "It always seems impossible until it's done. One study block at a time!",
    author: "Nelson Mandela",
    category: "Belief & Vision ✨"
  },
  {
    id: 9,
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Self Control 🛡️"
  },
  {
    id: 10,
    quote: "Your hard work will pay off in ways you cannot even imagine today. Trust your schedule!",
    author: "JSPilot Assistant",
    category: "Confidence 🌟"
  }
];

export function getDailyQuote(dateKey = '') {
  let seed = 0;
  if (dateKey) {
    for (let i = 0; i < dateKey.length; i++) {
      seed += dateKey.charCodeAt(i);
    }
  } else {
    const today = new Date();
    seed = today.getFullYear() + today.getMonth() + today.getDate();
  }
  const index = seed % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}

export function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
}
