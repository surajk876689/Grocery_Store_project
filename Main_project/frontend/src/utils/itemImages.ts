// Unsplash Search API — one unique real photo per item, cached in memory.
// The access key is public/read-only by design (safe in frontend).

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;

// In-memory cache: item name → photo URL
const cache = new Map<string, string>();

// Track which photo IDs have been used so no photo repeats
const usedIds = new Set<string>();

const FALLBACK = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&auto=format&q=80';

// Specific search queries per item for best results
const SEARCH_QUERIES: Record<string, string> = {
  'apple': 'red apple fruit',
  'banana': 'banana yellow fruit',
  'mango': 'mango tropical fruit',
  'orange': 'orange citrus fruit',
  'grapes': 'grapes bunch purple',
  'watermelon': 'watermelon slice',
  'papaya': 'papaya tropical fruit',
  'pineapple': 'pineapple fruit',
  'strawberry': 'strawberry red berry',
  'pomegranate': 'pomegranate fruit',
  'guava': 'guava green fruit',
  'kiwi': 'kiwi fruit sliced',
  'lychee': 'lychee fruit',
  'pear': 'pear fruit',
  'plum': 'plum purple fruit',
  'tomato': 'tomato red vegetable',
  'potato': 'potato vegetable',
  'onion': 'onion vegetable',
  'carrot': 'carrot orange vegetable',
  'spinach': 'spinach green leaves',
  'cauliflower': 'cauliflower vegetable',
  'broccoli': 'broccoli green',
  'capsicum': 'bell pepper capsicum',
  'cucumber': 'cucumber green',
  'eggplant': 'eggplant aubergine',
  'peas': 'green peas',
  'beans': 'green beans',
  'cabbage': 'cabbage vegetable',
  'bitter gourd': 'bitter gourd karela',
  'bottle gourd': 'bottle gourd lauki',
  'pumpkin': 'pumpkin orange',
  'radish': 'radish white root',
  'beetroot': 'beetroot red',
  'sweet corn': 'sweet corn yellow',
  'garlic': 'garlic cloves',
  'ginger': 'ginger root',
  'green chilli': 'green chilli pepper',
  'coriander': 'coriander herb fresh',
  'mint': 'mint leaves herb',
  'curry leaves': 'curry leaves',
  'milk': 'milk white glass',
  'butter': 'butter dairy yellow',
  'paneer': 'paneer cheese indian',
  'curd': 'yogurt curd bowl',
  'cheese': 'cheese block dairy',
  'ghee': 'ghee clarified butter',
  'cream': 'cream dairy white',
  'buttermilk': 'buttermilk drink',
  'condensed milk': 'condensed milk sweet',
  'skimmed milk powder': 'milk powder white',
  'basmati rice': 'basmati rice grains',
  'wheat flour': 'wheat flour white',
  'toor dal': 'toor dal lentils yellow',
  'moong dal': 'moong dal green lentils',
  'chana dal': 'chana dal chickpea',
  'urad dal': 'urad dal black lentils',
  'rajma': 'rajma kidney beans',
  'chickpeas': 'chickpeas garbanzo',
  'oats': 'oats rolled breakfast',
  'semolina': 'semolina rava grain',
  'poha': 'poha flattened rice',
  'vermicelli': 'vermicelli noodles thin',
  'sago': 'sago tapioca pearls',
  'cornflour': 'cornflour starch',
  'barley': 'barley grain cereal',
  'turmeric powder': 'turmeric powder yellow',
  'red chilli powder': 'red chilli powder spice',
  'coriander powder': 'coriander powder spice',
  'cumin seeds': 'cumin seeds spice',
  'mustard seeds': 'mustard seeds spice',
  'garam masala': 'garam masala spice',
  'black pepper': 'black pepper corns',
  'cardamom': 'cardamom pods green',
  'cloves': 'cloves dried spice',
  'cinnamon': 'cinnamon sticks',
  'bay leaves': 'bay leaves dried',
  'fenugreek seeds': 'fenugreek seeds methi',
  'asafoetida': 'asafoetida hing spice',
  'salt': 'salt white crystals',
  'sugar': 'sugar white granules',
  'sunflower oil': 'sunflower oil bottle',
  'coconut oil': 'coconut oil jar',
  'mustard oil': 'mustard oil bottle',
  'olive oil': 'olive oil bottle',
  'tea powder': 'tea leaves black',
  'coffee powder': 'coffee ground dark',
  'green tea': 'green tea bags',
  'honey': 'honey golden jar',
  'bread': 'bread loaf bakery',
  'biscuits': 'biscuits cookies',
  'namkeen': 'namkeen indian snack',
  'popcorn': 'popcorn bowl snack',
  'chips': 'potato chips crispy',
  'noodles': 'noodles instant bowl',
  'pasta': 'pasta dry italian',
  'jam': 'fruit jam jar',
  'peanut butter': 'peanut butter jar',
  'chocolate': 'chocolate bar dark',
};

function getSearchQuery(name: string): string {
  const lower = name.toLowerCase().trim();
  // Strip units like "(1kg)", "(500g)", "(1l)" etc.
  const base = lower.replace(/\s*\(.*?\)/g, '').trim();

  if (SEARCH_QUERIES[base]) return SEARCH_QUERIES[base];
  if (SEARCH_QUERIES[lower]) return SEARCH_QUERIES[lower];

  // Partial match
  const key = Object.keys(SEARCH_QUERIES).find((k) => base.includes(k) || lower.includes(k));
  return key ? SEARCH_QUERIES[key] : `${name} food grocery`;
}

// Fetch a unique photo from Unsplash for this item
async function fetchUnsplashPhoto(name: string, size: number): Promise<string> {
  const query = getSearchQuery(name);
  // Use page offset based on how many photos already used to avoid repeats
  const page = Math.floor(usedIds.size / 10) + 1;

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=squarish&client_id=${ACCESS_KEY}`;

  const res = await fetch(url);
  if (!res.ok) return FALLBACK;

  const data = await res.json();
  const results: Array<{ id: string; urls: { small: string; thumb: string } }> = data.results ?? [];

  // Pick the first result whose ID hasn't been used yet
  const photo = results.find((r) => !usedIds.has(r.id));
  if (!photo) return FALLBACK;

  usedIds.add(photo.id);
  // Use thumb for small sizes, small for larger
  const rawUrl = size <= 48 ? photo.urls.thumb : photo.urls.small;
  return rawUrl;
}

// Sync getter — returns cached URL or a placeholder while loading
export function getItemImageUrl(name: string, size = 80): string {
  const key = `${name}__${size}`;
  return cache.get(key) ?? FALLBACK;
}

// Async loader — call this to populate the cache
export async function loadItemImage(name: string, size = 80): Promise<string> {
  const key = `${name}__${size}`;
  if (cache.has(key)) return cache.get(key)!;

  const url = await fetchUnsplashPhoto(name, size);
  cache.set(key, url);
  return url;
}
