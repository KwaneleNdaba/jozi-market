
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Feature, Vendor } from '../types';

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface FeaturePlanContextType {
  plans: Plan[];
  features: Feature[];
  matrix: Record<string, string[]>; // planId -> array of featureIds
  vendorTier: string;
  updateMatrix: (planId: string, featureId: string) => void;
  updateFeatureStatus: (featureId: string, isActive: boolean) => void;
  addFeature: (feature: Omit<Feature, 'id'>) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
}

const DEFAULT_PLANS: Plan[] = [
  { id: 'free', name: 'Free Trial', price: 0 },
  { id: 'starter', name: 'Starter', price: 299 },
  { id: 'growth', name: 'Growth', price: 699 },
  { id: 'pro', name: 'Pro', price: 1499 },
];

const DEFAULT_FEATURES: Feature[] = [
  { id: 'f1', name: 'Standard Listings', description: 'List up to 50 items.', category: 'Sales', minTier: 'Free' },
  { id: 'f2', name: 'AI Descriptions', description: 'Gemini-powered copy.', category: 'AI & Analytics', minTier: 'Growth' },
  { id: 'f3', name: 'Priority Hub', description: 'Front-of-queue dispatch.', category: 'Logistics', minTier: 'Growth' },
  { id: 'f4', name: 'Custom Vouchers', description: 'Create discount codes.', category: 'Marketing', minTier: 'Starter' },
  { id: 'f5', name: 'Home Spotlight', description: 'Main page visibility.', category: 'Marketing', minTier: 'Pro' },
  { id: 'f6', name: 'API Access', description: 'Connect external ERPs.', category: 'Sales', minTier: 'Pro' },
];

const INITIAL_MATRIX: Record<string, string[]> = {
  'free': ['f1'],
  'starter': ['f1', 'f4'],
  'growth': ['f1', 'f4', 'f2', 'f3'],
  'pro': ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
};

const FeaturePlanContext = createContext<FeaturePlanContextType | undefined>(undefined);

export const FeaturePlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plans] = useState<Plan[]>(DEFAULT_PLANS);
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [matrix, setMatrix] = useState<Record<string, string[]>>(INITIAL_MATRIX);
  const [vendorTier] = useState('starter'); // Simulating a vendor on Starter plan

  const updateMatrix = (planId: string, featureId: string) => {
    setMatrix(prev => {
      const currentFeatures = prev[planId] || [];
      const newFeatures = currentFeatures.includes(featureId)
        ? currentFeatures.filter(id => id !== featureId)
        : [...currentFeatures, featureId];
      return { ...prev, [planId]: newFeatures };
    });
  };

  const updateFeatureStatus = (featureId: string, isActive: boolean) => {
    // In a real app, you might add an 'isActive' field to the Feature type
    console.log(`Setting feature ${featureId} status to: ${isActive}`);
  };

  const addFeature = (newFeat: Omit<Feature, 'id'>) => {
    const id = `f-${Date.now()}`;
    setFeatures(prev => [...prev, { ...newFeat, id }]);
  };

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <FeaturePlanContext.Provider value={{ 
      plans, features, matrix, vendorTier, 
      updateMatrix, updateFeatureStatus, addFeature, updateFeature 
    }}>
      {children}
    </FeaturePlanContext.Provider>
  );
};

export const useFeaturePlan = () => {
  const context = useContext(FeaturePlanContext);
  if (!context) throw new Error('useFeaturePlan must be used within FeaturePlanProvider');
  return context;
};
