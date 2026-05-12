// client/src/data/projects.ts

import bouquet1 from '../assets/images/bouquet/7.jpg';
import bouquet2 from '../assets/images/bouquet/2.jpg';
import bouquet3 from '../assets/images/bouquet/3.jpg';
import bouquet4 from '../assets/images/bouquet/1.jpg';
import bouquet5 from '../assets/images/bouquet/6.png';
import bouquet6 from '../assets/images/bouquet/8.jpg';

import popup1 from '../assets/images/bouquet/popups/1.jpg';
import popup2 from '../assets/images/bouquet/popups/4.jpg';
import popup3 from '../assets/images/bouquet/popups/5.jpg';

import mothers1  from '../assets/images/bouquet/mothersday/1.jpg';
import mothers2  from '../assets/images/bouquet/mothersday/2.jpg';
import mothers3  from '../assets/images/bouquet/mothersday/3.jpg';
import mothers4  from '../assets/images/bouquet/mothersday/4.jpg';
import mothers5  from '../assets/images/bouquet/mothersday/5.jpg';
import mothers6  from '../assets/images/bouquet/mothersday/6.jpg';
import mothers7  from '../assets/images/bouquet/mothersday/7.jpg';
import mothers8  from '../assets/images/bouquet/mothersday/8.jpg';
import mothers9  from '../assets/images/bouquet/mothersday/9.jpg';
import mothers10 from '../assets/images/bouquet/mothersday/10.jpg';
import mothers11 from '../assets/images/bouquet/mothersday/11.jpg';
import mothers12 from '../assets/images/bouquet/mothersday/12.jpg';

export type ProjectCategory = 'Custom Bouquet' | 'Pop-Up Event' | 'Pre-Order' | 'Mother\'s Day';

export interface Project {
  id: number;
  image: string;
  title: string;
  category: ProjectCategory;
  description: string;
  price?: string;
  tag?: string; // optional badge e.g. "Limited" | "bestseller"
}

