import React from 'react';
import PageContainer from '@/components/container/PageContainer';

// components
import Banner from '@/components/landingpage/banner/Banner';
import C2a from '@/components/landingpage/c2a/C2a';
import C2a2 from '@/components/landingpage/c2a/C2a2';
import DemoSlider from '@/components/landingpage/demo-slider/DemoSlider';
import Features from '@/components/landingpage/features/Features';
import Footer from '@/components/landingpage/footer/Footer';
import Frameworks from '@/components/landingpage/frameworks/Frameworks';
import OtherFramework from '@/components/landingpage/other-framework/OtherFramework';
import LpHeader from '@/components/landingpage/header/Header';
import Testimonial from '@/components/landingpage/testimonial/Testimonial';

export default function Landingpage() {
  return (
    <PageContainer title="Home" description="Meow Som Home">
      <LpHeader />
      <Banner />
      <DemoSlider />
      <Frameworks />
      <OtherFramework />
      <Testimonial />
      <Features />
      {/* <C2a /> */}
      <C2a2 />
      <Footer />
    </PageContainer>
  );
};

