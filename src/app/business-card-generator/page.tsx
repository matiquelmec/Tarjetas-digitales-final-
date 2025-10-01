'use client';

import BusinessCardGenerator from '@/features/digital-card/components/BusinessCardGenerator';
import { AuthWrapper } from '../../components/AuthWrapper';

export default function BusinessCardGeneratorPage() {
  return (
    <AuthWrapper>
      <BusinessCardGenerator />
    </AuthWrapper>
  );
}
