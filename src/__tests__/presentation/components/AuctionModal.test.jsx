import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AuctionModal from '../../../presentation/components/AuctionModal';
import { AuctionsUseCase } from '../../../domain/useCases/AuctionsUseCase';
import { Span } from 'next/dist/trace';

// Mock the dependencies
jest.mock('../../../domain/useCases/AuctionsUseCase');
jest.mock('react-hot-toast', () => ({
  Toaster: () => null,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockStore = configureStore([]);

describe('AuctionModal', () => {
  let store;
  const mockOnClose = jest.fn();
  const mockOnBidPlaced = jest.fn();
  
  const mockAuction = {
    id: '123',
    title: 'Test Auction',
    description: 'Test Description',
    currentBid: '100',
    bids: 5,
    category: 'Web Development',
    endTime: new Date().toISOString(),
    createdBy: 'user123',
  };

  beforeEach(() => {
    store = mockStore({
      session: {
        user: { uid: 'testUser' },
        isAuthenticated: true,
      },
    });
    jest.clearAllMocks();
  });

  it('renders auction details correctly', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AuctionModal
            isOpen={true}
            onClose={mockOnClose}
            auction={mockAuction}
            onBidPlaced={mockOnBidPlaced}
          />
        </Provider>
      );
    });

    expect(screen.getByText(mockAuction.title)).toBeInTheDocument();
    expect(screen.getByText(mockAuction.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockAuction.currentBid}`)).toBeInTheDocument();
    expect(screen.getByText(mockAuction.category)).toBeInTheDocument();
  });

  it('handles bid placement successfully', async () => {
    const updatedAuction = { ...mockAuction, currentBid: '90' };
    AuctionsUseCase.prototype.placeBid.mockResolvedValueOnce(updatedAuction);

    await act(async () => {
      render(
        <Provider store={store}>
          <AuctionModal
            isOpen={true}
            onClose={mockOnClose}
            auction={mockAuction}
            onBidPlaced={mockOnBidPlaced}
          />
        </Provider>
      );
    });

    const bidInput = screen.getByRole('spinbutton');
    const bidButton = screen.getByText(/Place Bid Now/i);

    await act(async () => {
      fireEvent.change(bidInput, { target: { value: '90' } });
      fireEvent.click(bidButton);
    });

    await waitFor(() => {
      expect(AuctionsUseCase.prototype.placeBid).toHaveBeenCalledWith(
        mockAuction.id,
        '90',
        'testUser'
      );
      expect(mockOnBidPlaced).toHaveBeenCalledWith(updatedAuction);
    });
  });

  it('shows login message when user is not authenticated', async () => {
    store = mockStore({
      session: {
        user: null,
        isAuthenticated: false,
      },
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <AuctionModal
            isOpen={true}
            onClose={mockOnClose}
            auction={mockAuction}
            onBidPlaced={mockOnBidPlaced}
          />
        </Provider>
      );
    });

    expect(screen.getByText(/Please login to place a bid/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByText(/Place Bid Now/i)).toBeDisabled();
  });

  it('hides bid section when auction belongs to current user', async () => {
    store = mockStore({
      session: {
        user: { uid: mockAuction.createdBy },
        isAuthenticated: true,
      },
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <AuctionModal
            isOpen={true}
            onClose={mockOnClose}
            auction={mockAuction}
            onBidPlaced={mockOnBidPlaced}
          />
        </Provider>
      );
    });

    expect(screen.queryByText(/Place Your Winning Bid/i)).not.toBeInTheDocument();
  });

  it('handles bid placement error', async () => {
    const errorMessage = 'Bid must be lower than current bid';
    AuctionsUseCase.prototype.placeBid.mockRejectedValueOnce(new Error(errorMessage));

    await act(async () => {
      render(
        <Provider store={store}>
          <AuctionModal
            isOpen={true}
            onClose={mockOnClose}
            auction={mockAuction}
            onBidPlaced={mockOnBidPlaced}
          />
        </Provider>
      );
    });

    const bidInput = screen.getByRole('spinbutton');
    const bidButton = screen.getByText(/Place Bid Now/i);

    await act(async () => {
      fireEvent.change(bidInput, { target: { value: '150' } });
      fireEvent.click(bidButton);
    });

    await waitFor(() => {
      expect(AuctionsUseCase.prototype.placeBid).toHaveBeenCalled();
      expect(mockOnBidPlaced).not.toHaveBeenCalled();
    });
  });
});