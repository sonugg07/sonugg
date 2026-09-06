'use client';

import React from 'react';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { PortfolioData } from '@/types/portfolio';

export const Providers: React.FC<{ children: React.ReactNode; initialData?: PortfolioData }> = ({ children, initialData }) => {
  return <PortfolioProvider initialData={initialData}>{children}</PortfolioProvider>;
};