export const projects: Project[] = [
  // ── Custom Bouquets ────────────────────────────────────────────────
  {
    id: 1,
    image: bouquet1,
    title: 'Sunflower Grand Bouquet',
    category: 'Custom Bouquet',
    description: 'A bold arrangement of 12 large sunflowers wrapped in kraft paper — sunshine in your hands.',
  },
  {
    id: 2,
    image: bouquet2,
    title: 'Pink Carnation Bouquet',
    category: 'Custom Bouquet',
    description: 'Soft pink carnations bundled in a dreamy pastel wrap — perfect for birthdays and celebrations.',
  },
  {
    id: 3,
    image: bouquet3,
    title: 'Red Rose Bouquet',
    category: 'Custom Bouquet',
    description: 'Classic long-stem red roses tied with satin ribbon — timeless for anniversaries and love.',
    tag: 'Fan Favorite',
  },
  {
    id: 4,
    image: bouquet4,
    title: 'Sunflower Trio Bouquet',
    category: 'Custom Bouquet',
    description: 'Three cheerful sunflowers wrapped in rustic twine — a sweet and simple everyday gift.',
  },
  {
    id: 5,
    image: bouquet5,
    title: 'Single Sunflower Stem',
    category: 'Custom Bouquet',
    description: 'One perfect sunflower — minimalist, bright, and meaningful for any occasion.',
    tag: 'Bestseller',
  },
  {
    id: 6,
    image: bouquet6,
    title: 'Thumbelina Bouquet',
    category: 'Custom Bouquet',
    description: 'A lush seasonal mix of fresh blooms curated by our florist — always a surprise, always beautiful.',
    tag: 'New',
  },

  // ── Pop-Up Events ──────────────────────────────────────────────────
  {
    id: 7,
    image: popup1,
    title: 'Pop-Up Mini Bouquet Set',
    category: 'Pop-Up Event',
    description: 'Grab-and-go mini bouquets available at our pop-up booths — fresh, affordable, and ready to gift.',
    price: '₱99',
  },
  {
    id: 8,
    image: popup2,
    title: 'Pop-Up Sunflower Bouquet',
    category: 'Pop-Up Event',
    description: 'A fuller mini bouquet set with seasonal blooms, ideal for events and pasalubong.',
    price: '₱150',
  },
  {
    id: 9,
    image: popup3,
    title: 'Pop-Up Bulk Bouquet Pack',
    category: 'Pop-Up Event',
    description: 'Sets of mini bouquets perfect for giveaways, debut booths, and school events.',
    price: '₱99 – ₱150',
    tag: 'Bulk Available',
  },

  // ── Mother's Day Pre-Orders ────────────────────────────────────────
  {
    id: 10,
    image: mothers1,
    title: "Mother's Day Bouquet No. 1",
    category: "Mother's Day",
    description: "A warm and tender arrangement crafted specially for Mom — blooms that say everything words can't.",
    tag: 'Limited',
  },
  {
    id: 11,
    image: mothers2,
    title: "Mother's Day Bouquet No. 2",
    category: "Mother's Day",
    description: 'Soft pastel blooms wrapped in love — a heartfelt pre-order gift for the best mom.',
    tag: 'Limited',
  },
  {
    id: 12,
    image: mothers3,
    title: "Mother's Day Bouquet No. 3",
    category: "Mother's Day",
    description: 'Pink and white florals in an elegant wrap — timeless and sweet for Mother\'s Day.',
    tag: 'Limited',
  },
  {
    id: 13,
    image: mothers4,
    title: "Mother's Day Bouquet No. 4",
    category: "Mother's Day",
    description: 'A vibrant mixed bouquet bursting with color — show Mom she deserves the brightest blooms.',
    tag: 'Limited',
  },
  {
    id: 14,
    image: mothers5,
    title: "Mother's Day Bouquet No. 5",
    category: "Mother's Day",
    description: 'Delicate blooms in muted tones — elegant, refined, and made for a special mama.',
    tag: 'Limited',
  },
  {
    id: 15,
    image: mothers6,
    title: "Mother's Day Bouquet No. 6",
    category: "Mother's Day",
    description: 'A full, lush arrangement of seasonal flowers — generous and gorgeous for the queen of the family.',
    tag: 'Limited',
  },
  {
    id: 16,
    image: mothers7,
    title: "Mother's Day Bouquet No. 7",
    category: "Mother's Day",
    description: 'Wrapped in kraft and ribbon — a rustic-romantic bouquet your mom will absolutely adore.',
    tag: 'Limited',
  },
  {
    id: 17,
    image: mothers8,
    title: "Mother's Day Bouquet No. 8",
    category: "Mother's Day",
    description: 'Light and airy florals with eucalyptus accents — fresh, fragrant, and full of love.',
    tag: 'Limited',
  },
  {
    id: 18,
    image: mothers9,
    title: "Mother's Day Bouquet No. 9",
    category: "Mother's Day",
    description: 'A pastel rainbow of blooms — joyful, playful, and perfect for the fun-loving mom.',
    tag: 'Limited',
  },
  {
    id: 19,
    image: mothers10,
    title: "Mother's Day Bouquet No. 10",
    category: "Mother's Day",
    description: 'Classic roses and fillers in a sleek wrap — simple, stunning, and straight from the heart.',
    tag: 'Limited',
  },
  {
    id: 20,
    image: mothers11,
    title: "Mother's Day Bouquet No. 11",
    category: "Mother's Day",
    description: 'An elegant hand-tied bouquet featuring premium blooms — for the mom who deserves nothing less.',
    tag: 'Limited',
  },
  {
    id: 21,
    image: mothers12,
    title: "Mother's Day Bouquet No. 12",
    category: "Mother's Day",
    description: 'Our grandest Mother\'s Day arrangement — a statement bouquet that makes the moment unforgettable.',
    tag: 'Limited',
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Custom Bouquet',
  'Pop-Up Event',
  'Pre-Order',
  "Mother's Day",
];