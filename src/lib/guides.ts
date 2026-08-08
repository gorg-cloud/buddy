/**
 * Country guides — the things you actually want to know when you land:
 * good places to go, how people your age make friends, and the unwritten
 * rules. Curated for the biggest destinations; every other country gets
 * an honest starter guide and a pointer to the kid who's living it right
 * now (your buddy / the community room).
 */

export interface Guide {
  country: string;
  code: string;
  curated: boolean;
  tagline: string;
  places: { name: string; note: string }[];
  meet: string[];
  know: string[];
}

type Curated = Omit<Guide, "code" | "curated"> & { country: string };

const CURATED: Curated[] = [
  {
    country: "United Arab Emirates",
    tagline: "A country that grew up in one generation — new kids land here every week, so nobody stays the new one for long.",
    places: [
      { name: "Dubai Mall", note: "The aquarium, the fountain, the skate spots — the classic first-weekend meetup point." },
      { name: "The Corniche, Abu Dhabi", note: "Long waterfront where everyone walks, cycles and hangs out after school." },
      { name: "Global Village", note: "Pavilions from dozens of countries — perfect when you're homesick for one of them." },
    ],
    meet: [
      "International schools here are built for movers — half your class has moved at least once. Lead with where you're from; it's a conversation starter, not a label.",
      "Weekends are Friday–Saturday. Friday prayers mean a slow morning, then everything opens up.",
      "Football (soccer), cricket and basketball clubs are the fastest way in — sign up in your first week.",
    ],
    know: [
      "It's hot. Like, actually hot. Carry water and a jumper for the air conditioning — it's arctic indoors.",
      "Dress modestly in public — shoulders and knees covered is the safe default until you know your school's vibe.",
      "Ramadan means shorter school days and no eating in public during daylight. Everyone adjusts together.",
    ],
  },
  {
    country: "United Kingdom",
    tagline: "Small country, massive school culture — your school is the centre of your social world.",
    places: [
      { name: "The city centre", note: "Every UK town has one — buses, shops, food courts. It's where everyone goes on Saturday." },
      { name: "A local park or common", note: "Football goals, basketball courts, people hanging out after school. Free and always busy." },
      { name: "The chippy / chicken shop", note: "The after-school ritual. Your first 'proper' British food experience." },
    ],
    meet: [
      "Join a club or a sports team in week one — school is the whole social scene here, and clubs are how you get invited to things.",
      "People are polite but reserved at first. It's not rejection, it's British — give it a few weeks and the walls come down.",
      "Football loyalty is serious. Pick a team (or claim you don't care) before someone asks.",
    ],
    know: [
      "Learn the slang fast: 'mate', 'alright?', 'cheers', 'taking the mick'. Using it right makes you instantly less 'the new kid'.",
      "School starts around 8:30 and there are usually lessons on Saturdays for sports — check your school's timetable.",
      "The weather is grey and it rains a lot. Buy a proper waterproof; everyone here owns one.",
    ],
  },
  {
    country: "United States",
    tagline: "Huge, loud, and obsessed with school spirit — high school here is its own world with its own rules.",
    places: [
      { name: "The mall", note: "Still the hangout. Food court, movies, arcade — the default weekend plan." },
      { name: "School games and pep rallies", note: "Football on Fridays, basketball in winter. Going is how you become part of the school." },
      { name: "A local diner or coffee shop", note: "The post-game / post-practice spot where actual talking happens." },
    ],
    meet: [
      "Try out for a sport or join a club in the first two weeks — it's the single fastest way to a friend group.",
      "School spirit is real here. Wear the colours, go to the games, learn the chants. It works.",
      "People are friendly fast — they'll say hi in the hallways. That's normal. Say hi back.",
    ],
    know: [
      "Everything is far apart. Learn how your school handles transport (bus, carpool, parents) early.",
      "Sports seasons rule the calendar — homecoming, prom, game days. Ask what's coming up so you're not blindsided.",
      "Lunch is a social minefield for the first week — ask your buddy where to sit; they've been through it.",
    ],
  },
  {
    country: "Canada",
    tagline: "Friendly on purpose. 'Sorry' is a reflex and so is making sure the new kid is okay.",
    places: [
      { name: "The community centre", note: "Rinks, pools, gyms — free or cheap, and full of people your age after school." },
      { name: "A Tim Hortons", note: "The national meeting point. If in doubt, 'meet at Tims' is a complete sentence." },
      { name: "The park in winter", note: "Skating ponds, tobogganing hills — winter is a sport here, not a punishment." },
    ],
    meet: [
      "Ask about hockey. Even if you don't play, caring about it unlocks half the conversations in the country.",
      "Clubs and teams meet at school, but community rec leagues are where you'll meet kids from other schools too.",
      "Canadians are polite — but polite doesn't mean instant friends. Be the one who invites, not the one who waits.",
    ],
    know: [
      "Winter is real: -20°C and darker at 4pm. Get a real jacket, not a fashion one.",
      "The school year runs September to June, with a two-week break in March called 'March break'.",
      "'Eh' is real but subtle. Don't force it. 'Toque' means beanie, 'washroom' means bathroom.",
    ],
  },
  {
    country: "Australia",
    tagline: "Sun, sport and schoolies culture — being outdoors is the default setting.",
    places: [
      { name: "The beach", note: "Even inland towns have a 'beach day' culture. Sunscreen, footy, and fish and chips." },
      { name: "The local oval", note: "Cricket in summer, footy in winter — the oval is the social centre of every suburb." },
      { name: "The shopping centre food court", note: "Air-conditioned, cheap, and where everyone actually ends up on a hot Saturday." },
    ],
    meet: [
      "Play or watch footy (AFL or rugby — know which one your state plays). It's the fastest shortcut to mates.",
      "Australian banter is brutal and loving. If they're teasing you, you've been accepted.",
      "Surfing, swimming or just tanning — the beach is where friendships get made in summer.",
    ],
    know: [
      "The sun will burn you. 'Slip, slop, slap' is a national slogan for a reason — sunscreen every single day.",
      "School uniform is the law here, and it's a big deal. Get the right one before your first day.",
      "The school year runs late January to December, so 'summer holidays' are Christmas holidays.",
    ],
  },
  {
    country: "Spain",
    tagline: "Life happens late and in public — dinner at 10pm, friends in the square, everything outside.",
    places: [
      { name: "The plaza / town square", note: "Where everyone congregates after school. Sit, and people will talk to you." },
      { name: "Churrería", note: "Chocolate and churros after school. Cheap, warm, and a social ritual." },
      { name: "The sports complex", note: "Football and basketball courts that stay busy until late — join a game." },
    ],
    meet: [
      "Learn to ask '¿Dónde quedamos?' (where are we meeting?) — hanging out is a group activity, not one-on-one.",
      "People are warm and loud. They'll touch your arm, hug hello, stand close. It's normal, not weird.",
      "Most socialising happens outside — the street, the square, the park. Follow the noise.",
    ],
    know: [
      "Mealtimes are late: lunch around 2–3pm, dinner at 9–10pm. School lunch is the big meal of the day.",
      "Siesta is real but not for school kids — you'll have a long lunch break instead of a short one.",
      "Language: even a few words of Spanish changes everything. People appreciate the effort massively.",
    ],
  },
  {
    country: "France",
    tagline: "School is serious and social life is separate — you'll need both to settle in.",
    places: [
      { name: "Le kebab / boulangerie at lunch", note: "The classic school-break hangout — cheap food, big groups." },
      { name: "The park or the riverbank", note: "Where kids gather after school in good weather. Bring a ball." },
      { name: "The cinema club", note: "French kids love film — a cinema trip is a standard group plan." },
    ],
    meet: [
      "Friendships here start slower and mean more. Don't read the first cold weeks as rejection — you're being assessed.",
      "The school canteen (la cantine) is a big deal — that's where friend groups form. Eat there, don't skip it.",
      "Football is the universal language. Join the pickup games at lunch and you're in.",
    ],
    know: [
      "The French are formal at first — say 'bonjour' before anything else, always. Skipping it reads as rude.",
      "School runs Monday–Friday with a Wednesday half-day (or Wednesday off) for many schools.",
      "Speaking French matters here, even at international schools. Make the effort; it's respected.",
    ],
  },
  {
    country: "Germany",
    tagline: "Orderly on the surface, fiercely loyal underneath — give it time and you'll have friends for life.",
    places: [
      { name: "The youth centre (Jugendzentrum)", note: "Every town has one — table tennis, football, just hanging out. Free." },
      { name: "The swimming pool / Bad", note: "A standard weekend trip. Indoor pools are open all year." },
      { name: "The Kiosk / Späti", note: "The corner shop where kids gather for snacks and drinks after school." },
    ],
    meet: [
      "Germans are direct — they'll tell you what they think, which feels blunt until you realise it's honesty.",
      "Clubs (Vereine) are sacred: sports, music, chess — joining one is the official way to make friends.",
      "Don't be discouraged by the quiet start. 'Freundschaften' here are built slowly and last decades.",
    ],
    know: [
      "School often finishes early (1–2pm) — the afternoon is for clubs and sports, not homework marathons.",
      "There are strict quiet hours (usually after 10pm) — no noise that could disturb neighbours.",
      "Cash is still king in lots of places. Carry some euros even if you usually pay by phone.",
    ],
  },
  {
    country: "Netherlands",
    tagline: "Everyone bikes everywhere and says exactly what they mean — the friendliest honest country on earth.",
    places: [
      { name: "The bike routes", note: "Half of social life happens on two wheels — rides to school, to town, to friends' houses." },
      { name: "The park (het park)", note: "Pickup football, picnics, hanging by the water. Always someone around." },
      { name: "The kebab shop / snackbar", note: "The after-school institution — frikandel, kroket, and talking nonsense." },
    ],
    meet: [
      "Learn to bike properly and lock it well — it's not optional, it's how you'll get everywhere.",
      "The Dutch are direct: 'no' means no and 'that's not good' means exactly that. It's not rudeness, it's efficiency.",
      "Everyone speaks English, but learning Dutch sentences will delight people more than you can imagine.",
    ],
    know: [
      "You'll be expected to be independent — cycling to school alone at 13 is normal and fine.",
      "Birthdays mean you bring cake to school (trakteren) — ask your buddy for the full protocol.",
      "Weather is grey and windy a lot. The Dutch say 'if you don't like the weather, wait five minutes'.",
    ],
  },
  {
    country: "Singapore",
    tagline: "Tiny, safe, and unbelievably organised — an easy place to live and an intense place to study.",
    places: [
      { name: "The hawker centre", note: "The national dining room — $3 meals, hundreds of stalls, everyone eats here." },
      { name: "East Coast Park", note: "Cycling, rollerblading, BBQ pits — the weekend escape from the city." },
      { name: "Sentosa / the beaches", note: "The classic birthday and post-exam hangout destination." },
    ],
    meet: [
      "CCA (co-curricular activity) is compulsory in school and is THE way friendships form — pick one you actually love.",
      "Food is the national conversation. Ask people where they eat, try everything, compare notes.",
      "The weather is always hot — hangout plans are indoor malls or outdoor parks, rarely in between.",
    ],
    know: [
      "Chewing gum is banned (except medical), and there are fines for littering and eating on the MRT. Keep it clean.",
      "School is intense — grades matter and pressure is real. Your buddy gets it; that's what they're for.",
      "Singlish is a real language of its own ('lah', 'can or not?'). Learn it to fit in, but keep proper English for school.",
    ],
  },
  {
    country: "India",
    tagline: "Loud, crowded, and incredibly warm — you'll be invited to more things in a month than in a year elsewhere.",
    places: [
      { name: "The school canteen", note: "The social hub — samosas, chai, and the fastest way to know everyone." },
      { name: "The local mall / multiplex", note: "Where groups go for movies, food courts, and air conditioning." },
      { name: "The cricket ground / maidan", note: "Pickup cricket happens everywhere — join any game, you're welcome." },
    ],
    meet: [
      "Cricket is the national glue. Even knowing the basics ('sixer!', 'not out!') gets you into conversations.",
      "Indian families are all-in: once you're a friend, you're invited to birthdays, festivals, dinners. Say yes to everything early on.",
      "People will ask personal questions (family, marks, why you moved) — it's warmth, not nosiness.",
    ],
    know: [
      "Festivals matter: Diwali, Holi, Eid, Pongal — every season has one, and each one is a social event.",
      "The food is spicy and the tap water is not drinkable. Carry a bottle, start mild.",
      "Respect for teachers and elders is formal — 'sir' and 'ma'am' are expected in school.",
    ],
  },
  {
    country: "Portugal",
    tagline: "Sun, football, and pastel de nata — a small country that knows how to live slowly and warmly.",
    places: [
      { name: "The beach", note: "Surf culture is huge — even beginners get lessons and a crew fast." },
      { name: "The pastelaria", note: "Coffee, pastries, and the social ritual of just sitting and talking." },
      { name: "The local sports club", note: "Football, basketball, and the school-adjacent teams everyone joins." },
    ],
    meet: [
      "Learn to say 'desculpa' (sorry) and 'obrigado' (thanks) — basic politeness opens doors here instantly.",
      "Portuguese kids are warm and touchy — hugs and cheek kisses are standard greetings with friends.",
      "Football (futebol) is the conversation starter. Pick Benfica, Porto or Sporting — asking 'which one?' is the icebreaker.",
    ],
    know: [
      "Everything happens later than you'd expect — dinner at 8–9pm, parties starting at 11pm.",
      "The sun is intense and the heat in summer is real. Water, shade, and sunscreen.",
      "English is widely spoken in schools, but Portuguese effort is deeply appreciated.",
    ],
  },
  {
    country: "Qatar",
    tagline: "A desert country of movers — in Doha, almost everyone you meet has also arrived from somewhere else.",
    places: [
      { name: "The Corniche", note: "The waterfront promenade where everyone walks, cycles, and watches the skyline at night." },
      { name: "Katara Cultural Village", note: "Beach, restaurants, and weekend events — the classic family and friends hangout." },
      { name: "The Pearl / the malls", note: "Air-conditioned everything. Malls are social centres, not just shops." },
    ],
    meet: [
      "International schools here are full of third-culture kids — you'll fit in faster than almost anywhere on earth.",
      "Weekend is Friday–Saturday, and the week's rhythm revolves around it.",
      "Cricket, football, and basketball leagues run at schools and academies — join in week one.",
    ],
    know: [
      "It's very hot for much of the year — outdoor plans happen after sunset in summer.",
      "Dress modestly in public and respect Ramadan (no eating/drinking in public during daylight hours).",
      "The driving culture is intense and public transport is still growing — school buses and parents are the norm.",
    ],
  },
  {
    country: "Saudi Arabia",
    tagline: "A country changing faster than almost any other — new international schools, new freedoms, new kids arriving weekly.",
    places: [
      { name: "The Corniche / waterfront", note: "The evening hangout in Jeddah and Dammam — walks, food trucks, families, friends." },
      { name: "The Boulevard", note: "Riyadh's social heart — restaurants, events, and where everyone goes on the weekend." },
      { name: "The malls", note: "Air-conditioned and always busy — a standard group plan in the heat." },
    ],
    meet: [
      "The international school scene is the whole social world — clubs, sports, and events are how you'll meet people.",
      "Many families are movers too. Asking 'where are you from originally?' is normal and welcome.",
      "Football is huge — Al-Hilal, Al-Nassr and the Saudi league are genuine conversation territory.",
    ],
    know: [
      "Weekends are Friday–Saturday. Friday prayers pause the morning; life restarts after.",
      "Modesty matters in public — covered shoulders and knees are the safe default.",
      "Ramadan changes the whole day: shorter school days, no public eating during daylight. Everyone adapts together.",
    ],
  },
  {
    country: "Egypt",
    tagline: "Five thousand years of history and the loudest, warmest, most welcoming people you'll ever meet.",
    places: [
      { name: "The Nile Corniche", note: "The classic evening walk — feluccas, street food, and the whole city out and about." },
      { name: "Zamalek / Maadi", note: "The neighbourhoods where everyone hangs out — cafes, clubs, and bookshops." },
      { name: "The sports club", note: "Clubs like Al Ahly and Zamalek are social institutions — football, swimming, everything." },
    ],
    meet: [
      "Egyptians are famously welcoming — you'll be invited to people's homes within weeks. Say yes.",
      "Football is life. Pick a side (Ahly or Zamalek) and defend it loudly — it's the national sport and argument.",
      "People will be curious about you — expect questions and attention. It's hospitality, not intrusion.",
    ],
    know: [
      "Arabic greetings matter: 'Salam alaikum', 'izzayak?' — a few phrases change how people treat you.",
      "The pace of life is relaxed and plans are flexible. '5 minutes' can mean an hour. Go with it.",
      "Traffic is intense and crossing the street is an art — watch how locals do it first.",
    ],
  },
  {
    country: "Japan",
    tagline: "Orderly, kind, and deeply different — the hardest first month, the most rewarding first year.",
    places: [
      { name: "The school club (bukatsu)", note: "Clubs are compulsory-ish and daily — it's where ALL friendships happen." },
      { name: "The konbini (convenience store)", note: "The after-school meeting point. Onigiri, snacks, and standing around talking." },
      { name: "The local park or shrine", note: "Where kids gather on weekends — football, baseball, or just hanging." },
    ],
    meet: [
      "Join a club and attend EVERY practice. Consistency is how trust is built in Japan — showing up is the whole thing.",
      "Learn the basics: bowing, 'arigatou', and never refusing food someone offers. Small courtesies are huge here.",
      "People won't approach you first. YOU have to take the first step — they'll be relieved you did.",
    ],
    know: [
      "Rules are followed strictly — uniforms, shoes, cleaning duties (yes, students clean the school). Just do it.",
      "The school year starts in April. If you arrive mid-year, ask your buddy to brief you on what you missed.",
      "Silence and indirectness are normal. 'That might be difficult' usually means no. Read between the lines.",
    ],
  },
  {
    country: "South Korea",
    tagline: "Fast, digital, and study-driven — but the friendships you make here are fierce and forever.",
    places: [
      { name: "PC bang (internet cafe)", note: "The after-school ritual — gaming, snacks, and hanging out. Extremely normal." },
      { name: "The convenience store", note: "Ramen, snacks, and the corner where groups gather between plans." },
      { name: "The baseball stadium", note: "KBO games are loud, fun, and a standard group outing." },
    ],
    meet: [
      "School is intense (hagwon/private academies after school) — friendships often happen in short bursts between commitments.",
      "K-pop and gaming are the shared language. Knowing a few groups or games unlocks conversations instantly.",
      "Respect for seniors (sunbae) is a real rule — be polite to older students, they'll look out for you.",
    ],
    know: [
      "The school year starts in March, and 'hell week' exam seasons (especially in high school) are serious.",
      "Use the right honorifics: 'oppa/unnie' for older, 'dongsaeng' for younger. Getting it right earns instant respect.",
      "Meals are shared — don't start eating before elders do, and never stick chopsticks upright in rice.",
    ],
  },
  {
    country: "Italy",
    tagline: "Loud lunches, long summers, and friends who'll feed you — la dolce vita is real at school too.",
    places: [
      { name: "The piazza", note: "Every town's living room — where everyone gathers after school and on weekends." },
      { name: "The gelateria", note: "The after-school ritual. Gelato is not ice cream and this is not a debate." },
      { name: "The oratorio / sports centre", note: "Where local kids play football and hang out — you don't need to be religious to join." },
    ],
    meet: [
      "Football (calcio) is everything. Even casual knowledge gets you into the group instantly.",
      "Italians are loud, expressive, and physical — hand gestures are part of the language. Don't be startled.",
      "Food is love: accept every offer of food and compliment everything you eat. It's the social currency.",
    ],
    know: [
      "Lunch is the big meal and the family/social event. School lunch culture is strong — don't skip it.",
      "The summer break is enormous (June–September) — plan for what you'll do, or you'll be bored.",
      "Say 'buongiorno' when you walk into a room. It's expected, and skipping it reads as rude.",
    ],
  },
  {
    country: "Switzerland",
    tagline: "Quiet, beautiful, and punctual — friendships here are earned slowly and kept forever.",
    places: [
      { name: "The outdoor pool (Freibad)", note: "The summer institution — every town has one, and everyone goes." },
      { name: "The youth centre", note: "Table tennis, football, music — the after-school hangout that's free." },
      { name: "The mountains / the lake", note: "Weekend trips are a way of life — hiking, swimming, sledging in winter." },
    ],
    meet: [
      "Join a Verein (club) — Swiss social life runs through clubs: sports, music, theatre, everything.",
      "Swiss people are reserved at first and deeply loyal later. The slow start is normal; don't push.",
      "Punctuality is a sign of respect. Being late is genuinely rude here. Be early.",
    ],
    know: [
      "There are four languages (German, French, Italian, Romansh) — which one you need depends entirely on the canton.",
      "School often ends early afternoon — afternoons are for clubs, homework, and outdoor time.",
      "It's expensive. School lunch and clubs cost more than you expect — check with your parents early.",
    ],
  },
  {
    country: "Ireland",
    tagline: "The friendliest country on earth — you'll be called 'grand' and welcomed within a day.",
    places: [
      { name: "The town centre", note: "Every Irish town revolves around its main street — shops, cafes, and meeting points." },
      { name: "The GAA pitch", note: "Hurling and Gaelic football are the national sports — games are huge social events." },
      { name: "The local café / chipper", note: "The after-school and Saturday spot for chips and conversation." },
    ],
    meet: [
      "Ask about the GAA (Gaelic Athletic Association) — hurling and Gaelic football are the fastest conversation openers in the country.",
      "Irish friendliness is real: strangers will chat to you. Chat back — that's how it works here.",
      "Joining a local sports club connects you to the whole community, not just school.",
    ],
    know: [
      "The accent and slang will confuse you for a month ('craic' means fun, 'grand' means fine, 'feck' is not a swear).",
      "The rain is constant and soft — a good raincoat is essential gear, not an option.",
      "School uniform is standard, and school is usually single-sex or co-ed depending on where you land.",
    ],
  },
];

