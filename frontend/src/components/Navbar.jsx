import { Link } from "react-router-dom";
import logo from "../assets/icon.png"

const Navbar = () => {
    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={logo} alt="CraftLink Logo" className="navbar-logo" />
                <span className="navbar-brand-text">CraftLink</span>
            </Link>

            <nav className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>

            <div className="navbar-auth">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
        </header>
    );
};

export default Navbar;