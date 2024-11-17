import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AuctionsUseCase } from '../../domain/useCases/AuctionsUseCase';
import { Toaster, toast } from 'react-hot-toast';

const AuctionModal = ({ isOpen, onClose, auction, onBidPlaced }) => {  
  const [bidAmount, setBidAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.session);
  const myAuction = isAuthenticated && user && auction ? auction.createdBy === user.uid : false;  

  useEffect(() => {
    if (isOpen) {
      setBidAmount('');
    }
  }, [isOpen]);

  const handleBid = async () => {   
    setIsLoading(true);
    const auctionsUseCase = new AuctionsUseCase();
    try {
      const updatedAuction = await auctionsUseCase.placeBid(auction.id, bidAmount, user.uid);
      toast.success('Bid placed successfully! 🎉', { duration: 2000 });      
      onBidPlaced(updatedAuction);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      if (error.message !== '') {
        toast.error(error.message, { duration: 2000 });
      } else {
        toast.error('Failed to place bid. Please try again.', { duration: 2000 });
      }      
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Toaster />
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[70vw] max-h-[80vh] overflow-y-auto transform rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {auction && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900 mb-6"
                    >
                      {auction.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-base text-gray-500">
                        {auction.description}
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <p className="text-base">
                            <span className="font-semibold">Current Bid:</span> ${auction.currentBid}
                          </p>
                          <p className="text-base">
                            <span className="font-semibold">Total Bids:</span> {auction.bids}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <p className="text-base">
                            <span className="font-semibold">Category:</span> {auction.category}
                          </p>
                          <p className="text-base">
                            <span className="font-semibold">Ends at:</span>{' '}
                            {new Date(auction.endTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!myAuction && (
                    <div className="mt-8 border-t pt-6">
                      <div className="relative">
                        {!isAuthenticated && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <p className="text-lg font-semibold text-red-600 bg-white px-6 py-3 rounded-lg border border-red-200 mt-2">
                              Please login to place a bid
                            </p>
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <div className="flex-1">
                            <label htmlFor="bidAmount" className="block text-lg font-semibold text-gray-800 mb-2">
                              Place Your Winning Bid 🏆
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">$</span>
                              <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                max={Number(auction.currentBid) - 1}
                                step="1"
                                className={`block w-full rounded-lg border-2 border-gray-300 pl-8 pr-4 py-4 text-xl font-semibold shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                                  isAuthenticated ? 'hover:border-blue-400' : ''
                                }`}
                                placeholder={`Max bid: $${Number(auction.currentBid) - 1}`}
                                disabled={!isAuthenticated || isLoading}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Enter an amount lower than the current bid</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleBid}
                            disabled={!isAuthenticated || isLoading}
                            className="w-auto inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:from-blue-700 hover:to-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            Place Bid Now 🚀
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-6 py-3 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuctionModal; 