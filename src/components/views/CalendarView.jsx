import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, User, Info } from 'lucide-react';
import { useLeave } from '../../context/LeaveContext';

export default function CalendarView() {
  const { leaveRequests, setSelectedLeaveDetail, setIsRequestModalOpen } = useLeave();
  const [filterMode, setFilterMode] = useState('all'); // 'my' | 'all'
  const [monthOffset, setMonthOffset] = useState(0);

  const monthsThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const baseMonthIndex = 10; // November
  const currentMonthIndex = (baseMonthIndex + monthOffset + 120) % 12;
  const currentYearBE = 2568 + Math.floor((baseMonthIndex + monthOffset) / 12);

  // Leave schedules in November 2568
  const events = [
    { day: 3, person: 'นางสาวพนิกา', type: 'ลากิจส่วนตัว', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { day: 5, person: 'นางสาวพนิกา', type: 'ลากิจส่วนตัว', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { day: 12, person: 'นางสาวพนิกา', type: 'ลาป่วย', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { day: 14, person: 'นางสาวพนิกา', type: 'ลาพักร้อน', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { day: 18, person: 'นายอัครพล', type: 'ลาพักร้อน', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { day: 19, person: 'นายอัครพล', type: 'ลาพักร้อน', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { day: 20, person: 'นางสาวพนิกา', type: 'ลาพักร้อน', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { day: 20, person: 'นายอัครพล', type: 'ลาพักร้อน', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { day: 21, person: 'นางสาวพนิกา', type: 'ลาพักร้อน', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { day: 24, person: 'นางสาวณิชาภัทร', type: 'ลาป่วย', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    { day: 28, person: 'นางสาวพนิกา', type: 'ลาพักร้อน', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const days = [];
  // Previous month filler 26 - 31
  for (let d = 26; d <= 31; d++) {
    days.push({ day: d, isCurrent: false });
  }
  // Current month 1 - 30
  for (let d = 1; d <= 30; d++) {
    const dayEvents = events.filter((e) => {
      if (e.day !== d) return false;
      if (filterMode === 'my') return e.person.includes('พนิกา');
      return true;
    });
    days.push({ day: d, isCurrent: true, events: dayEvents });
  }
  // Next month filler 1 - 6
  for (let d = 1; d <= 6; d++) {
    days.push({ day: d, isCurrent: false });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-prompt">ปฏิทินการลาขององค์กร</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ดูตารางการลาของตนเองและบุคลากรในองค์กรแบบภาพรวม
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter toggle */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex space-x-1 shadow-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#155A32] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>ทีมทั้งหมด</span>
            </button>
            <button
              onClick={() => setFilterMode('my')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'my'
                  ? 'bg-[#155A32] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>เฉพาะฉัน</span>
            </button>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2 bg-[#155A32] hover:bg-[#114A29] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            + ขอลา
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-4">
        {/* Month bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-800 font-prompt">
              {monthsThai[currentMonthIndex]} {currentYearBE}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMonthOffset((p) => p - 1)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMonthOffset(0)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              วันนี้
            </button>
            <button
              onClick={() => setMonthOffset((p) => p + 1)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 py-2">
          {daysOfWeek.map((d, i) => (
            <div key={i} className={i === 0 || i === 6 ? 'text-red-400' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((item, idx) => (
            <div
              key={idx}
              className={`min-h-[90px] sm:min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                item.isCurrent
                  ? 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xs'
                  : 'bg-slate-50/50 border-slate-50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    item.isCurrent ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {item.day}
                </span>
                {item.events && item.events.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>

              {/* Event Chips */}
              <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                {item.events?.map((ev, i) => (
                  <div
                    key={i}
                    className={`px-1.5 py-0.5 rounded-lg text-[10px] font-medium border truncate ${ev.color}`}
                    title={`${ev.person} - ${ev.type}`}
                  >
                    {ev.person}: {ev.type}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

