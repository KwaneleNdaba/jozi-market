
import { Product, Vendor, GameChallenge } from '../types';

export const MARKET_CATEGORIES = [
  {
    name: 'Fashion',
    slug: 'fashion',
    subcategories: ['Shweshwe', 'Contemporary', 'Footwear', 'Streetwear']
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    subcategories: ['Ceramics', 'Textiles', 'Woodwork', 'Metalwork']
  },
  {
    name: 'Art',
    slug: 'art',
    subcategories: ['Photography', 'Paintings', 'Sculptures']
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subcategories: ['Jewelry', 'Beadwork', 'Bags', 'Silk']
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    subcategories: ['Skincare', 'Body Care', 'Botanicals']
  },
  {
    name: 'Gourmet',
    slug: 'gourmet',
    subcategories: ['Tea & Coffee', 'Snacks', 'Pantry']
  }
];

export const vendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Maboneng Textiles',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400',
    location: 'Maboneng Precinct',
    description: 'Authentic South African fabrics and contemporary clothing designs.',
    // Added missing Vendor properties
    planTier: 'Pro',
    subscriptionFee: 1499,
    commissionRate: 3
  },
  {
    id: 'v2',
    name: 'Soweto Gold Jewelry',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1610492317734-d0370bcc645b?auto=format&fit=crop&q=80&w=400',
    location: 'Soweto',
    description: 'Handcrafted premium jewelry inspired by the heritage of Vilakazi Street.',
    // Added missing Vendor properties
    planTier: 'Growth',
    subscriptionFee: 699,
    commissionRate: 5
  },
  {
    id: 'v3',
    name: 'Rosebank Art Gallery',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
    location: 'Rosebank',
    description: 'Local sculptures and paintings from Joburg\'s rising stars.',
    // Added missing Vendor properties
    planTier: 'Starter',
    subscriptionFee: 299,
    commissionRate: 7
  },
  {
    id: 'v4',
    name: 'The Jozi Apothecary',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
    location: 'Parkhurst',
    description: 'Small-batch organic skincare and wellness products inspired by African botanicals.',
    // Added missing Vendor properties
    planTier: 'Free',
    subscriptionFee: 0,
    commissionRate: 10
  }
];

