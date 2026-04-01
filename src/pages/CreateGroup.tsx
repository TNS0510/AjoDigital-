import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Group, GroupFrequency, Membership } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Info, CheckCircle } from 'lucide-react';

const CreateGroup: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contributionAmount: 10000,
    frequency: 'monthly' as GroupFrequency,
    maxMembers: 10,
  });

  const handleSubmit = async () => {
    if (!user || !profile) return;
    setLoading(true);
    try {
      const groupRef = doc(collection(db, 'groups'));
      const newGroup: Group = {
        id: groupRef.id,
        name: formData.name,
        description: formData.description,
        organizerUid: user.uid,
        contributionAmount: formData.contributionAmount,
        frequency: formData.frequency,
        maxMembers: formData.maxMembers,
        currentMemberCount: 1,
        status: 'recruiting',
        rotationOrder: [],
        currentCycle: 0,
        createdAt: Date.now(),
      };

      await setDoc(groupRef, newGroup);

      // Create membership for organizer
      const membershipRef = doc(collection(db, 'memberships'));
      const newMembership: Membership = {
        id: membershipRef.id,
        groupId: groupRef.id,
        userUid: user.uid,
        displayName: profile.displayName,
        photoURL: profile.photoURL || '',
        bankDetails: profile.bankDetails,
        payoutTurn: 0,
        joinedAt: Date.now(),
        status: 'active',
      };
      await setDoc(membershipRef, newMembership);

      navigate(`/group/${groupRef.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#0066FF] mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold serif">Start a New Group</h1>
          <div className="flex gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`w-8 h-1.5 rounded-full ${step >= i ? 'bg-[#0066FF]' : 'bg-gray-100'}`}></div>
            ))}
          </div>
        </div>

        {step === 1 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label htmlFor="groupName" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Group Name</label>
              <input 
                id="groupName"
                type="text" 
                placeholder="e.g. Lagos Techies Monthly Ajo"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
              <textarea 
                id="description"
                placeholder="What is the goal of this group?"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all h-32"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!formData.name}
              className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50"
            >
              Next: Financials
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="contributionAmount" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Contribution (₦)</label>
                <input 
                  id="contributionAmount"
                  type="number" 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  value={formData.contributionAmount}
                  onChange={e => setFormData({ ...formData, contributionAmount: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="maxMembers" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Max Members</label>
                <input 
                  id="maxMembers"
                  type="number" 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  value={formData.maxMembers}
                  onChange={e => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Frequency</label>
              <div className="grid grid-cols-3 gap-4">
                {(['daily', 'weekly', 'monthly'] as GroupFrequency[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormData({ ...formData, frequency: f })}
                    className={`py-4 rounded-2xl border font-bold capitalize transition-all ${
                      formData.frequency === f ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#0066FF]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start">
              <Info className="text-[#0066FF] shrink-0" size={20} />
              <p className="text-xs text-[#0066FF] leading-relaxed">
                As the organizer, you are responsible for verifying member contributions. 
                The rotation order will be generated once the group is full and you start the cycle.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 btn-secondary py-4">Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-[2] btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Creating...' : <><CheckCircle size={20} /> Create Group</>}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
