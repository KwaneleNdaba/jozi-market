import { Instagram, Smartphone, Facebook, Youtube } from 'lucide-react';

export interface SocialSubmission {
  id: string;
  vendor: string;
  vendorPlan: 'Free' | 'Starter' | 'Growth' | 'Pro';
  product: string;
  platforms: string[];
  contentType: 'Reel' | 'Photo' | 'Short' | 'Carousel';
  aiScore: number; // 0-100
  status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled';
  submissionDate: string;
  priority: boolean;
  caption: string;
  mediaUrl: string;
  internalNotes?: string;
  scheduledSlot?: string;
}

export const ADMIN_SOCIAL_SUBMISSIONS: SocialSubmission[] = [
  {
    id: 'SUB-001',
    vendor: 'Maboneng Textiles',
    vendorPlan: 'Pro',
    product: 'Heritage Evening Wrap',
    platforms: ['ig', 'tt'],
    contentType: 'Reel',
    aiScore: 94,
    status: 'Pending',
    submissionDate: '2024-10-15',
    priority: true,
    caption: 'Discover the elegance of indigo shweshwe. Hand-stitched in the heart of the city. #JoziStyle',
    mediaUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800',
    internalNotes: 'Top-tier lighting. High viral potential.'
  },
  {
    id: 'SUB-002',
    vendor: 'Soweto Gold Jewelry',
    vendorPlan: 'Growth',
    product: 'Zebu Wallet Series',
    platforms: ['fb', 'ig'],
    contentType: 'Photo',
    aiScore: 78,
    status: 'Scheduled',
    submissionDate: '2024-10-14',
    priority: false,
    caption: 'Classic leather, modern heritage. Shop the Zebu collection.',
    mediaUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    scheduledSlot: '2024-10-20 18:00'
  },
  {
    id: 'SUB-003',
    vendor: 'Rosebank Art Gallery',
    vendorPlan: 'Starter',
    product: 'Skyline Canvas',
    platforms: ['yt'],
    contentType: 'Short',
    aiScore: 42,
    status: 'Rejected',
    submissionDate: '2024-10-12',
    priority: false,
    caption: 'Joburg skyline in 4K.',
    mediaUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=800',
    internalNotes: 'Low resolution asset. Does not meet 1080p minimum.'
  },
  {
    id: 'SUB-004',
    vendor: 'Alexandra Clay Works',
    vendorPlan: 'Starter',
    product: 'Pottery Set',
    platforms: ['tt'],
    contentType: 'Reel',
    aiScore: 88,
    status: 'Pending',
    submissionDate: '2024-10-15',
    priority: false,
    caption: 'The art of the fire. Watch our artisans at work in Alex.',
    mediaUrl: 'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'SUB-005',
    vendor: 'Jozi Apothecary',
    vendorPlan: 'Pro',
    product: 'Marula Glow Oil',
    platforms: ['ig', 'tt', 'yt'],
    contentType: 'Carousel',
    aiScore: 91,
    status: 'Approved',
    submissionDate: '2024-10-15',
    priority: true,
    caption: 'Organic roots, urban glow. The Marula secret is out.',
    mediaUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800'
  }
];

export const DAILY_SLOT_CONFIG = [
  { platform: 'Instagram', max: 4, used: 2, color: '#E4405F' },
  { platform: 'TikTok', max: 6, used: 5, color: '#000000' },
  { platform: 'YouTube', max: 3, used: 1, color: '#FF0000' },
  { platform: 'Facebook', max: 2, used: 0, color: '#1877F2' },
];

export const EQUITY_METRICS = [
  { label: 'Pro Vendors', share: 45, guarantee: 40 },
  { label: 'Growth Vendors', share: 35, guarantee: 35 },
  { label: 'Starter Vendors', share: 20, guarantee: 25 },
];