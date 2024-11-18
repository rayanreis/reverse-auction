import './App.css'; 
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js'; 
import MainLayout from './presentation/layouts/MainLayout.jsx';
import HomePage from './presentation/pages/HomePage.jsx';
import LoginPage from './presentation/pages/LoginPage.jsx';
import CreateAuctionPage from './presentation/pages/CreateAuctionPage.jsx';
import MyAuctionsPage from './presentation/pages/MyAuctionsPage.jsx';
import ProfilePage from './presentation/pages/ProfilePage.jsx';
import MyBidHistoryPage from './presentation/pages/MyBidHistoryPage.jsx';

function App() {
  return (    
    <Provider store={store}>
      <MainLayout>
        <Routes>        
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />        
          <Route path="/createAuction" element={<CreateAuctionPage />} />    
          <Route path="/myAuctions" element={<MyAuctionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mybids" element={<MyBidHistoryPage />} />
        </Routes>
      </MainLayout>     
    </Provider>
  );
}

export default App;
