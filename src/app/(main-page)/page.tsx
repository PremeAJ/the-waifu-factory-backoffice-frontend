import React from 'react';
import PageContainer from '@/components/container/PageContainer';

import AdoptableShowcase from '@/components/landingpage/adoptable-showcase/AdoptableShowcase';
import Footer from '@/components/layout/footer/MainFooter';
import Header from './components/Header';

export default function Landingpage() {
  return (
    <PageContainer title="Home" description="The Waifu Factory Home">
      <Header />
      <AdoptableShowcase />
      <Footer />
    </PageContainer>
  );
};

