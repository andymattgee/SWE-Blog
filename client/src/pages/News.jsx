/**
 * News Component
 * 
 * A React component that displays news articles from various categories.
 * Organizes content into four main sections: Tech, Sports, Pop Culture, and Local.
 * Each section contains containers for news articles that will be populated from APIs.
 * 
 * @component
 */
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const News = () => {
  // Create an array of 5 items for each section
  const placeholderItems = Array(5).fill(null);

  // Component for a single news item with gradient background
  const NewsItem = ({ index }) => (
    <div className="rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Gradient background instead of image */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-green-400"></div>
      <div className="p-4 flex-grow bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
        <p className="text-gray-600 text-sm">News content will be available once our backend is ready.</p>
      </div>
      <div className="px-4 pb-4 bg-white">
        <span className="text-blue-600 text-sm font-medium">Stay tuned!</span>
      </div>
    </div>
  );

  // Component for a section of news
  const NewsSection = ({ title, bgColor }) => (
    <section className={`py-8 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {placeholderItems.map((_, index) => (
            <NewsItem key={index} index={index} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-xl">Stay updated with the latest news from various categories</p>
          </div>
        </div>

        {/* News sections */}
        <NewsSection 
          title="Tech News" 
          bgColor="bg-gray-100" 
        />
        
        <NewsSection 
          title="Sports News" 
          bgColor="bg-white" 
        />
        
        <NewsSection 
          title="Pop Culture News" 
          bgColor="bg-gray-100" 
        />
        
        <NewsSection 
          title="Local News" 
          bgColor="bg-white" 
        />
      </main>

      <Footer />
    </div>
  );
};

export default News;
