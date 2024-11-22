import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HomePage from '../../../presentation/pages/HomePage';
import { AuctionsUseCase } from '../../../domain/useCases/AuctionsUseCase';
import { Select } from '@headlessui/react';

// Mock the dependencies
jest.mock('../../../domain/useCases/AuctionsUseCase');

const mockStore = configureStore([]);

describe('HomePage', () => {
  let store;
  
  const mockAuctions = [
    {
      id: '1',
      title: 'Develop a website',
      category: 'web-development',
      currentBid: 90,
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      bids: [],
      currentBidder: null,
      history: []
    },
    {
      id: '2',
      title: 'Digital Marketing',
      category: 'digital-marketing',
      currentBid: 400,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      bids: [],
      currentBidder: null,
      history: []
    }
  ];

  beforeEach(() => {
    // Setup mock store
    store = mockStore({
      session: {
        user: { uid: 'test-user-id' }
      }
    });

    // Setup AuctionsUseCase mock
    AuctionsUseCase.mockImplementation(() => ({
      getAuctions: jest.fn().mockResolvedValue(mockAuctions)
    }));
  });

  it('renders homepage with auctions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <HomePage />
        </Provider>
      );
    });

    expect(screen.getByText('Auctions')).toBeInTheDocument();
    expect(screen.getByText('Find and bid on professional services')).toBeInTheDocument();
  });

  it('filters auctions by category', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <HomePage />
        </Provider>
      );
    });

    // Select Web Development from the dropdown
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'web-development' } });

    // Should only show Web Development category auction
    expect(screen.getByText('web-development', { selector: '#category-test' })).toBeInTheDocument();
    expect(screen.queryByText('digital-marketing', { selector: '#category-test' })).not.toBeInTheDocument();    
  });

  it('filters auctions by price range', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <HomePage />
        </Provider>
      );
    });

    // Simulate price range filter change
    const priceSelect = screen.getByLabelText(/Price Range/i);
    fireEvent.change(priceSelect, { target: { value: '0-100' } });

    // Should only show auctions within price range
    expect(screen.getByText('web-development', { selector: '#category-test' })).toBeInTheDocument();
    expect(screen.queryByText('digital-marketing', { selector: '#category-test' })).not.toBeInTheDocument(); 
  });

  it('opens modal when auction is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <HomePage />
        </Provider>
      );
    });

    // Click on an auction
    fireEvent.click(screen.getByText('Develop a website'));

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();    
  });
});