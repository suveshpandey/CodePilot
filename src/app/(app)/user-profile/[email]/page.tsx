"use client"

import { signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  Mail, 
  User, 
  Calendar, 
  LogOut, 
  Edit3, 
  ChevronLeft,
  Camera
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt?: Date;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session?.user as UserData);
      setLoading(false);
    };
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return;
    return new Date(date).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">No user data found</p>
          <button 
            onClick={() => router.push("/sign-in")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 px-4 py-1 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 border-b border-slate-700">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 p-2 rounded-full border border-slate-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.username}
                </h1>
                <p className="text-slate-400 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-violet-400" />
                  Account Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Username</label>
                    <p className="text-white font-medium">{user.username}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400">Email Address</label>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  
                  
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-violet-400" />
                  Account Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Member Since</label>
                    <p className="text-white font-medium">
                      <span className="">{formatDate(user.createdAt)}</span> 
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Account Status</label>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        user.isVerified ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <span className="text-white font-medium">
                        {user.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-700">
              <button className="flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center justify-center px-6 py-3 bg-gray-300 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-2xl font-bold text-violet-400 mb-2">12</div>
            <div className="text-sm text-slate-400">Projects Created</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-2xl font-bold text-violet-400 mb-2">8</div>
            <div className="text-sm text-slate-400">Templates Saved</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-2xl font-bold text-violet-400 mb-2">3</div>
            <div className="text-sm text-slate-400">Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}