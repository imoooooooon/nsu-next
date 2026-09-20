import { Briefcase, Users, Droplets, ShieldCheck } from 'lucide-react';

/* Notification demo data — identical to the shipped mobile prototype. */
export const globalNotifications = [
  { id: 1, type: 'job', icon: Briefcase, color: 'text-[#1D9BF0]', bg: 'bg-[#1D9BF0]/10', title: 'New Job Match', msg: 'Pathao posted a new Frontend Developer role that matches your skills.', time: '2m ago', unread: true },
  { id: 2, type: 'connection', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Connection Accepted', msg: 'Sarah Rahman accepted your connection request.', time: '1h ago', unread: true },
  { id: 3, type: 'blood', icon: Droplets, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Emergency Blood Request', msg: 'Urgent: B+ blood needed at Apollo Hospital.', time: '2h ago', unread: false },
  { id: 4, type: 'system', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Profile Strength', msg: 'Your profile strength is at 80%. Add a resume to reach 100%.', time: '1d ago', unread: false },
];

/* The compact rotating stack on Home uses the same items with shorter copy. */
export const previewNotifications = [
  { id: 1, type: 'job', icon: Briefcase, color: 'text-[#1D9BF0]', bg: 'bg-[#1D9BF0]/10', title: 'New Job Match', msg: 'Pathao posted a new Frontend Developer role that matches your skills.', time: '2m ago' },
  { id: 2, type: 'connection', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Connection Accepted', msg: 'Sarah Rahman accepted your connection request.', time: '1h ago' },
  { id: 3, type: 'blood', icon: Droplets, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Emergency Alert', msg: 'Urgent: B+ blood needed at Apollo Hospital.', time: '2h ago' },
  { id: 4, type: 'system', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Profile Strength', msg: 'Your profile strength is at 80%. Add a resume to reach 100%.', time: '1d ago' },
];
