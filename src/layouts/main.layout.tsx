import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { logout, setCredentials } from "@/slices/authSlice";
import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { Loader2 } from "lucide-react";

export function MainLayout() {
  const token = localStorage.getItem("access_token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [fetchingUser, setFetchingUser] = useState(!user && !!token);

  useEffect(() => {
    if (token && !user) {
      api.get('/me')
      .then((res) => {
        dispatch(setCredentials(res.data.user));
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => {
        setFetchingUser(false);
      });
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (fetchingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error(`Kesalahan saat logout: ${error}`);
    }
    finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4">
        <h1 className="text-xl font-bold">BKI Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">
            {user ? `Halo, ${user.full_name || user.name}` : ""}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
