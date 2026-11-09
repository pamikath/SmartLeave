import React from 'react';
import { BarChart3, TrendingUp, PieChart, Users, Download, Printer } from 'lucide-react';
import { useLeave } from '../../context/LeaveContext';

export default function ReportsView() {
  const { quotas, leaveRequests } = useLeave();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-prompt">รายงานสถิติการลา (Leave Analytics)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            รายงานภาพรวมการใช้วันลา สถิติรายประเภท และแนวโน้มประจำปี 2568
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">วันลาที่ใช้ไปแล้วทั้งหมด</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 mt-2 font-prompt">
            {quotas.vacation.used + quotas.personal.used + quotas.sick.used} วัน
          </div>
          <p className="text-xs text-slate-400 mt-1">คิดเป็น 41.2% ของสิทธิการลาทั้งหมด</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">วันลาคงเหลือรวม</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#15803D] mt-2 font-prompt">
            {quotas.totalRemaining} วัน
          </div>
          <p className="text-xs text-slate-400 mt-1">จากสิทธิ์รวม 15 วันทำการ/ปี</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">อัตราการอนุมัติ</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2 font-prompt">
            94.5%
          </div>
          <p className="text-xs text-slate-400 mt-1">เวลาเฉลี่ยในการอนุมัติ: 4.2 ชั่วโมง</p>
        </div>
      </div>

      {/* Visual Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Simulated Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-800 font-prompt">
            สถิติการลาประจำเดือน (ปี 2568)
          </h3>
          <p className="text-xs text-slate-500">จำนวนวันลาที่พนักงานใช้แยกตามแต่ละเดือน</p>

          <div className="pt-4 flex items-end justify-between h-48 gap-2">
            {[
              { m: 'ม.ค.', v: 2 },
              { m: 'ก.พ.', v: 1 },
              { m: 'มี.ค.', v: 3 },
              { m: 'เม.ย.', v: 6 },
              { m: 'พ.ค.', v: 2 },
              { m: 'มิ.ย.', v: 1 },
              { m: 'ก.ค.', v: 4 },
              { m: 'ส.ค.', v: 3 },
              { m: 'ก.ย.', v: 2 },
              { m: 'ต.ค.', v: 3 },
              { m: 'พ.ย.', v: 4, active: true },
              { m: 'ธ.ค.', v: 0 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-slate-500 font-bold">{item.v > 0 ? item.v : '-'}</span>
                <div
                  style={{ height: `${item.v > 0 ? (item.v / 7) * 100 : 4}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    item.active
                      ? 'bg-[#155A32] shadow-md ring-2 ring-emerald-300'
                      : item.v > 0
                      ? 'bg-emerald-300 hover:bg-emerald-400'
                      : 'bg-slate-100'
                  }`}
                />
                <span className={`text-[10px] ${item.active ? 'font-bold text-[#155A32]' : 'text-slate-400'}`}>
                  {item.m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-800 font-prompt">
            สัดส่วนการลาแต่ละประเภท
          </h3>
          <p className="text-xs text-slate-500">สัดส่วนวันลาพักร้อน ลากิจ และลาป่วย</p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>ลาพักร้อน (Vacation Leave)</span>
                </span>
                <span>{quotas.vacation.used} จาก 10 วัน ({Math.round((quotas.vacation.used / 10) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(quotas.vacation.used / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>ลากิจส่วนตัว (Personal Leave)</span>
                </span>
                <span>{quotas.personal.used} จาก 5 วัน ({Math.round((quotas.personal.used / 5) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(quotas.personal.used / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>ลาป่วย (Sick Leave)</span>
                </span>
                <span>{quotas.sick.used} จาก 10 วัน ({Math.round((quotas.sick.used / 10) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(quotas.sick.used / 10) * 100}%` }}
                />
              </div>
            </div>

            {quotas.maternity && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <span>ลาคลอดบุตร (Maternity Leave)</span>
                  </span>
                  <span>{quotas.maternity.used} จาก 98 วัน ({Math.round((quotas.maternity.used / 98) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(quotas.maternity.used / 98) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

