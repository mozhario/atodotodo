import './Header.css';

function Header({ onLogout }) {
  return (
    <div className="header">
      <h1 className="text-center mb-4">a todo to do</h1>
      <button onClick={onLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}

export default Header; 