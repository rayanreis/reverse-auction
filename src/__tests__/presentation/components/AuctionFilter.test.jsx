import React from 'react';
import { render, screen } from '@testing-library/react';
import AuctionFilter from '../../../presentation/components/AuctionFilter';
import FilterDropdownItems from '../../../presentation/components/FilterDropdownItems';

// Mock the FilterDropdownItems component
jest.mock('../../../presentation/components/FilterDropdownItems', () => {
  return function MockFilterDropdownItems({ type }) {
    const options = {
      category: [
        <option key="1" value="Web Development">Web Development</option>,
        <option key="2" value="Mobile Development">Mobile Development</option>
      ],
      priceRange: [
        <option key="1" value="0-100">$0 - $100</option>,
        <option key="2" value="101-500">$101 - $500</option>
      ],
      status: [
        <option key="1" value="all">All</option>,
        <option key="2" value="active">Active</option>
      ]
    };
    return options[type];
  };
});

describe('AuctionFilter', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter sections', () => {
    render(<AuctionFilter onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

});
