// register page
import React, { useState } from 'react';
import { Eye, EyeOff} from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('http://localhost:5001/api/auth/register', {
                username,
                email,
                password
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response.data.message || 'Registration failed');
        }
    };
    const getStrength = (val) => {
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        return score;
  };
    const strengthLabels = ["Too short", "Weak", "Fair", "Strong"];
    const strengthColors = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];
    const barColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    const strength = password.length > 0 ? getStrength(password) : 0;


    return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-xl bg-blue-600 text-white">
              {/* Replace with your actual logo/icon */}
              <svg className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">Join us in seconds — it's free</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <span className="shrink-0">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="name" type="text" required autoComplete="name"
                value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? barColors[strength - 1] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${strengthColors[strength - 1]}`}>
                    {strengthLabels[strength - 1]}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-[0.985]"
            >
              Create account
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
