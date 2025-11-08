import React from 'react'
import Hero from '../Components/common/Hero'
import CategoryHighlights from '../Components/common/CategoryHighlights'
import FeaturedProductsCarousel from '../Components/common/FeaturedProductsCarousel'
import DiscountPromoBanner from '../Components/common/DiscountPromoBanner'
import KidsFashionShowcase from '../Components/common/KidsFashionShowcase'
import SpecialMomentsBanner from '../Components/common/SpecialMomentsBanner'
import ProductGrid from '../Components/common/ProductGrid'
import DenimFeverSection from '../Components/common/DenimFeverSection'
import BabyShop from '../Components/common/BabyShop'
import BabyBanner from '../Components/common/BabyBanner'

const Homepages = () => {
  return (
    <>
    <Hero />
    <SpecialMomentsBanner />
    <KidsFashionShowcase />
    <ProductGrid />
    <DenimFeverSection />
    <BabyBanner />
    {/* <BabyShop /> */}
    
    
    </>
  )
}

export default Homepages