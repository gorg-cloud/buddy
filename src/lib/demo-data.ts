/**
 * Demo data — powers every page until Supabase is connected.
 * Swap these for real rows from the database once `.env.local` is set up.
 */

export type ProfileRole = "mover" | "buddy" | "anchor";

export interface BuddyProfile {
  id: string;
  handle: string;
  name: string;
  age: number;
  role: ProfileRole;
  from: string;
  to: string;
  school: string;
  country: string;
  moveDate?: string; // ISO — when the mover lands
  answers: Record<string, string>; // questions-first profile
  carried: number; // how many kids this person has helped (the Chain)
  languages: string[];
  emoji: string;
}

export interface AnchorProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  city: string;
  yearsLived: number;
  expertise: string[];
  answers: Record<string, string>;
  languages: string[];
  emoji: string;
}

export interface Arrival {
  id: string;
  flight: string;
  from: string;
  to: string;
  status: "found" | "waiting";
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  done: boolean;
  kind: "intro" | "landing" | "settle";
}

/* ---- Arrivals for the landing board ---- */

export const arrivals: Arrival[] = [
  { id: "a1", flight: "MOVE-1042", from: "CAIRO", to: "LISBON", status: "found" },
  { id: "a2", flight: "MOVE-1047", from: "SEOUL", to: "AMSTERDAM", status: "found" },
  { id: "a3", flight: "MOVE-1051", from: "LAGOS", to: "TORONTO", status: "waiting" },
  { id: "a4", flight: "MOVE-1058", from: "QUITO", to: "MELBOURNE", status: "found" },
  { id: "a5", flight: "MOVE-1062", from: "MUMBAI", to: "BERLIN", status: "waiting" },
  { id: "a6", flight: "MOVE-1067", from: "WARSAW", to: "AUCKLAND", status: "found" },
];

/* ---- People ---- */

export const profiles: BuddyProfile[] = [
  {
    id: "p1",
    handle: "maya",
    name: "Maya",
    age: 15,
    role: "buddy",
    from: "Nairobi",
    to: "Lisbon",
    school: "St. Julian's School",
    country: "Portugal",
    answers: {
      "Scariest part of your move?": "Showing up on day one and not knowing a single face.",
      "One thing you want to do at your new school?": "Join the photography club and shoot the school play.",
      "What do you do when you feel alone?": "I walk. I walk until the city feels like mine.",
      "What's the first thing you'd show a new kid?": "The rooftop where everyone eats lunch — that's where you meet people.",
    },
    carried: 3,
    languages: ["Swahili", "English", "Portuguese (learning)"],
    emoji: "🦒",
  },
  {
    id: "p2",
    handle: "yusuf",
    name: "Yusuf",
    age: 16,
    role: "mover",
    from: "Lagos",
    to: "Toronto",
    school: "Humberside Collegiate",
    country: "Canada",
    moveDate: "2026-09-02",
    answers: {
      "Scariest part of your move?": "Winter. I have never seen snow and everyone keeps laughing at me for it.",
      "One thing you want to do at your new school?": "Try out for the football team and make the starting XI.",
      "What do you do when you feel alone?": "I cook. My mom's jollof recipe is my homesickness medicine.",
      "What's the first thing you'd show a new kid?": "The one street food spot near school that doesn't taste like home but is close.",
    },
    carried: 0,
    languages: ["Yoruba", "English"],
    emoji: "⚽",
  },
  {
    id: "p3",
    handle: "jiwoo",
    name: "Jiwoo",
    age: 14,
    role: "mover",
    from: "Seoul",
    to: "Amsterdam",
    school: "Amsterdam International Community School",
    country: "Netherlands",
    moveDate: "2026-08-24",
    answers: {
      "Scariest part of your move?": "That my English won't be fast enough to keep up in class.",
      "One thing you want to do at your new school?": "Start a K-pop dance club. I'm serious.",
      "What do you do when you feel alone?": "I practice choreography in my room. It's the one thing I control.",
      "What's the first thing you'd show a new kid?": "Which bike routes are safe. Amsterdam is chaos if you don't know the lanes.",
    },
    carried: 0,
    languages: ["Korean", "English"],
    emoji: "🎧",
  },
  {
    id: "p4",
    handle: "sofia",
    name: "Sofia",
    age: 17,
    role: "buddy",
    from: "Quito",
    to: "Melbourne",
    school: "Melbourne High School",
    country: "Australia",
    answers: {
      "Scariest part of your move?": "That I'd be two years behind in a school that measures everything.",
      "One thing you want to do at your new school?": "Row. The river crew is the reason I stayed sane.",
      "What do you do when you feel alone?": "I call home at exactly the same time every Sunday. Ritual beats loneliness.",
      "What's the first thing you'd show a new kid?": "The tram route to the beach. Sunsets fix most bad days.",
    },
    carried: 5,
    languages: ["Spanish", "English"],
    emoji: "🚣",
  },
  {
    id: "p5",
    handle: "noah",
    name: "Noah",
    age: 15,
    role: "mover",
    from: "Warsaw",
    to: "Auckland",
    school: "Auckland Grammar School",
    country: "New Zealand",
    moveDate: "2026-10-06",
    answers: {
      "Scariest part of your move?": "Being the quiet kid again. I just rebuilt my whole friend group in Warsaw.",
      "One thing you want to do at your new school?": "Find the music room. I play bass and I refuse to stop.",
      "What do you do when you feel alone?": "I learn a song on the bass. If I can play it, the day wasn't wasted.",
      "What's the first thing you'd show a new kid?": "The shortcut behind the gym. It saves you from the worst of the hallways.",
    },
    carried: 1,
    languages: ["Polish", "English", "German"],
    emoji: "🎸",
  },
];

