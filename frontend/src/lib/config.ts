/**
 * Centralized restaurant configuration.
 * Change these values to rebrand — zero code modifications required.
 */
export const siteConfig = {
  name: 'Tadkedar',
  fullName: 'Tadkedar North Indian Family Restaurant',
  tagline: 'North Indian Family Dining',
  description:
    'Premium North Indian family dining in a calm, hygienic, and private ambience. Experience authentic flavors crafted with care in Gadag-Betigeri.',
  cuisine: 'North Indian',
  diningType: 'Premium Family Restaurant',
  rating: 4.4,
  reviewCount: 408,
  services: ['Dine-in', 'Takeaway', 'Delivery'],

  contact: {
    phone: '070225 13482',
    phoneRaw: '+917022513482',
    whatsapp: '+917022513482',
    email: 'info@tadkedar.com',
  },

  address: {
    full: 'Scan Center Building, K C Rani Rd, Opposite Chethan Canteen, Vidya Nagar, Kalasapur, Gadag-Betigeri, Karnataka 582101',
    street: 'Scan Center Building, K C Rani Rd',
    landmark: 'Opposite Chethan Canteen',
    area: 'Vidya Nagar, Kalasapur',
    city: 'Gadag-Betigeri',
    state: 'Karnataka',
    zip: '582101',
    country: 'India',
    plusCode: 'CJJV+WM Gadag-Betigeri',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1922.5!2d75.6290!3d15.4270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb07c3a5e6b1b0d%3A0x1234567890abcdef!2sScan%20Center%20Building%2C%20K%20C%20Rani%20Rd%2C%20Vidya%20Nagar%2C%20Gadag-Betigeri!5e0!3m2!1sen!2sin!4v1697000000000!5m2!1sen!2sin',
  },

  hours: {
    monday: '11:00 AM – 10:30 PM',
    tuesday: '11:00 AM – 10:30 PM',
    wednesday: '11:00 AM – 10:30 PM',
    thursday: '11:00 AM – 10:30 PM',
    friday: '11:00 AM – 10:30 PM',
    saturday: '11:00 AM – 10:30 PM',
    sunday: '11:00 AM – 10:30 PM',
  },

  seo: {
    title: 'Tadkedar — Premium North Indian Family Restaurant in Gadag',
    description:
      'Experience the finest North Indian family dining at Tadkedar in Gadag-Betigeri. Authentic cuisine, calm ambience, and impeccable hygiene. Dine-in, takeaway & delivery.',
    keywords: [
      'Premium North Indian restaurant in Gadag',
      'Family dining Gadag',
      'Best North Indian food in Gadag-Betigeri',
      'Tadkedar restaurant',
      'North Indian food Karnataka',
      'family restaurant Gadag',
    ],
    ogImage: '/og-image.jpg',
  },

  social: {
    instagram: '',
    facebook: '',
  },
} as const;

export type SiteConfig = typeof siteConfig;
