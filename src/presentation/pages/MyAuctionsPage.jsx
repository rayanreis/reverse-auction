import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuctionsUseCase } from '../../domain/useCases/AuctionsUseCase';
import { Toaster, toast } from 'react-hot-toast'; 
import AuctionList from '../components/AuctionList';
import AuctionModal from '../components/AuctionModal';

export default function MyAuctionsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.session);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        const auctionsUseCase = new AuctionsUseCase();
        const userAuctions = await auctionsUseCase.getAuctionsByUser(user.uid);
        setAuctions(userAuctions);
      } catch (error) {
        toast.error('Failed to fetch your auctions', {
          duration: 4000,
          position: 'top-center',
        });
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMyAuctions();
    }
  }, [user?.id, isAuthenticated]);

  const handleAuctionClick = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your auctions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Auctions</h1>
        {auctions.length > 0 ? (  
          <>
            <AuctionList auctions={auctions} onAuctionClick={handleAuctionClick} />
            <AuctionModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              auction={selectedAuction}
            />
          </>
        ) : (
          <p>No auctions found</p>
        )}
      </div>
    </div>
  );
} 