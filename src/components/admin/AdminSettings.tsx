import React from 'react';
import { Settings, Database, Bell, Lock } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">System configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* System Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium text-gray-900">System Status</p>
                <p className="text-sm text-gray-600">Current system operational status</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium text-gray-900">Current Time</p>
                <p className="text-sm text-gray-600">Server synchronized time</p>
              </div>
              <span className="text-gray-700 font-mono text-sm">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Enable for scheduled maintenance</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Enable</button>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium text-gray-900">Export System Data</p>
                <p className="text-sm text-gray-600">Download all system data in CSV format</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Export</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">System Backup</p>
                <p className="text-sm text-gray-600">Last backup: {new Date(Date.now() - 86400000).toLocaleDateString()}</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Backup Now</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-orange-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900 font-medium">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-gray-900 font-medium">Critical alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-gray-900 font-medium">Daily summary</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your admin password</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Enable 2FA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
