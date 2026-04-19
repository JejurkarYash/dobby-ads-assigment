import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { isAxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiClient.post("/auth/signin", { email, password });
      if (res.status === 200) {
        localStorage.setItem("filenest_token", res.data.token);
        localStorage.setItem("filenest_user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError(res.data.error?.message || res.data.message || "Invalid credentials");
      }
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data?.error?.message || err.response.data?.message || "Invalid credentials");
      } else {
        setError("Network error. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] text-[#EDEDED] font-sans selection:bg-white/30">

      {/* Refined Minimalist Login Container */}
      <div className="w-full max-w-[380px] p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 mb-5 rounded-xl bg-gradient-to-tr from-[#222] to-[#111] border border-[#333] shadow-[0_0_15px_rgba(255,255,255,0.03)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
          </div>
          <h1 className="text-[22px] font-medium tracking-tight text-white mb-1">Welcome back</h1>
          <p className="text-[14px] text-[#888]">Sign in to your FileNest account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-3 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-[#888] mb-1.5 pl-0.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#777] focus:ring-1 focus:ring-[#777] transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5 pl-0.5 pr-0.5">
              <label className="block text-[13px] font-medium text-[#888]">Password</label>
              <a href="#" className="text-[13px] text-[#666] hover:text-white transition-colors">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#777] focus:ring-1 focus:ring-[#777] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-white text-black font-medium py-2.5 rounded-lg hover:bg-[#e5e5e5] active:bg-[#ccc] disabled:opacity-50 transition-colors flex items-center justify-center text-[14px] shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-[#666]">
          Don't have an account? <Link to="/register" className="ml-1 text-white hover:underline underline-offset-4 transition-all">Sign up</Link>
        </p>

      </div>
    </div>
  );
}