export const anchors: AnchorProfile[] = [
  {
    id: "n1",
    name: "Amara",
    age: 17,
    country: "Canada",
    city: "Toronto",
    yearsLived: 6,
    expertise: ["Winter survival", "School transfers", "Making friends fast"],
    answers: {
      "What should a new kid know?": "November is the hard month, not January. Everyone warns you about January.",
      "Best piece of advice?": "Say yes to the first three invitations, even if they're weird.",
    },
    languages: ["English", "Igbo"],
    emoji: "🍁",
  },
  {
    id: "n2",
    name: "Lucas",
    age: 18,
    country: "Portugal",
    city: "Lisbon",
    yearsLived: 8,
    expertise: ["School system", "Learning Portuguese", "Getting around"],
    answers: {
      "What should a new kid know?": "School starts later here and ends earlier. Your whole rhythm shifts.",
      "Best piece of advice?": "Learn the bus. The bus is freedom.",
    },
    languages: ["Portuguese", "English", "French"],
    emoji: "🌊",
  },
  {
    id: "n3",
    name: "Priya",
    age: 16,
    country: "Netherlands",
    city: "Amsterdam",
    yearsLived: 4,
    expertise: ["Biking", "School culture", "Making friends"],
    answers: {
      "What should a new kid know?": "You will fall off your bike. Everybody does. It's a rite of passage.",
      "Best piece of advice?": "Join a club in week one. Clubs are how you get a life here.",
    },
    languages: ["English", "Dutch (learning)", "Hindi"],
    emoji: "🚲",
  },
  {
    id: "n4",
    name: "Tomas",
    age: 17,
    country: "Australia",
    city: "Melbourne",
    yearsLived: 5,
    expertise: ["School life", "Sports", "Settling in"],
    answers: {
      "What should a new kid know?": "The first two weeks feel long, then suddenly it's your place. Give it two weeks.",
      "Best piece of advice?": "Bring your sport. Whatever you played at home, find it here.",
    },
    languages: ["English", "Spanish"],
    emoji: "🦘",
  },
];

/* ---- Missions (text-based, no voice notes) ---- */

export const missions: Mission[] = [
  {
    id: "m1",
    title: "Send a first hello",
    description:
      "Message your buddy: one thing you're scared of and one thing you're excited about. They'll reply with theirs.",
    done: true,
    kind: "intro",
  },
  {
    id: "m2",
    title: "Language swap",
    description:
      "Teach each other 3 words from your languages. Write them down so you don't forget.",
    done: true,
    kind: "intro",
  },
  {
    id: "m3",
    title: "See the school",
    description:
      "Ask your buddy to describe the school on a video call — cafeteria, hallways, the places people hang out.",
    done: false,
    kind: "intro",
  },
  {
    id: "m4",
    title: "Plan day one",
    description:
      "Pick one thing you'll do together your first week — lunch spot, club, or just where to sit.",
    done: false,
    kind: "landing",
  },
  {
    id: "m5",
    title: "Meet three people",
    description:
      "On your first day, have your buddy introduce you to three people. That's the goal. Three is enough.",
    done: false,
    kind: "landing",
  },
  {
    id: "m6",
    title: "Pay it forward",
    description:
      "Six months after you land, become a buddy for the next kid arriving at your school. The chain continues.",
    done: false,
    kind: "settle",
  },
];

/* ---- Current user (demo session) ---- */

export const currentUser: BuddyProfile = {
  id: "me",
  handle: "you",
  name: "You",
  age: 15,
  role: "mover",
  from: "Cairo",
  to: "Lisbon",
  school: "St. Julian's School",
  country: "Portugal",
  moveDate: "2026-09-02",
  answers: {
    "Scariest part of your move?": "Starting over for the fifth time. I know the feeling, and I'm still scared of it.",
    "One thing you want to do at your new school?": "Find my people and keep them this time.",
    "What do you do when you feel alone?": "I write. Letters to the friends I left behind.",
    "What's the first thing you'd show a new kid?": "Everything I wish someone had shown me.",
  },
  carried: 0,
  languages: ["Arabic", "English"],
  emoji: "🧭",
};
