
"use client";

import React from 'react';
import { AnalyticsPageContent } from '@/components/analytics/AnalyticsPageContent';

// This page now simply wraps the content component.
// The SideMenu, which was incorrectly placed here, has been moved to /src/components/shared/SideMenu.tsx
export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}
