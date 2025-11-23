import { Outlet, Link } from 'react-router-dom'
import './Layout.css'
import HomeeLogo from '../assets/homee-logo.svg' // Import your logo

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <header className="header">
        <Link to="/" className="logo">
          <img src={HomeeLogo} alt="Homee Logo" className="header-logo" />
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/my-postings">My Postings</Link>
          {/* Add more links as needed, e.g., Profile, Orders */}
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2025 Homee Marketplace</p>
      </footer>
    </div>
  )
}

export default Layout