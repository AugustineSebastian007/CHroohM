import { useNavigate } from 'react-router-dom';

const SignOutPage = () => {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    // Then navigate to auth page
    navigate('/auth');
  };
  
  const handleCancel = () => {
    // Return to the previous page
    navigate(-1);
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
            {/* Abstract shapes - similar to the ones in the screenshots */}
            <div className="absolute left-1/3 top-1/4 w-32 h-32 bg-yellow-500 rounded-full"></div>
            <div className="absolute right-1/4 bottom-1/3 w-20 h-20 bg-orange-500 rounded-full"></div>
            <div className="absolute left-1/4 bottom-1/4 w-24 h-24 bg-yellow-500 rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-full transform rotate-45"></div>
            
            {/* White circle */}
            <div className="absolute left-1/2 top-1/2 w-16 h-16 border-4 border-white rounded-full"></div>
            
            {/* Curved lines - simplified representation with borders */}
            <div className="absolute w-64 h-64 border-t-4 border-l-4 border-white rounded-full border-opacity-40 -left-10 -top-10"></div>
            <div className="absolute w-48 h-48 border-b-4 border-r-4 border-white rounded-full border-opacity-40 right-5 bottom-20"></div>
          </div>
        </div>
      </div>

      {/* Right side with sign out confirmation */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12">
        <div className="md:hidden mb-8">
          <h1 className="text-3xl font-bold">Organic Mind</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-6">Sign out</h2>
          
          <p className="mb-8 text-gray-600">
            Are you sure you want to sign out? Your data will be saved and you can sign back in anytime.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-primary hover:bg-primary/90 text-[#121212] font-medium py-3 px-4 rounded-md"
            >
              Sign out
            </button>
            
            <button
              onClick={handleCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutPage; 