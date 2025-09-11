"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
  mobileOrder: number;
}

interface PackageContextType {
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  return (
    <PackageContext.Provider value={{ selectedPackage, setSelectedPackage }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackage = () => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  return context;
};
