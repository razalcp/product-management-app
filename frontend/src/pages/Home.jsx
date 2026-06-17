import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome Home</h1>
        <p className="text-lg text-gray-600">
          Hello, <span className="font-semibold text-indigo-600">{user?.name}</span>!
        </p>
        <div className="pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-6">You are securely logged in.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
