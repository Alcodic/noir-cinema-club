import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gold/70 tracking-[0.3em] uppercase text-xs">
        Checking membership…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
