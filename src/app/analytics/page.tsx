
"use client";

import React from 'react';
import { AnalyticsPageContent } from '@/components/analytics/AnalyticsPageContent';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}
