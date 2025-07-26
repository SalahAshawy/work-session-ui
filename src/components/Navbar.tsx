import { Link } from 'react-router-dom';

export const Navbar = () => (
  <div className="fixed bottom-0 left-0 w-full flex justify-around bg-gray-800 p-3 text-white">
    <Link to="/home">Home</Link>
    <Link to="/work-sessions">Sessions</Link>
    <Link to="/insights">Insights</Link>
  </div>
);
