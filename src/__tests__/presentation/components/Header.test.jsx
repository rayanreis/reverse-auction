import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer, { logout } from '../../../store/slices/sessionSlice';
import Header from '../../../presentation/components/Header';

// Mock the logo import
jest.mock('../../../presentation/img/logo.png', () => 'mocked-logo.png');

// Setup mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      session: sessionReducer,
    },
    preloadedState: {
      session: initialState,
    },
  });
};

// Wrapper component for tests
const renderWithProviders = (ui, { initialState, ...renderOptions } = {}) => {
  const store = createMockStore(initialState);
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter future={{ 
        v7_relativeSplatPath: true,
        v7_startTransition: true 
      }}>
        {children}
      </BrowserRouter>
    </Provider>
  );
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

describe('Header Component', () => {
  // Add cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Unauthenticated State', () => {
    const initialState = {
      user: null,
      isAuthenticated: false,
    };

    test('renders logo', () => {
      renderWithProviders(<Header />, { initialState });
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo.src).toContain('mocked-logo.png');
    });

    test('renders search bar', () => {
      renderWithProviders(<Header />, { initialState });
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    test('renders login button when user is not authenticated', () => {
      renderWithProviders(<Header />, { initialState });
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    const initialState = {
      user: { email: 'rayanrn8@hotmail.com' },
      isAuthenticated: true,
    };

    test('renders user email when authenticated', () => {
      renderWithProviders(<Header />, { initialState });
      expect(screen.getByText('rayanrn8@hotmail.com')).toBeInTheDocument();
    });

    test('toggles dropdown menu when user button is clicked', async () => {
      renderWithProviders(<Header />, { initialState });
      
      // Initially dropdown should not be visible
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      
      // Click user button
      fireEvent.click(screen.getByText('rayanrn8@hotmail.com'));
      
      // Use findBy instead of getBy for potentially async operations
      await screen.findByText('Profile');
      expect(screen.getByText('My Bid History')).toBeInTheDocument();
      expect(screen.getByText('My Auctions')).toBeInTheDocument();
      expect(screen.getByText('Create Auction')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('closes dropdown when a menu item is clicked', async () => {
      renderWithProviders(<Header />, { initialState });
      
      // Open dropdown
      fireEvent.click(screen.getByText('rayanrn8@hotmail.com'));
      await screen.findByText('Profile');
      
      // Click a menu item
      fireEvent.click(screen.getByText('Profile'));
      
      // Wait for dropdown to disappear
      await expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    test('dispatches logout action when logout is clicked', () => {
      const { store } = renderWithProviders(<Header />, { initialState });
      
      // Open dropdown
      fireEvent.click(screen.getByText('rayanrn8@hotmail.com'));
      
      // Click logout
      fireEvent.click(screen.getByText('Logout'));
      
      // Verify logout action was dispatched
      const actions = store.getState().session;
      expect(actions.isAuthenticated).toBeFalsy();
    });
  });
});
