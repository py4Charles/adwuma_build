import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icon.png";

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="Adwuma Logo" className="navbar-logo" />
                </Link>

                <nav className="navbar-links">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-btn${isActive ? " active" : ""}`}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => `nav-btn${isActive ? " active" : ""}`}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => `nav-btn${isActive ? " active" : ""}`}
                    >
                        Contact
                    </NavLink>
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