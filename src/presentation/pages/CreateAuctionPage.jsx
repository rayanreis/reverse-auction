import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AuctionsUseCase } from '../../domain/useCases/AuctionsUseCase';
import { Toaster, toast } from 'react-hot-toast';
import FilterDropdownItems from '../components/FilterDropdownItems';

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.session);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: 0,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: '',
    createdBy: user.uid,
    history: [],
    status: 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auctionsUseCase = new AuctionsUseCase();
      await auctionsUseCase.createAuction(formData);
      
      toast.success('Auction created successfully!', {
        duration: 4000,
        position: 'top-center',
        icon: '🎉',
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to create auction. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
      console.error('Error creating auction:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'endTime') {
      const selectedDate = new Date(value);
      const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      if (selectedDate < minDate) {
        toast.error('End time must be at least 24 hours from now');
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: name === 'endTime' ? new Date(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          List Your Item for Auction
          <p className="mt-2 text-sm font-normal text-gray-600">
            Reach thousands of potential buyers and get the best price for your item
          </p>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Item Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a compelling title for your item"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Item Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your item in detail - condition, features, and why it's special"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startingPrice" className="text-sm font-medium text-gray-700">
                  Starting Price ($)
                </label>
                <input
                  type="number"
                  id="startingPrice"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  Auction End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime.toISOString().slice(0, 16)}
                  onChange={handleChange}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Item Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <FilterDropdownItems type="category" />
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              List Item for Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 