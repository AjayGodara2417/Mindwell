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
  <div className="max-w-4xl mx-auto py-8 space-y-8">

    <div>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-gray-500 text-sm">
        Manage your account preferences
      </p>
    </div>

    {/* Account */}
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">

      <h2 className="font-medium">Account</h2>

      <div className="bg-gray-100 px-4 py-3 rounded-xl text-sm">
        {user?.email}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          value={user?.full_name?.split(" ")[0] || ""}
          className="bg-gray-100 px-4 py-2 rounded-xl"
        />
        <input
          value={user?.full_name?.split(" ")[1] || ""}
          className="bg-gray-100 px-4 py-2 rounded-xl"
        />
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="text-[#2f5d50] text-sm"
      >
        Change Password
      </button>
    </div>

    {/* Security */}
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="font-medium mb-2">Security</h2>

      <p className="text-sm text-gray-500">
        Keep your account secure.
      </p>
    </div>

    {/* Logout */}
    <div className="p-6 text-center">
      <p className="font-medium">Ready to leave?</p>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full"
      >
        Sign Out
      </button>
    </div>

    {showModal && (
      <ChangePasswordModal
        email={user?.email || ""}
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