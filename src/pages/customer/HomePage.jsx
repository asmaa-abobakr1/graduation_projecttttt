import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';
import { categories } from '../../data/categories';

export default function HomePage() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const featuredProducts = filteredProducts.slice(0, 8);
  const bestSellers = products.filter((p) => p.tags?.includes('Best Seller')).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Personal Computing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
                Future-ready devices. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                  Curated for real life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover breakthrough silicon, pro displays, and all-day endurance. From flagship laptops to intelligent accessories, explore hardware built without compromises.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all active:scale-95"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/compare"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>Compare Specs</span>
                </Link>
              </div>

              {/* Highlights stats bar */}
              <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-black text-white">20+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Premium Devices</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">2-Yr</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Official Warranty</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">COD</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Doorstep Checkout</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
                    alt="Featured MacBook Pro"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Featured Release</span>
                      <h4 className="text-sm font-bold text-white">MacBook Pro 16" (M3 Max)</h4>
                      <p className="text-xs text-slate-400">36GB Unified RAM • 1TB SSD</p>
                    </div>
                    <Link
                      to="/product/1"
                      className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Tech Hardware
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing high-performance laptops, smartphones, and accessories.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Devices ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-colors"
          >
            <span>View All {products.length} Electronic Devices</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>

      </section>

      {/* Best Sellers Showcase */}
      {bestSellers.length > 0 && (
        <section className="bg-slate-100/70 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Top Rated by Engineers</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Best Selling Devices
                </h3>
              </div>
              <Link to="/search" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View Full Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Smart Hardware Matrix
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Can't decide between chips or displays?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Use our interactive comparison engine to line up specs side-by-side: processors, RAM, GPU cores, battery runtimes, and pros/cons before checkout.
            </p>
            <div className="pt-2">
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/30"
              >
                <span>Launch Device Comparison</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
