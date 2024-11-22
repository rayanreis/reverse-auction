import React, { useState, useEffect } from 'react';
import AuctionFilter from '../components/AuctionFilter';
import AuctionList from '../components/AuctionList';
import AuctionModal from '../components/AuctionModal';
import { AuctionsUseCase } from '../../domain/useCases/AuctionsUseCase';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUserId = useSelector(state => state.session.user?.uid);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      // Get auctions with filters
      const auctionsUseCase = new AuctionsUseCase();
      const auctions = await auctionsUseCase.getAuctions({
        status: 'active'
      });
      
      setAuctions(auctions);
      setFilteredAuctions(auctions);
    };

    fetchAuctions();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...auctions];

    if (filters.category) {
      filtered = filtered.filter(auction => auction.category === filters.category);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(auction => {
        if (max) {
          return auction.currentBid >= min && auction.currentBid <= max;
        }
        return auction.currentBid >= min;
      });
    }

    if (filters.status === 'ending-soon') {
      filtered = filtered.filter(auction => {
        const timeLeft = new Date(auction.endTime) - new Date();
        return timeLeft <= 24 * 60 * 60 * 1000;
      });
    }

    setFilteredAuctions(filtered);
  };

  const handleAuctionClick = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleBidPlaced = (updatedAuction) => {    
    const updateAuctionInList = (list) => list.map(auction => {
      if (auction.id === updatedAuction.id) {
        auction.bids = updatedAuction.bids;
        auction.currentBid = updatedAuction.currentBid;
        auction.currentBidder = updatedAuction.currentBidder;
        auction.history = updatedAuction.history;
      }
      return auction;
    });

    setAuctions(updateAuctionInList(auctions));
    setFilteredAuctions(updateAuctionInList(filteredAuctions));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auctions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Find and bid on professional services
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <AuctionFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <main className="lg:col-span-3">
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No auctions found matching your criteria</p>
              </div>
            ) : (
              <AuctionList auctions={filteredAuctions} onAuctionClick={handleAuctionClick} currentUserId={currentUserId} />
            )}
          </main>
        </div>
      </div>

      <AuctionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auction={selectedAuction}
        onBidPlaced={handleBidPlaced}
      />
    </div>
  );
};

export default HomePage; 