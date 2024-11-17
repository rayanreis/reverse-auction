import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { UsersUseCase } from '../../domain/useCases/UsersUseCase';
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.session);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userUseCase = new UsersUseCase();
        const profile = await userUseCase.getUserProfile(user.uid);
        setUserProfile(profile);
        
      } catch (error) {
        toast.error('Failed to fetch profile data', {
          duration: 4000,
          position: 'top-center',
        });
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [user?.id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        
        {userProfile && (
          <div className="text-gray-600">            
            <p>Name: {userProfile.name}</p>
            <p>Email: {userProfile.email}</p>        
            <p>Date of Birth: {userProfile.dob}</p>      
            <p>Address: {userProfile.address.street}, {userProfile.address.city}, {userProfile.address.state}, {userProfile.address.country}, {userProfile.address.postalCode}</p>
          </div>
        )}
      </div>
    </div>
  );
} 