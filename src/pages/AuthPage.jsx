import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, we'll just set a flag in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side with abstract design */}
      <div className="hidden md:flex md:w-1/2 bg-dark">
        <div className="flex flex-col justify-between p-12 w-full">
          <div>
            <h1 className="text-3xl font-bold text-white">Organic Mind</h1>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 relative">
            {/* Abstract shapes */}
            <div className="absolute left-20 top-20 w-32 h-32 rounded-full bg-primary"></div>
            <div className="absolute right-20 bottom-40 w-24 h-24 rounded-full bg-secondary"></div>
            <div className="absolute left-40 bottom-20 w-40 h-40 rounded-full border-4 border-white opacity-20"></div>
            {/* White lines/curves could be added with SVG for more detail */}
          </div>
        </div>
      </div>

      {/* Right side with auth form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12">
        <div className="md:hidden mb-8">
          <h1 className="text-3xl font-bold">Organic Mind</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            {isSignIn ? 'Sign in' : 'Get Started'}
          </h2>
          
          {!isSignIn && (
            <p className="mb-8 text-gray-600">
              With only the features you need, Organic Mind is customized for individuals seeking a stress-free way to stay focused on their goals, projects, and tasks.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="email.email@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-[#121212] font-medium py-3 px-4 rounded-md"
            >
              {isSignIn ? 'Sign in' : 'Get Started'}
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full h-px my-6 bg-gray-200 border-0" />
                <span className="absolute px-3 text-gray-500 bg-gray-50">or</span>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Facebook
                </button>
              </div>
            </div>
          </form>
          
          <p className="mt-8 text-center">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-primary font-medium hover:underline"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 