import { Link } from "react-router-dom";
import logo from "../assets/icon.png"

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="Adwuma Logo" className="navbar-logo" />
                    {/* <span className="navbar-brand-text">Adwuma</span> */}
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="nav-btn">Home</Link>
                    <Link to="/about" className="nav-btn">About</Link>
                    <Link to="/contact" className="nav-btn">Contact</Link>
                </nav>

                <div className="navbar-auth">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/signup" className="signup-btn">Sign Up</Link>
                </div>
            </div>

        </header>
    );
};

export default Navbar;