"use client";

import { useState, useEffect } from "react";
import { User, Shield, Lock, LogOut } from "lucide-react";

export default function Settings() {

  interface UserProfile {
    full_name?: string;
    email?: string;
  }

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  /* -------- Fetch User Like Profile Page -------- */

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setUser(data);

      } catch (error) {
        console.error("Settings load error:", error);
      }

      setLoading(false);

    };

    fetchProfile();

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences</p>
      </div>

      {/* Account */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

        <div className="flex items-center gap-2 font-semibold">
          <User size={18} /> Account
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Full Name</p>
            <p className="text-gray-500 text-sm">
              {user?.full_name}
            </p>
          </div>

        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-gray-500 text-sm">
              {user?.email}
            </p>
          </div>

        </div>

      </div>

      {/* Security */}
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <div className="flex items-center gap-2 font-semibold mb-4">
          <Shield size={18} /> Security
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-blue-600"
        >
          <Lock size={16} />
          Change Password
        </button>

      </div>

      {/* Sign Out */}

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      {showModal && (
        <ChangePasswordModal
          email={user?.email || localStorage.getItem("userEmail") || ""}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}


/* -------- Change Password Modal -------- */

interface ChangePasswordModalProps {
  email?: string;
  onClose: () => void;
}

function ChangePasswordModal({ email, onClose }: ChangePasswordModalProps) {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleUpdate = async () => {

    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        oldPassword,
        newPassword,
      }),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (data.success) {
      alert("Password updated successfully");
      onClose();
    } else {
      alert(data.message);
    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96 space-y-4">

        <h2 className="text-lg font-semibold">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border p-2 rounded"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>

        </div>

      </div>

    </div>

  );
}