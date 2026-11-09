import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

export default function CalendarWidget() {
  const { setSelectedLeaveDetail, leaveRequests } = useLeave();
  const [selectedDayEvent, setSelectedDayEvent] = useState(null);

  // Month navigation: 0 = November 2568 (matching screenshot)
  const [monthOffset, setMonthOffset] = useState(0);

  const monthsThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Base is November 2568 (month index 10)
  const baseMonthIndex = 10;
  const currentMonthIndex = (baseMonthIndex + monthOffset + 120) % 12;
  const currentYearBE = 2568 + Math.floor((baseMonthIndex + monthOffset) / 12);

  // Known leaves on November 2568 matching design
  const dayEvents = {
    3: { type: 'personal', dot: 'orange', dotPosition: 'top', label: 'ลากิจส่วนตัว (เตรียมการ)', badge: 'รออนุมัติ' },
    5: { type: 'personal', dot: 'blue', dotPosition: 'bottom', label: 'ลากิจส่วนตัว (ติดต่อราชการ)', badge: 'รออนุมัติ' },
    12: { type: 'sick', style: 'green-circle', label: 'ลาป่วย (มีไข้สูง)', badge: 'อนุมัติ' },
    14: { type: 'vacation', style: 'mint-box', dot: 'green', dotPosition: 'bottom', label: 'ลาพักร้อน (เที่ยวหัวหิน)', badge: 'อนุมัติ' },
    20: { type: 'personal', dot: 'blue', dotPosition: 'bottom', label: 'ลาพักร้อน / ลากิจส่วนตัว', badge: 'อนุมัติ' },
    21: { type: 'vacation', dot: 'green', dotPosition: 'bottom', label: 'ลาพักร้อน', badge: 'อนุมัติ' },
    22: { type: 'vacation', dot: 'green', dotPosition: 'bottom', label: 'ลาพักร้อน', badge: 'อนุมัติ' },
    28: { type: 'vacation', dot: 'green', dotPosition: 'bottom', label: 'ลาพักร้อน (พาแม่หาหมอ)', badge: 'อนุมัติ' },
  };

  const daysOfWeek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  // Calendar matrix for November 2568 (30 days, Nov 1 is Saturday)
  const calendarCells = [
    // Row 1: Oct 26 - 31, Nov 1
    { day: 26, isCurrentMonth: false },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    // Row 2: Nov 2 - 8
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true, event: dayEvents[3] },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true, event: dayEvents[5] },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    // Row 3: Nov 9 - 15
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true, event: dayEvents[12] },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true, event: dayEvents[14] },
    { day: 15, isCurrentMonth: true },
    // Row 4: Nov 16 - 22
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true, event: dayEvents[20] },
    { day: 21, isCurrentMonth: true, event: dayEvents[21] },
    { day: 22, isCurrentMonth: true, event: dayEvents[22] },
    // Row 5: Nov 23 - 29
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true, event: dayEvents[28] },
    { day: 29, isCurrentMonth: true },
    // Row 6: Nov 30, Dec 1 - 6
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
    { day: 5, isCurrentMonth: false },
    { day: 6, isCurrentMonth: false },
  ];

  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    if (cell.event) {
      setSelectedDayEvent({
        day: cell.day,
        month: monthsThai[currentMonthIndex],
        year: currentYearBE,
        ...cell.event,
      });
    } else {
      setSelectedDayEvent(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
      {/* Header with Title and Month Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-[#134226]">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-base font-prompt">
            ปฏิทินการลา
          </h3>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-slate-700">
          <button
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-1 tracking-tight">
            {monthsThai[currentMonthIndex]} {currentYearBE}
          </span>
          <button
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="เดือนถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-slate-600">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {calendarCells.map((cell, idx) => {
          const isSelected = selectedDayEvent && selectedDayEvent.day === cell.day && cell.isCurrentMonth;
          return (
            <div
              key={idx}
              onClick={() => handleCellClick(cell)}
              className={`relative h-9 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer select-none ${
                !cell.isCurrentMonth
                  ? 'text-slate-300 font-light'
                  : 'text-slate-700 font-medium hover:bg-slate-50'
              } ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}
            >
              {/* Special Badge Styling */}
              {cell.event?.style === 'green-circle' && cell.isCurrentMonth ? (
                <div className="w-7 h-7 rounded-full bg-[#185331] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {cell.day}
                </div>
              ) : cell.event?.style === 'mint-box' && cell.isCurrentMonth ? (
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-semibold text-xs border border-emerald-300/40">
                  {cell.day}
                </div>
              ) : (
                <span className="text-xs">{cell.day}</span>
              )}

              {/* Status Indicator Dots */}
              {cell.isCurrentMonth && cell.event && cell.event.style !== 'green-circle' && (
                <div
                  className={`absolute flex space-x-0.5 ${
                    cell.event.dotPosition === 'top' ? 'top-1' : 'bottom-0.5'
                  }`}
                >
                  {cell.event.dot === 'orange' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                  {cell.event.dot === 'blue' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ring-1 ring-white" />
                  )}
                  {cell.event.dot === 'green' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ring-1 ring-white" />
                  )}
                  {cell.event.dot === 'red' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-white" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Day Details Popover / Banner if clicked */}
      {selectedDayEvent && (
        <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs animate-in fade-in">
          <div>
            <span className="font-bold text-emerald-900">
              วันที่ {selectedDayEvent.day} {selectedDayEvent.month}:
            </span>{' '}
            <span className="text-slate-700">{selectedDayEvent.label}</span>
          </div>
          <span className="px-2 py-0.5 bg-white text-emerald-800 rounded-full font-medium text-[10px] shadow-xs">
            {selectedDayEvent.badge}
          </span>
        </div>
      )}

      {/* Legend Footer */}
      <div className="flex items-center justify-center space-x-4 pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-600">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>วันลาพักร้อน</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>ลากิจส่วนตัว</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>ลาป่วย</span>
        </div>
      </div>
    </div>
  );
}

