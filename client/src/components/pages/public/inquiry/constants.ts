// client/src/components/pages/public/inquiry/constants.ts
import { Flower2, Calendar, Truck, User, CheckCircle } from 'lucide-react';

export const OCCASIONS = [
  { id: 'birthday',    label: 'Birthday',     icon: '🎂' },
  { id: 'graduation',  label: 'Graduation',   icon: '🎓' },
  { id: 'monthsary',   label: 'Monthsary',    icon: '🗓️' },
  { id: 'anniversary', label: 'Anniversary',  icon: '💍' },
  { id: 'sympathy',    label: 'Sympathy',     icon: '🕊️' },
  { id: 'valentine',   label: "Valentine's",  icon: '💝' },
  { id: 'justbecause', label: 'Just Because', icon: '🌷' },
  { id: 'custom',      label: 'Custom',       icon: '✨' },
];

export const BOUQUET_TYPES = [
  {
    id: 'mini', label: 'Mini Bouquets', range: 'starts at ₱99',
    desc: 'Mini Flower Bouquet ₱99 · Mini Sunflower Bouquet ₱150',
    items: ['Mini Flower Bouquet — ₱99', 'Mini Sunflower Bouquet — ₱150'],
  },
  {
    id: 'premium-mini', label: 'Premium Mini', range: 'starts at ₱300',
    desc: 'Mini Thumbelina · Single Sunflower · Single Stargazer Lily',
    items: ['Mini Thumbelina Bouquet — starts at ₱300', 'Single Sunflower Bouquet — starts at ₱450', 'Single Stargazer Lily Bouquet — starts at ₱300'],
  },
  {
    id: 'signature', label: 'Signature', range: 'starts at ₱800',
    desc: 'Carnation · Thumbelina · Sunflower · Grand · Red Rose',
    items: ['Carnation Bouquet — starts at ₱800', 'Thumbelina Bouquet — starts at ₱900', '3 Sunflower Bouquet — starts at ₱800', 'Grand Bouquet — starts at ₱1,300+', 'Red Rose Bouquet — starts at ₱1,000+'],
  },
  {
    id: 'custom', label: 'Custom Bouquet', range: 'Price varies',
    desc: "Tell us your dream bouquet — we'll make it happen.",
    items: [],
  },
];

export const BUDGET_OPTIONS = [
  '₱99–₱200', '₱300–₱500', '₱500–₱900', '₱1,000–₱1,500', '₱1,500+', 'Flexible / Open',
];

export const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', 'Custom'];

export const PICKUP_LOCATIONS = [
  { id: 'krav', label: 'Krav Coffee',  desc: 'Sta. Rosa, Laguna' },
  { id: 'dali', label: 'DALI',         desc: 'Brgy. Labas, Sta. Rosa City, Laguna' },
];

export const ADD_ONS = [
  'Ribbon (custom color)', 'Chocolate', 'LED Lights', 'Message Card',
  'Dried Flowers', "Baby's Breath", 'Raffia Wrap',
];

export const SHOP_ADDRESS = 'Barangay Labas, Sta. Rosa City, Laguna, Philippines';
export const SHOP_COORDS  = '14.309361, 121.109694';
export const MAPS_EMBED   = 'https://www.google.com/maps?q=14.309361,121.109694&output=embed';

export const DRAFT_KEY = 'btb_inquiry_draft';

export const STEPS = [
  { label: 'Bouquets', icon: Flower2     },
  { label: 'Schedule', icon: Calendar    },
  { label: 'Delivery', icon: Truck       },
  { label: 'Details',  icon: User        },
  { label: 'Review',   icon: CheckCircle },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BouquetItem {
  bouquetType: string;
  bouquetItem: string;
  bouquetName: string;
  occasion: string;
  details: string;
  addOns: string[];
  preferredBudget: string;
  pegImage: File | null;
  pegPreview: string;
}

export interface FormData {
  bouquets: BouquetItem[];
  targetDate: string;
  targetTime: string;
  customTime: string;
  fulfillment: 'pickup' | 'delivery' | '';
  pickupLocation: string;
  deliveryAddress: string;
  deliveryLandmark: string;
  receiverName: string;
  receiverContact: string;
  deliveryBooker: 'customer' | 'us' | '';
  customerName: string;
  customerContact: string;
  customerSocial: string;
}

export const EMPTY_BOUQUET: BouquetItem = {
  bouquetType: '', bouquetItem: '', bouquetName: '',
  occasion: '', details: '', addOns: [], preferredBudget: '',
  pegImage: null, pegPreview: '',
};

export const EMPTY: FormData = {
  bouquets: [{ ...EMPTY_BOUQUET }],
  targetDate: '', targetTime: '', customTime: '',
  fulfillment: '', pickupLocation: '',
  deliveryAddress: '', deliveryLandmark: '', receiverName: '', receiverContact: '',
  deliveryBooker: '',
  customerName: '', customerContact: '', customerSocial: '',
};