export const products: any[] = [
  {
    id: 'p1',
    name: 'Shweshwe Evening Dress',
    description: 'Elegant indigo shweshwe dress with modern cut-outs. Perfect for gala events and premium celebrations. Hand-dyed and stitched in the heart of Maboneng.',
    price: 1250,
    originalPrice: 1500,
    category: 'Fashion',
    subcategory: 'Shweshwe',
    vendor: { id: 'v1', name: 'Maboneng Textiles', rating: 4.8 },
    images: [
      'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewCount: 24,
    stock: 15,
    tags: ['Traditional', 'Evening Wear', 'Luxury'],
    variants: [
      { type: 'Size', options: ['S', 'M', 'L', 'XL'] }
    ]
  },
  {
    id: 'p2',
    name: 'Hand-Carved Baobab Bowl',
    description: 'Sustainable wood bowl carved by artisans in the Vaal region. Each piece carries the distinct grain patterns of aged Baobab wood.',
    price: 450,
    originalPrice: 600,
    category: 'Home Decor',
    subcategory: 'Woodwork',
    vendor: { id: 'v3', name: 'Rosebank Art Gallery', rating: 4.7 },
    images: [
      'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    reviewCount: 12,
    stock: 5,
    tags: ['Wooden', 'Artisanal']
  },
  {
    id: 'p3',
    name: 'Joburg Skyline Print',
    description: 'Limited edition canvas print of the Hillbrow Tower and Ponte City at sunset. Captured by local street photographer Lerato Dlamini.',
    price: 850,
    category: 'Art',
    subcategory: 'Photography',
    vendor: { id: 'v3', name: 'Rosebank Art Gallery', rating: 4.7 },
    images: [
      'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=1000'
    ],
    rating: 4.8,
    reviewCount: 8,
    stock: 50,
    tags: ['Canvas', 'Modern']
  },
  {
    id: 'p4',
    name: 'Zulu Beadwork Necklace',
    description: 'Vibrant handcrafted necklace featuring traditional geometric patterns. A bold statement piece.',
    price: 320,
    originalPrice: 400,
    category: 'Accessories',
    subcategory: 'Beadwork',
    vendor: { id: 'v2', name: 'Soweto Gold Jewelry', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 45,
    stock: 20,
    tags: ['Beaded', 'Traditional']
  },
  {
    id: 'p5',
    name: 'Marula Glow Face Oil',
    description: 'Rich, cold-pressed Marula oil infused with indigenous Cape Fynbos. Restores radiance and protects against urban pollution.',
    price: 380,
    category: 'Wellness',
    subcategory: 'Skincare',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 32,
    stock: 12,
    tags: ['Organic', 'Skincare']
  },
  {
    id: 'p6',
    name: 'Veld Leather Boots',
    description: 'Iconic South African footwear reimagined. Hand-stitched full-grain leather with heavy-duty soles for city explorers.',
    price: 1850,
    originalPrice: 2200,
    category: 'Fashion',
    subcategory: 'Footwear',
    vendor: { id: 'v1', name: 'Maboneng Textiles', rating: 4.8 },
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 15,
    stock: 8,
    tags: ['Leather', 'Footwear']
  },
  {
    id: 'p7',
    name: 'Maboneng Rooibos Gift Set',
    description: 'A collection of four artisanal rooibos blends: Wild Honey, Citrus Zest, Midnight Chai, and Pure Highland.',
    price: 290,
    category: 'Gourmet',
    subcategory: 'Tea & Coffee',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1594631252845-29fc4586c3d7?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    reviewCount: 19,
    stock: 30,
    tags: ['Tea', 'Gift']
  },
  {
    id: 'p8',
    name: 'Copper Braai Utensils',
    description: 'Hand-forged copper and hardwood braai set. Includes heavy-duty tongs, spatula, and basting brush.',
    price: 950,
    originalPrice: 1200,
    category: 'Home Decor',
    subcategory: 'Metalwork',
    vendor: { id: 'v3', name: 'Rosebank Art Gallery', rating: 4.7 },
    images: [
      'https://images.unsplash.com/photo-1533777857439-da3f95a439fb?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 10,
    stock: 4,
    tags: ['Copper', 'Outdoor']
  },
  {
    id: 'p9',
    name: 'Protea Ceramic Platter',
    description: 'Stunning hand-painted ceramic platter featuring the King Protea. A centerpiece for any Jozi dining room.',
    price: 520,
    category: 'Home Decor',
    subcategory: 'Ceramics',
    vendor: { id: 'v3', name: 'Rosebank Art Gallery', rating: 4.7 },
    images: [
      'https://images.unsplash.com/photo-1578500484748-482c361e5762?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 22,
    stock: 6,
    tags: ['Ceramic', 'Hand-painted']
  },
  {
    id: 'p10',
    name: 'Heritage Silk Scarf',
    description: '100% pure silk scarf featuring Ndebele-inspired geometric art. Dyed using sustainable local pigments.',
    price: 750,
    originalPrice: 950,
    category: 'Accessories',
    subcategory: 'Silk',
    vendor: { id: 'v1', name: 'Maboneng Textiles', rating: 4.8 },
    images: [
      'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 28,
    stock: 14,
    tags: ['Silk', 'Accessories']
  },
  {
    id: 'p11',
    name: 'Baobab & Honey Soap',
    description: 'Exfoliating cold-processed soap made with baobab pulp and raw Gauteng honey. Gentle for all skin types.',
    price: 85,
    category: 'Wellness',
    subcategory: 'Body Care',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    reviewCount: 56,
    stock: 100,
    tags: ['Natural', 'Body Care']
  },
  {
    id: 'p12',
    name: 'Silver Fern Earrings',
    description: 'Delicate sterling silver earrings cast from actual fern leaves found in the Magaliesberg mountains.',
    price: 490,
    category: 'Accessories',
    subcategory: 'Jewelry',
    vendor: { id: 'v2', name: 'Soweto Gold Jewelry', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 14,
    stock: 10,
    tags: ['Silver', 'Nature']
  },
  {
    id: 'p13',
    name: 'African Shea Butter Cream',
    description: 'Rich, nourishing body cream infused with pure African shea butter and aloe vera. Perfect for dry, sensitive skin.',
    price: 220,
    originalPrice: 280,
    category: 'Health & Beauty',
    subcategory: 'Skincare',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 42,
    stock: 25,
    tags: ['Natural', 'Moisturizing']
  },
  {
    id: 'p14',
    name: 'Rooibos & Chamomile Face Mask',
    description: 'Soothing clay mask with antioxidant-rich rooibos and calming chamomile. Reduces inflammation and brightens skin.',
    price: 180,
    category: 'Health & Beauty',
    subcategory: 'Skincare',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 38,
    stock: 18,
    tags: ['Face Mask', 'Antioxidant']
  },
  {
    id: 'p15',
    name: 'Moringa Oil Hair Treatment',
    description: 'Deep conditioning hair oil with moringa seed extract. Promotes hair growth and adds natural shine.',
    price: 195,
    category: 'Health & Beauty',
    subcategory: 'Hair Care',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c7a9c03?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 29,
    stock: 22,
    tags: ['Hair Care', 'Natural']
  },
  {
    id: 'p16',
    name: 'Buchu & Mint Lip Balm',
    description: 'Hydrating lip balm with buchu extract and peppermint. Soothes chapped lips with a refreshing tingle.',
    price: 65,
    category: 'Health & Beauty',
    subcategory: 'Skincare',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 51,
    stock: 45,
    tags: ['Lip Care', 'Hydrating']
  },
  {
    id: 'p17',
    name: 'African Black Soap Body Wash',
    description: 'Gentle cleansing body wash with traditional African black soap. Suitable for all skin types, especially acne-prone.',
    price: 150,
    originalPrice: 200,
    category: 'Health & Beauty',
    subcategory: 'Body Care',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 67,
    stock: 30,
    tags: ['Body Wash', 'Cleansing']
  },
  {
    id: 'p18',
    name: 'Turmeric & Honey Brightening Serum',
    description: 'Vitamin C-rich serum with turmeric and raw honey. Reduces dark spots and evens skin tone naturally.',
    price: 320,
    category: 'Health & Beauty',
    subcategory: 'Skincare',
    vendor: { id: 'v4', name: 'The Jozi Apothecary', rating: 4.9 },
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 33,
    stock: 15,
    tags: ['Serum', 'Brightening']
  }
];

export const gameChallenges: GameChallenge[] = [
  { id: 'g1', title: 'First Jozi Order', description: 'Complete your first purchase on Jozi Market.', points: 500, completed: false },
  { id: 'g2', title: 'Local Supporter', description: 'Buy items from 3 different local vendors.', points: 1000, completed: false },
  { id: 'g3', title: 'Joburg Explorer', description: 'Save 5 items to your wishlist.', points: 200, completed: false }
];