const FALLBACK_MEET = [
  "Ask your buddy — they're living there right now and know the school better than any guide.",
  "Join a club or sports team in your first week. Clubs are where new kids become part of things everywhere.",
  "Learn the basics of the local language — even ten words changes how people treat you.",
  "Ask about the local sport. Every country has one that everyone talks about. Find it, care about it.",
];

const FALLBACK_KNOW = [
  "Check the school year — it starts at different times around the world (Jan, Mar, Apr, Aug, Sep).",
  "Ask your buddy about the unwritten rules: uniforms, lunch culture, transport, what not to wear.",
  "The first month is the hardest everywhere. It gets better — it always does.",
];

/** Curated guides keyed by country name. */
const curatedByName = new Map<string, Curated>(
  CURATED.map((g) => [g.country.toLowerCase(), g])
);

/**
 * The guide for a country. Curated content for the biggest destinations;
 * an honest starter guide (no invented facts) for everywhere else — the
 * real detail comes from the kid who's there, which is the whole point.
 */
export function getGuide(countryName: string, code: string): Guide {
  const curated = curatedByName.get(countryName.toLowerCase());
  if (curated) {
    return { ...curated, code, curated: true };
  }
  return {
    country: countryName,
    code,
    curated: false,
    tagline: `Nobody has written the guide for ${countryName} yet — so the real intel comes from the kid who's living it right now.`,
    places: [],
    meet: FALLBACK_MEET,
    know: FALLBACK_KNOW,
  };
}
