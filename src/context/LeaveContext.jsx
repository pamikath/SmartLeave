import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUser,
  approverUser,
  initialQuotas,
  initialLeaveRequests,
  announcementsData,
  notificationsData,
} from '../data/mockData';

const LeaveContext = createContext();

export function LeaveProvider({ children }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('leaveflow_auth');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Load from localStorage or use initial data
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('leaveflow_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('leaveflow_requests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [quotas, setQuotas] = useState(() => {
    const saved = localStorage.getItem('leaveflow_quotas');
    return saved ? JSON.parse(saved) : initialQuotas;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('leaveflow_notifications');
    return saved ? JSON.parse(saved) : notificationsData;
  });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('leaveflow_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('leaveflow_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('leaveflow_quotas', JSON.stringify(quotas));
  }, [quotas]);

  useEffect(() => {
    localStorage.setItem('leaveflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Recalculate quotas based on approved/pending requests for current user
  const recalculateQuotas = (requests) => {
    const userApprovedRequests = requests.filter(
      (r) => r.employeeId === 'usr-101' && r.status === 'อนุมัติ'
    );
    const vacationUsed = userApprovedRequests
      .filter((r) => r.typeKey === 'vacation')
      .reduce((sum, r) => sum + r.days, 0);
    const personalUsed = userApprovedRequests
      .filter((r) => r.typeKey === 'personal')
      .reduce((sum, r) => sum + r.days, 0);
    const sickUsed = userApprovedRequests
      .filter((r) => r.typeKey === 'sick')
      .reduce((sum, r) => sum + r.days, 0);
    const maternityUsed = userApprovedRequests
      .filter((r) => r.typeKey === 'maternity')
      .reduce((sum, r) => sum + r.days, 0);

    const vacationRem = Math.max(0, 10 - vacationUsed);
    const personalRem = Math.max(0, 5 - personalUsed);
    const sickRem = Math.max(0, 10 - sickUsed);
    const maternityRem = Math.max(0, 98 - maternityUsed);

    setQuotas({
      totalRemaining: vacationRem + personalRem,
      totalLimit: 15,
      vacation: { ...initialQuotas.vacation, remaining: vacationRem, used: vacationUsed },
      personal: { ...initialQuotas.personal, remaining: personalRem, used: personalUsed },
      sick: { ...initialQuotas.sick, remaining: sickRem, used: sickUsed },
      maternity: { ...initialQuotas.maternity, remaining: maternityRem, used: maternityUsed },
    });
  };

  // Switch role between employee and approver
  const switchRole = (role) => {
    if (role === 'approver') {
      setCurrentUser(approverUser);
    } else {
      setCurrentUser(initialUser);
    }
  };

  // Submit a new leave request
  const submitLeaveRequest = (newRequestData) => {
    const id = `req-${Date.now()}`;
    const newReq = {
      id,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      status: 'รออนุมัติ',
      appliedDate: 'วันนี้',
      approvedDate: null,
      approver: 'นายสมชาย มั่นคง',
      note: '',
      ...newRequestData,
    };

    const updated = [newReq, ...leaveRequests];
    setLeaveRequests(updated);

    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `ยื่นคำขอ${newReq.type}สำเร็จ`,
      description: `คำขอลาวันที่ ${newReq.dateRange} รอการอนุมัติจากผู้จัดการ`,
      time: 'เมื่อสักครู่',
      read: false,
      type: 'pending',
    };
    setNotifications([newNotif, ...notifications]);

    setIsRequestModalOpen(false);
    return newReq;
  };

  // Approve a request
  const approveLeaveRequest = (requestId, approverNote = 'อนุมัติเรียบร้อย') => {
    const updated = leaveRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'อนุมัติ',
          approvedDate: 'วันนี้',
          note: approverNote,
        };
      }
      return r;
    });

    setLeaveRequests(updated);
    recalculateQuotas(updated);

    const target = leaveRequests.find((r) => r.id === requestId);
    if (target) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: `คำขอ${target.type}ได้รับการอนุมัติ`,
        description: `คำขอวันที่ ${target.dateRange} ได้รับการอนุมัติเรียบร้อย`,
        time: 'เมื่อสักครู่',
        read: false,
        type: 'approved',
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  // Reject a request
  const rejectLeaveRequest = (requestId, rejectReason = 'ไม่อนุมัติเนื่องจากมีงานด่วนในช่วงเวลาดังกล่าว') => {
    const updated = leaveRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'ไม่อนุมัติ',
          approvedDate: 'วันนี้',
          note: rejectReason,
        };
      }
      return r;
    });

    setLeaveRequests(updated);

    const target = leaveRequests.find((r) => r.id === requestId);
    if (target) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: `คำขอ${target.type}ไม่ได้รับการอนุมัติ`,
        description: `เหตุผล: ${rejectReason}`,
        time: 'เมื่อสักครู่',
        read: false,
        type: 'rejected',
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  // Cancel a request (by employee)
  const cancelLeaveRequest = (requestId) => {
    const updated = leaveRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'ยกเลิก',
        };
      }
      return r;
    });
    setLeaveRequests(updated);
    recalculateQuotas(updated);
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Login action
  const login = (email, password) => {
    if (!email) return false;
    let userToSet = initialUser;
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('somchai') || lowerEmail.includes('mgr')) {
      userToSet = approverUser;
    } else if (lowerEmail.includes('panika')) {
      userToSet = initialUser;
    } else {
      userToSet = {
        ...initialUser,
        email,
        name: email.split('@')[0],
      };
    }
    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    localStorage.setItem('leaveflow_auth', JSON.stringify(true));
    localStorage.setItem('leaveflow_user', JSON.stringify(userToSet));
    return true;
  };

  // Logout action
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('leaveflow_auth', JSON.stringify(false));
    setActiveTab('dashboard');
  };

  // Reset to original mock data
  const resetToDefault = () => {
    localStorage.clear();
    setCurrentUser(initialUser);
    setLeaveRequests(initialLeaveRequests);
    setQuotas(initialQuotas);
    setNotifications(notificationsData);
    setActiveTab('dashboard');
    setIsAuthenticated(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <LeaveContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        quotas,
        leaveRequests,
        notifications,
        unreadCount,
        announcements: announcementsData,
        isRequestModalOpen,
        setIsRequestModalOpen,
        selectedLeaveDetail,
        setSelectedLeaveDetail,
        isAnnouncementModalOpen,
        setIsAnnouncementModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        cancelLeaveRequest,
        markAllNotificationsRead,
        markNotificationRead,
        resetToDefault,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeave() {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
}

