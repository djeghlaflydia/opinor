"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import { auth } from "@/app/lib/auth";
import { api } from "@/app/lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminProfile();
      const data = response?.data || response;

      setProfile(data);
    } catch (err) {
      console.warn("Error fetching profile:", err);

      if (
        err?.message?.includes("401") ||
        err?.message?.includes("Non authentifié")
      ) {
        auth.logout();
        router.push("/login");
        return;
      }

      setError(err?.message || "Unable to load profile");

      const localUser = auth.getUserData();
      if (localUser) {
        setProfile(localUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    try {
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      SUPER_ADMIN: "Super Administrator",
      ADMIN: "Administrator",
      MODERATOR: "Moderator",
      USER: "User",
    };
    return roles[role] || "User";
  };

  /* ===========================
      LOADING
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="pt-20 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#038788] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen lg:ml-64 pt-16 lg:pt-0 lg:-mt-16 bg-gray-100">
      <AdminNavbar />

      <div className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* HEADER */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Administrator Profile
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your account information
              </p>
            </div>

            <span className="mt-4 sm:mt-0 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-teal-100 text-[#038788]"
                  style={{ backgroundColor: '#e6f7f7' }}>
              {getRoleDisplay(profile.role)}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* PROFILE CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Card Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center space-x-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#038788] to-teal-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                     style={{ background: 'linear-gradient(135deg, #038788 0%, #026b6b 100%)' }}>
                  {profile.email?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {profile.email}
                </h2>
                <p className="text-gray-500 mt-1">
                  Administrator Account
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem label="Email Address" value={profile.email} />
              <InfoItem label="Role" value={getRoleDisplay(profile.role)} />
              <InfoItem
                label="Account Created"
                value={formatDate(profile.createdAt)}
              />
              <InfoItem label="Account Status" status />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
    REUSABLE COMPONENT
============================ */
function InfoItem({ label, value, status }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {status ? (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          Active
        </span>
      ) : (
        <p className="text-gray-900 font-medium">
          {value || "Not available"}
        </p>
      )}
    </div>
  );
}