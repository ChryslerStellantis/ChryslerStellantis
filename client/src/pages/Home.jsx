import Hero from '../components/Hero';
import Featured from '../components/Featured';
import BannerDreamCar from '../components/BannerDreamCar';
import HowItWorks from '../components/HowItWorks';
import CountriesSection from '../components/CountriesSection';
import InventoryLocations from '../components/InventoryLocations';
import PopularBrands from '../components/PopularBrands';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import TrendingCars from '../components/TrendingCars';
import CtaBanner from '../components/CtaBanner';
import LatestNews from '../components/LatestNews';

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <BannerDreamCar />
      <HowItWorks />
      <InventoryLocations />
      <CountriesSection />
      <PopularBrands />
      <WhyChooseUs />
      <Testimonials />
      <TrendingCars />
      <CtaBanner />
      <LatestNews />
    </>
  );
}
