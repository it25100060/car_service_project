import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Trash2, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await apiRequest('/users', {
        method: 'PUT',
        body: JSON.stringify({
          ...user,
          name: formData.name,
          email: formData.email,
        }),
      });
      
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await apiRequest(`/users/${user.id}`, {
        method: 'DELETE',
      });
      
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
          <p className="text-slate-500">Manage your profile information and account preferences.</p>
        </div>

        <div className="grid gap-8">
          {/* Profile Information Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your name and email address.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-slate-900">{user?.name}</h3>
                    <p className="text-sm text-slate-500">{user?.role}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      value={user?.role}
                      disabled
                      className="pl-10 bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Your role is assigned by the administrator and cannot be changed.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-red-100 bg-red-50/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
              <CardDescription className="text-red-700">
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </CardContent>
            <CardFooter className="border-t border-red-100 bg-red-50/50 px-6 py-4">
              <Dialog>
                <DialogTrigger
                  render={
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </div>
                  }
                  className="bg-red-600 hover:bg-red-700"
                />
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
