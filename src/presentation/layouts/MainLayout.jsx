import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = ({ children }) => {
  return (
    <Router>
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </Router>
  );
};

export default MainLayout;