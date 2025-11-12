import React from 'react'
import Hero from '../Components/common/Hero'

import KidsFashionShowcase from '../Components/common/KidsFashionShowcase'
import SpecialMomentsBanner from '../Components/common/SpecialMomentsBanner'
import ProductGrid from '../Components/common/ProductGrid'
import DenimFeverSection from '../Components/common/DenimFeverSection'
import BabyShop from '../Components/common/BabyShop'
import BabyBanner from '../Components/common/BabyBanner'
import TestimonialSection from '../Components/common/TestimonialSection'

const Homepages = () => {
  return (
    <>
    <Hero />
    <SpecialMomentsBanner />
    <KidsFashionShowcase />
    <ProductGrid />
    <DenimFeverSection />
    <BabyBanner />
    <TestimonialSection />
    {/* <BabyShop /> */}
    
    
    </>
  )
}

export default Homepages