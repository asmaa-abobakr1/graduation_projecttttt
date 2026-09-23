import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Headphones, 
  ArrowRight,
  ExternalLink,
  Edit,
  Check
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { categories as initialCategories } from '../../data/categories';
import Modal from '../../components/ui/Modal';

export default function AdminCategoriesPage() {
  const { products } = useProducts();
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#2563EB');

  const getIcon = (name) => {
    switch (name) {
      case 'Laptops': return <Laptop className="w-5 h-5" />;
      case 'Phones': return <Smartphone className="w-5 h-5" />;
      case 'Tablets': return <Tablet className="w-5 h-5" />;
      default: return <Headphones className="w-5 h-5" />;
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: categoriesList.length + 1,
      name: newCatName.trim(),
      slug: newCatName.trim(),
      icon: 'Headphones',
      count: 0,
      color: newCatColor,
    };

    setCategoriesList([...categoriesList, newCat]);
    setNewCatName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Product Category Control
          </h2>
          <p className="text-xs text-slate-400">
            Organize catalog classification, brand mapping, and device distribution
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Category Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categoriesList.map((cat) => {
          const prods = products.filter((p) => p.category === cat.name);
          const totalValuation = prods.reduce((acc, p) => acc + (p.price * p.stock), 0);

          return (
            <div
              key={cat.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                  >
                    {getIcon(cat.name)}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {prods.length} devices
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inventory Valuation: <strong className="text-white">${totalValuation.toLocaleString()}</strong>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/search?category=${cat.name}`}
                  target="_blank"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>View in Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/admin/products"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Manage items
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Hardware Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Smart Wearables, Displays"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
              />
              <span className="text-xs text-slate-400 font-mono">{newCatColor}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            >
              Add Category
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
