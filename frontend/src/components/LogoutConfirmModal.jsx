const LogoutConfirmModal = ({ open, onCancel, onConfirm, message }) => {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </div>
                <h3 className="confirm-title">Log Out?</h3>
                <p className="confirm-message">{message || "Are you sure you want to log out of your account?"}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="confirm-btn confirm-btn-danger" onClick={onConfirm}>Yes, Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;