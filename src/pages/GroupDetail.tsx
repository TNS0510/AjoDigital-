import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs, setDoc, arrayUnion, increment, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Group, Membership, Contribution, UserProfile, ContributionStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Users, Calendar, ShieldCheck, 
  Clock, CheckCircle, AlertCircle, Upload, 
  MoreVertical, User as UserIcon, ExternalLink, TrendingUp, Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../lib/utils';

import { toast } from 'sonner';

import { shuffleRotationOrder } from '../lib/rotation';

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, UserProfile>>({});
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [myMembership, setMyMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId || !user) return;

    const unsubscribeGroup = onSnapshot(doc(db, 'groups', groupId), (snapshot) => {
      if (snapshot.exists()) {
        setGroup(snapshot.data() as Group);
      } else {
        navigate('/dashboard');
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `groups/${groupId}`));

    const unsubscribeMemberships = onSnapshot(query(collection(db, 'memberships'), where('groupId', '==', groupId)), (snapshot) => {
      const members = snapshot.docs.map(doc => doc.data() as Membership);
      setMemberships(members);
      setMyMembership(members.find(m => m.userUid === user.uid) || null);

      // Use denormalized profiles from memberships
      const profilesMap: Record<string, UserProfile> = {};
      members.forEach(m => {
        profilesMap[m.userUid] = {
          uid: m.userUid,
          displayName: m.displayName,
          photoURL: m.photoURL,
          bankDetails: m.bankDetails,
          email: '', // Email not needed for display
          createdAt: 0
        } as UserProfile;
      });
      setMemberProfiles(profilesMap);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'memberships'));

    const unsubscribeContributions = onSnapshot(query(collection(db, 'contributions'), where('groupId', '==', groupId)), (snapshot) => {
      setContributions(snapshot.docs.map(doc => doc.data() as Contribution));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'contributions'));

    return () => {
      unsubscribeGroup();
      unsubscribeMemberships();
      unsubscribeContributions();
    };
  }, [groupId, user]);

  const handleJoin = async () => {
    if (!user || !group || myMembership || !profile) return;
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      const membershipRef = doc(collection(db, 'memberships'));
      const newMembership: Membership = {
        id: membershipRef.id,
        groupId: group.id,
        userUid: user.uid,
        displayName: profile.displayName,
        photoURL: profile.photoURL || '',
        bankDetails: profile.bankDetails,
        payoutTurn: group.currentMemberCount,
        joinedAt: Date.now(),
        status: 'active',
      };
      
      batch.set(membershipRef, newMembership);
      batch.update(doc(db, 'groups', group.id), {
        currentMemberCount: increment(1)
      });
      
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'memberships');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartGroup = async () => {
    if (!group || group.organizerUid !== user?.uid) return;
    setSubmitting(true);
    try {
      // Shuffle rotation order
      const uids = memberships.map(m => m.userUid);
      const shuffled = shuffleRotationOrder(uids);
      
      await updateDoc(doc(db, 'groups', group.id), {
        status: 'active',
        rotationOrder: shuffled,
        startDate: Date.now(),
        currentCycle: 0
      });

      // Update payout turns in memberships
      for (const m of memberships) {
        const turn = shuffled.indexOf(m.userUid);
        await updateDoc(doc(db, 'memberships', m.id), { payoutTurn: turn });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${group.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProof = async (proofUrl: string) => {
    if (!user || !group) return;
    setSubmitting(true);
    try {
      const contributionRef = doc(collection(db, 'contributions'));
      const newContribution: Contribution = {
        id: contributionRef.id,
        groupId: group.id,
        userUid: user.uid,
        cycleNumber: group.currentCycle,
        amount: group.contributionAmount,
        status: 'submitted',
        proofUrl,
        submittedAt: Date.now(),
        createdAt: Date.now(),
      };
      await setDoc(contributionRef, newContribution);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'contributions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyContribution = async (contributionId: string, status: ContributionStatus) => {
    if (!user || !group || group.organizerUid !== user.uid) return;
    try {
      await updateDoc(doc(db, 'contributions', contributionId), {
        status,
        verifiedAt: Date.now(),
        verifiedBy: user.uid
      });
      toast.success(`Contribution ${status}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `contributions/${contributionId}`);
    }
  };

  const handleCompleteCycle = async () => {
    if (!group || group.organizerUid !== user?.uid) return;
    setSubmitting(true);
    try {
      const nextCycle = group.currentCycle + 1;
      const isLastCycle = nextCycle >= group.maxMembers;
      
      await updateDoc(doc(db, 'groups', group.id), {
        currentCycle: nextCycle,
        status: isLastCycle ? 'completed' : 'active'
      });
      toast.success(isLastCycle ? 'Group savings completed!' : 'Cycle completed! Moving to next recipient.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${group.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !group) {
    return (
      <div className="flex items-center justify-center h-64">
        <div role="status" className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0066FF]"></div>
      </div>
    );
  }

  const isOrganizer = group.organizerUid === user?.uid;
  const currentCycleContributions = contributions.filter(c => c.cycleNumber === group.currentCycle);
  const myCurrentContribution = currentCycleContributions.find(c => c.userUid === user?.uid);
  const payoutRecipientUid = group.rotationOrder[group.currentCycle];
  const payoutRecipient = memberProfiles[payoutRecipientUid];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-[#0066FF] transition-colors">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tighter serif">{group.name}</h1>
            <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
              group.status === 'recruiting' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
            }`}>
              {group.status}
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl">{group.description}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm min-w-[280px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Contribution</span>
              <span className="font-bold text-lg">₦{group.contributionAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Frequency</span>
              <span className="font-bold capitalize">{group.frequency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Pool</span>
              <span className="font-bold text-[#0066FF]">₦{(group.contributionAmount * group.maxMembers).toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              {!myMembership && group.status === 'recruiting' && (
                <button 
                  onClick={handleJoin} 
                  disabled={submitting || group.currentMemberCount >= group.maxMembers}
                  className="w-full btn-primary py-3"
                >
                  {submitting ? 'Joining...' : 'Join Group'}
                </button>
              )}
              {isOrganizer && group.status === 'recruiting' && group.currentMemberCount >= 2 && (
                <button 
                  onClick={handleStartGroup} 
                  disabled={submitting}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-bold hover:bg-black transition-all"
                >
                  {submitting ? 'Starting...' : 'Start Rotation'}
                </button>
              )}
              {myMembership && (
                <div className="flex items-center justify-center gap-2 text-[#28A745] font-bold py-2">
                  <CheckCircle size={18} />
                  <span>You are a member</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {group.status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Timeline & Payout */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-[#0066FF]" size={20} />
                Rotation Order
              </h2>
              <div className="space-y-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {group.rotationOrder.map((uid, index) => {
                  const profile = memberProfiles[uid];
                  const isActive = index === group.currentCycle;
                  const isPast = index < group.currentCycle;

                  return (
                    <div key={uid} className="flex gap-6 items-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        isActive ? 'bg-[#0066FF] text-white border-[#0066FF]' : 
                        isPast ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-200'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        {profile?.photoURL ? (
                          <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon size={14} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className={`text-sm font-bold ${isActive ? 'text-[#0066FF]' : 'text-gray-700'}`}>
                            {profile?.displayName || 'Loading...'}
                          </p>
                          {isActive && <span className="text-[10px] uppercase font-bold text-[#0066FF]">Current Payout</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {isActiveRecipient(user?.uid, group) && (
              <section className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
                <TrendingUp className="text-[#0066FF] mb-4" size={32} />
                <h3 className="text-xl font-bold text-[#0066FF] mb-2">It's Your Turn!</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  You are the recipient for this cycle. Once all members have contributed and the organizer verifies them, 
                  the total pool of ₦{(group.contributionAmount * group.maxMembers).toLocaleString()} will be sent to your account.
                </p>
              </section>
            )}
          </div>

          {/* Right Column: Contributions & Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Cycle Status */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold serif">Cycle #{group.currentCycle + 1} Status</h2>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold">Payout To</p>
                  <p className="font-bold text-[#0066FF]">{payoutRecipient?.displayName || '...'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 bg-gray-50 rounded-3xl">
                  <p className="text-sm text-gray-500 mb-1">Verified Contributions</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">
                      {currentCycleContributions.filter(c => c.status === 'verified').length}
                    </span>
                    <span className="text-gray-400 mb-1">/ {group.maxMembers}</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl">
                  <p className="text-sm text-gray-500 mb-1">Total Collected</p>
                  <p className="text-3xl font-bold text-[#28A745]">
                    ₦{(currentCycleContributions.filter(c => c.status === 'verified').length * group.contributionAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Organizer Actions: Bank Details & Cycle Completion */}
              {isOrganizer && (
                <div className="space-y-6">
                  {payoutRecipient?.bankDetails ? (
                    <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recipient Bank Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Bank Name</p>
                          <p className="font-bold">{payoutRecipient.bankDetails.bankName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Account Number</p>
                          <p className="font-bold">{payoutRecipient.bankDetails.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Account Name</p>
                          <p className="font-bold">{payoutRecipient.bankDetails.accountName}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-3">
                      <AlertCircle className="text-orange-500" size={20} />
                      <p className="text-sm text-orange-700 font-medium">Recipient hasn't added bank details yet.</p>
                    </div>
                  )}

                  {currentCycleContributions.filter(c => c.status === 'verified').length === (group.maxMembers - 1) && (
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-green-800">All contributions verified!</p>
                        <p className="text-sm text-green-700">You can now disburse the funds and move to the next cycle.</p>
                      </div>
                      <button 
                        onClick={handleCompleteCycle}
                        disabled={submitting}
                        className="bg-[#28A745] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? 'Processing...' : 'Complete Cycle & Move Next'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* My Contribution Action */}
              {!isActiveRecipient(user?.uid, group) && (
                <div className="mb-12 p-8 border-2 border-[#0066FF] border-dashed rounded-3xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Your Contribution</h3>
                      <p className="text-sm text-gray-500">Please send ₦{group.contributionAmount.toLocaleString()} to the organizer's account.</p>
                    </div>
                    {myCurrentContribution ? (
                      <div className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full ${
                        myCurrentContribution.status === 'verified' ? 'bg-green-50 text-green-600' : 
                        myCurrentContribution.status === 'submitted' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {myCurrentContribution.status === 'verified' ? <CheckCircle size={20} /> : <Clock size={20} />}
                        <span className="capitalize">{myCurrentContribution.status}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          const url = prompt('Enter proof of payment URL (e.g. image link):');
                          if (url) handleSubmitProof(url);
                        }}
                        disabled={submitting}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Upload size={18} />
                        Submit Proof
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 font-bold">Member</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold">Proof</th>
                      {isOrganizer && <th className="pb-4 font-bold text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {memberships.map(m => {
                      const profile = memberProfiles[m.userUid];
                      const contribution = currentCycleContributions.find(c => c.userUid === m.userUid);
                      const isRecipient = m.userUid === payoutRecipientUid;

                      return (
                        <tr key={m.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {profile?.photoURL ? (
                                <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <UserIcon size={14} className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold">{profile?.displayName || 'Loading...'}</p>
                                {isRecipient && <span className="text-[10px] text-[#0066FF] font-bold uppercase">Recipient</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            {isRecipient ? (
                              <span className="text-xs font-bold text-gray-400 italic">Receiving Payout</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  contribution?.status === 'verified' ? 'bg-green-500' :
                                  contribution?.status === 'submitted' ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                                <span className="text-xs font-bold capitalize text-gray-600">
                                  {contribution?.status || 'Not Paid'}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-4">
                            {contribution?.proofUrl ? (
                              <a href={contribution.proofUrl} target="_blank" rel="noreferrer" className="text-[#0066FF] hover:underline flex items-center gap-1 text-xs font-bold">
                                View <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                          {isOrganizer && (
                            <td className="py-4 text-right">
                              {contribution?.status === 'submitted' && (
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => handleVerifyContribution(contribution.id, 'verified')}
                                    className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                    title="Verify"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleVerifyContribution(contribution.id, 'flagged')}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    title="Flag"
                                  >
                                    <AlertCircle size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {group.status === 'recruiting' && (
        <section className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center max-w-3xl mx-auto">
          <Users className="mx-auto text-[#0066FF] mb-6" size={48} />
          <h2 className="text-3xl font-bold mb-4 serif">Recruiting Members</h2>
          <p className="text-gray-500 mb-10">
            This group needs {group.maxMembers - group.currentMemberCount} more members to start the rotation. 
            Share the link with your trusted community!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {memberships.map(m => {
              const profile = memberProfiles[m.userUid];
              return (
                <div key={m.id} className="flex flex-col items-center gap-2">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-md">
                      <UserIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-gray-500 max-w-[60px] truncate">{profile?.displayName}</span>
                </div>
              );
            })}
            {Array.from({ length: group.maxMembers - group.currentMemberCount }).map((_, i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                <Plus size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const isActiveRecipient = (uid: string | undefined, group: Group) => {
  if (!uid || !group.rotationOrder) return false;
  return group.rotationOrder[group.currentCycle] === uid;
};

export default GroupDetail;
