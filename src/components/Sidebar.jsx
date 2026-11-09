import React from 'react';
import {
  Home,
  CalendarPlus,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { activeTab, setActiveTab, currentUser, leaveRequests, setIsRequestModalOpen, logout } = useLeave();

  const pendingApprovalsCount = leaveRequests.filter((r) => r.status === 'รออนุมัติ').length;

  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'request', label: 'ขอลา', icon: CalendarPlus, isAction: true },
    { id: 'history', label: 'ประวัติการลา', icon: FileText },
    { id: 'calendar', label: 'ปฏิทินการลา', icon: Calendar },
    {
      id: 'approver',
      label: 'ผู้อนุมัติ / ผู้ดูแล',
      icon: Users,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
    },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  const handleNavClick = (item) => {
    if (item.isAction) {
      setIsRequestModalOpen(true);
    } else {
      setActiveTab(item.id);
    }
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#123E24] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 border-b border-emerald-900/40">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-950/40 mb-3 relative group">
            {/* Calendar with leaf icon */}
            <svg
              className="w-8 h-8 text-white drop-shadow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
            {/* Sprout leaf on top corner */}
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center text-[#123E24] shadow-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-prompt">
            SmartLeave
          </h1>
          <p className="text-xs font-light text-emerald-200/80 tracking-wide mt-0.5">
            Leave Management System
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-[#2A6A48] text-white shadow-md shadow-emerald-950/20 translate-x-1'
                    : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-300' : 'text-emerald-200/80'
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout & Footer Section */}
        <div className="px-4 py-4 border-t border-emerald-900/40 relative overflow-hidden">
          {/* Subtle leafy background shapes */}
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-800/30 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />

          {/* Decorative leaf SVG at bottom left matching design */}
          <div className="absolute bottom-0 left-0 w-36 h-28 pointer-events-none opacity-20">
            <svg viewBox="0 0 120 100" fill="none" className="w-full h-full text-emerald-300">
              <path
                d="M10,95 Q40,30 110,35 Q60,85 10,95 Z"
                fill="currentColor"
              />
              <path
                d="M5,95 Q20,50 80,60 Q40,90 5,95 Z"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </div>

          <button
            onClick={() => {
              if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                logout();
              }
            }}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium text-emerald-200/80 hover:bg-white/10 hover:text-white transition-colors relative z-10"
          >
            <LogOut className="w-5 h-5 text-emerald-300" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}

