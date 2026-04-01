import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { motion } from 'motion/react';
import { Save, User as UserIcon, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/utils';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    accountNumber: profile?.bankDetails?.accountNumber || '',
    bankName: profile?.bankDetails?.bankName || '',
    accountName: profile?.bankDetails?.accountName || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        bankDetails: {
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          accountName: formData.accountName,
        }
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tighter serif">Your Profile</h1>
        <p className="text-gray-500">Manage your identity and payout details.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserIcon className="text-[#0066FF]" size={20} />
            Basic Information
          </h2>
          <div>
            <label htmlFor="displayName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
            <input
              id="displayName"
              type="text"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              value={formData.displayName}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
              value={user?.email || ''}
              disabled
            />
          </div>
        </section>

        {/* Bank Details */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="text-[#0066FF]" size={20} />
              Payout Details (Bank)
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#28A745] uppercase bg-green-50 px-2 py-1 rounded-full">
              <ShieldCheck size={12} />
              Secure
            </div>
          </div>
          <p className="text-sm text-gray-500">This information is only shared with group organizers when it's your turn for a payout.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="bankName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bank Name</label>
              <input
                id="bankName"
                type="text"
                placeholder="e.g. GTBank, Zenith"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Number</label>
              <input
                id="accountNumber"
                type="text"
                placeholder="10 digits"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                value={formData.accountNumber}
                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="accountName" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account Name</label>
            <input
              id="accountName"
              type="text"
              placeholder="As it appears on your bank statement"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              value={formData.accountName}
              onChange={e => setFormData({ ...formData, accountName: e.target.value })}
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
        >
          {loading ? 'Saving...' : <><Save size={20} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default Profile;
