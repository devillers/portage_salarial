// seed.js
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Chalet from './models/Chalet.js';

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    username: 'admin1',
    email: 'admin1@example.com',
    password: 'password123',
    role: 'super-admin'
  }
];

const chalets = [
  {
    title: 'Chalet Mont Blanc',
    description: 'Un magnifique chalet au pied du Mont-Blanc avec vue panoramique.',
    shortDescription: 'Vue imprenable sur le massif du Mont-Blanc.',
    images: {
      hero: {
        url: 'https://res.cloudinary.com/demo/image/upload/v1699999999/chalet-hero.jpg',
        alt: 'Chalet face au Mont-Blanc',
        caption: 'Façade du chalet'
      },
      gallery: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1699999999/chalet-salon.jpg',
          alt: 'Salon avec cheminée',
          caption: 'Salon principal'
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1699999999/chalet-cuisine.jpg',
          alt: 'Cuisine moderne',
          caption: 'Cuisine avec îlot central'
        }
      ]
    },
    amenities: [
      { name: 'Jacuzzi', icon: 'hot-tub', description: 'Jacuzzi extérieur' }
    ],
    specifications: {
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      area: 180,
      floors: 2
    },
    location: {
      address: '275 Avenue des Alpages',
      city: 'Les Houches',
      country: 'France',
      postalCode: '74310',
      coordinates: {
        latitude: 45.889,
        longitude: 6.798
      }
    },
    pricing: {
      basePrice: 450,
      currency: 'EUR',
      cleaningFee: 120,
      securityDeposit: 500,
      taxRate: 10
    },
    availability: {
      isActive: true,
      minimumStay: 2,
      maximumStay: 30,
      checkInTime: '16:00',
      checkOutTime: '10:00',
      blockedDates: []
    },
    contact: {
      phone: '+33612345678',
      email: 'owner@example.com'
    },
    seo: {
      metaTitle: 'Chalet Mont Blanc | Location de luxe',
      metaDescription: 'Chalet de luxe à Les Houches avec vue Mont-Blanc',
      keywords: ['chalet', 'mont blanc', 'location', 'ski']
    },
    featured: true,
    views: 0
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Chalet.deleteMany({});
    console.log('🧹 Collections cleared');

    for (const u of users) {
      const user = new User(u);
      await user.save();
      console.log(`👤 User created: ${user.username}`);
    }

    for (const c of chalets) {
      const chalet = new Chalet(c);
      await chalet.save(); // slug auto
      console.log(`🏡 Chalet created: ${chalet.title}`);
    }

    console.log('✅ Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
