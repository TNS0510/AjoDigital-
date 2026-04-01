import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Group, Membership } from '../types';
import { motion } from 'motion/react';
import { Plus, Users, Calendar, TrendingUp, ArrowRight, Wallet } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [recruitingGroups, setRecruitingGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch my groups via memberships
    const membershipsQuery = query(collection(db, 'memberships'), where('userUid', '==', user.uid), where('status', '==', 'active'));
    const unsubscribeMyGroups = onSnapshot(membershipsQuery, async (snapshot) => {
      const groupIds = snapshot.docs.map(doc => doc.data().groupId);
      if (groupIds.length === 0) {
        setMyGroups([]);
        setLoading(false);
        return;
      }

      // Fetch group details
      const groupsQuery = query(collection(db, 'groups'), where('id', 'in', groupIds));
      const groupsSnapshot = await getDocs(groupsQuery);
      setMyGroups(groupsSnapshot.docs.map(doc => doc.data() as Group));
      setLoading(false);
    });

    // Fetch recruiting groups
    const recruitingQuery = query(collection(db, 'groups'), where('status', '==', 'recruiting'));
    const unsubscribeRecruiting = onSnapshot(recruitingQuery, (snapshot) => {
      setRecruitingGroups(snapshot.docs.map(doc => doc.data() as Group).filter(g => g.organizerUid !== user.uid));
    });

    return () => {
      unsubscribeMyGroups();
      unsubscribeRecruiting();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div role="status" className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0066FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter serif">Hello, {profile?.displayName.split(' ')[0]}</h1>
          <p className="text-gray-500">Your savings journey is looking great today.</p>
        </div>
        <Link to="/create-group" className="btn-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          <span>Start a New Group</span>
        </Link>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Wallet className="text-[#0066FF]" />}
          label="Active Groups"
          value={myGroups.length.toString()}
          trend="Keep it up!"
        />
        <StatCard 
          icon={<TrendingUp className="text-[#28A745]" />}
          label="Total Contributions"
          value={`₦${myGroups.reduce((acc, g) => acc + g.contributionAmount, 0).toLocaleString()}`}
          trend="Monthly estimate"
        />
        <StatCard 
          icon={<Calendar className="text-orange-500" />}
          label="Next Payout"
          value="Calculated soon"
          trend="Check group details"
        />
      </section>

      {/* My Groups */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold serif">My Active Groups</h2>
          <Link to="/dashboard" className="text-sm text-[#0066FF] hover:underline">View All</Link>
        </div>
        {myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-6">You haven't joined any groups yet.</p>
            <Link to="/dashboard" className="btn-secondary inline-block">Explore Groups</Link>
          </div>
        )}
      </section>

      {/* Recruiting Groups */}
      <section>
        <h2 className="text-2xl font-bold mb-6 serif">Explore Recruiting Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitingGroups.map(group => (
            <GroupCard key={group.id} group={group} isExplore />
          ))}
          {recruitingGroups.length === 0 && (
            <p className="text-gray-500 italic">No new groups recruiting at the moment. Why not start one?</p>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
      <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs text-gray-400">{trend}</div>
  </div>
);

const GroupCard = ({ group, isExplore }: { group: Group, isExplore?: boolean }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between"
  >
    <div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold leading-tight">{group.name}</h3>
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
          group.status === 'recruiting' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
        }`}>
          {group.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-6">{group.description}</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Contribution</span>
          <span className="font-bold">₦{group.contributionAmount.toLocaleString()} / {group.frequency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Members</span>
          <span className="font-bold">{group.currentMemberCount} / {group.maxMembers}</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#0066FF] h-full transition-all duration-500" 
            style={{ width: `${(group.currentMemberCount / group.maxMembers) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>

    <Link 
      to={`/group/${group.id}`} 
      className={`w-full py-3 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
        isExplore ? 'bg-[#1A1A1A] text-white hover:bg-black' : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100'
      }`}
    >
      {isExplore ? 'View & Join' : 'Manage Group'}
      <ArrowRight size={18} />
    </Link>
  </motion.div>
);

export default Dashboard;
