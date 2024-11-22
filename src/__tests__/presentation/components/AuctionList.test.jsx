import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuctionList from '../../../presentation/components/AuctionList';

describe('AuctionList', () => {
  const mockAuctions = [
    {
      id: 1,
      title: 'Test Auction 1',
      description: 'Description 1',
      currentBid: 100,
      currentBidder: 'user1',
      endTime: '2024-12-31T23:59:59Z',
      bids: 5
    },
    {
      id: 2,
      title: 'Test Auction 2',
      description: 'Description 2',
      currentBid: 200,
      currentBidder: 'user2',
      endTime: '2023-12-31T23:59:59Z',
      bids: 3
    }
  ];

  const mockOnAuctionClick = jest.fn();

  it('renders auction list correctly', () => {
    render(<AuctionList auctions={mockAuctions} onAuctionClick={mockOnAuctionClick} />);
    
    expect(screen.getByText('Test Auction 1')).toBeInTheDocument();
    expect(screen.getByText('Test Auction 2')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('5 bids')).toBeInTheDocument();
    expect(screen.getByText('3 bids')).toBeInTheDocument();
  });

  it('shows "You\'re winning!" badge when user is current bidder', () => {
    render(
      <AuctionList 
        auctions={mockAuctions} 
        onAuctionClick={mockOnAuctionClick} 
        currentUserId="user1" 
      />
    );

    expect(screen.getByText("You're winning!")).toBeInTheDocument();
  });

  it('handles auction click correctly', () => {
    render(<AuctionList auctions={mockAuctions} onAuctionClick={mockOnAuctionClick} />);
    
    fireEvent.click(screen.getByText('Test Auction 1'));
    expect(mockOnAuctionClick).toHaveBeenCalledWith(mockAuctions[0]);
  });

  it('displays formatted time distance correctly', () => {
    const mockDate = new Date('2024-01-01T00:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    render(<AuctionList auctions={mockAuctions} onAuctionClick={mockOnAuctionClick} />);
    
    // The date "2024-12-31T23:59:59Z" should be approximately 1 year from 2024-01-01
    expect(screen.getByText('in 12 months')).toBeInTheDocument();

    jest.useRealTimers();
  });

});
