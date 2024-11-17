import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AuctionsUseCase } from '../../domain/useCases/AuctionsUseCase';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuctionList from '../components/AuctionList';
import AuctionModal from '../components/AuctionModal';

const MyBidHistoryPage = () => {  
  const { user, isAuthenticated } = useSelector(state => state.session);
  const [loading, setLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const auctionUseCase = new AuctionsUseCase();
        const histories = await auctionUseCase.getBidHistory(user.uid);
        setHistories(histories);       
      } catch (error) {
        toast.error('Failed to fetch History auctions data', {
          duration: 4000,
          position: 'top-center',
        });        
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBidHistory();
    }
  }, [user?.uid, isAuthenticated]);

  const handleAuctionClick = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <Toaster />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">My Bid History</h1>
            
        {loading && <p>Loading...</p>}

        <div className="space-y-4">
          <AuctionList auctions={histories} onAuctionClick={handleAuctionClick} currentUserId={user?.uid} />
        </div>
      </div>
      <AuctionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auction={selectedAuction}
      />
    </div>
  );
};

export default MyBidHistoryPage; 