import { 
  Users, TrendingUp, Target, Wallet, ShoppingBag, Star, 
  MousePointer2, Zap 
} from 'lucide-react';

export const INFLUENCER_STATS = [
  { label: 'Network Reach', val: '142k', trend: '+12.4%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Commission Yield', val: 'R42,120', trend: '+18%', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Conversion Velocity', val: '5.4%', trend: '+0.8%', icon: Target, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
  { label: 'Artisan Affinity', val: 'Elite', trend: 'Lvl 22', icon: Star, color: 'text-jozi-forest', bg: 'bg-jozi-forest/10' },
];

export const INFLUENCER_CAMPAIGNS = [
  { id: 'cam-881', vendor: 'Maboneng Textiles', products: 'Heritage Evening Wrap', duration: 'Oct 15 - Oct 22', status: 'Active', metrics: { views: '12.4k', likes: '1.2k', clicks: '450' }, revenue: 'R18,450', img: '#' },
  { id: 'cam-882', vendor: 'Soweto Gold', products: 'Zebu Wallet Series', duration: 'Oct 18 - Oct 25', status: 'Pending', metrics: { views: '0', likes: '0', clicks: '0' }, revenue: 'R0', img: '#' },
  { id: 'cam-879', vendor: 'Jozi Apothecary', products: 'Marula Glow Pack', duration: 'Oct 01 - Oct 10', status: 'Completed', metrics: { views: '42.1k', likes: '8.4k', clicks: '2.1k' }, revenue: 'R54,200', img: '#' },
  { id: 'cam-884', vendor: 'Rosebank Art', products: 'Skyline Canvas Series', duration: 'Oct 20 - Oct 30', status: 'Pending', metrics: { views: '0', likes: '0', clicks: '0' }, revenue: 'R0', img: '#' },
];

export const INFLUENCER_RECS = [
  { id: 'rec-1', vendor: 'Alexandra Clay', reason: 'Your audience loves high-end ceramic aesthetics. Predicted ROI: 5.4x.', reach: '42k', fee: '15%', img: 'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=100' },
  { id: 'rec-2', vendor: 'Veld Leather', reason: 'Matching your high engagement in Urban Footwear categories.', reach: '38k', fee: '12%', img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=100' },
  { id: 'rec-3', vendor: 'Zebu Curios', reason: 'Historical trending category in your primary follower zone.', reach: '18k', fee: '20%', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=100' },
];

export const INFLUENCER_PAYOUTS = [
  { id: 'PAY-8842', vendor: 'Maboneng Textiles', status: 'Delivered', date: 'Oct 11, 2024', amount: 'R4,250' },
  { id: 'PAY-8831', vendor: 'Jozi Apothecary', status: 'Delivered', date: 'Oct 04, 2024', amount: 'R8,140' },
  { id: 'PAY-8845', vendor: 'Multiple Merchants', status: 'Pending', date: 'Oct 18, 2024', amount: 'R1,250' },
  { id: 'PAY-8822', vendor: 'Soweto Gold', status: 'Delivered', date: 'Sep 27, 2024', amount: 'R2,800' },
];