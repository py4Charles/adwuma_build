import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer" style={{
            borderTop: 'none',
            padding: '60px 24px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
            color: 'var(--color-bg)'
        }}></footer>
    );
};

export default Footer;