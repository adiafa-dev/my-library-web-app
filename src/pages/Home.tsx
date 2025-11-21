import CategoryCTA from '@/components/section/CategoryCTA';
import Footer from '@/components/section/Footer';
import Header from '@/components/section/Header';
import Hero from '@/components/section/Hero';
import PopularAuthors from '@/components/section/PopularAuthor';
import RecommendationSection from '@/components/section/RecommendationBooks';

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <CategoryCTA />
      <RecommendationSection />
      <PopularAuthors />
      <Footer />
    </>
  );
};

export default Home;
