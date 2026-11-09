import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Check,
  X,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useLeave } from '../../context/LeaveContext';

export default function ApproverView() {
  const {
    currentUser,
    switchRole,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    setSelectedLeaveDetail,
  } = useLeave();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'
  const [remarks, setRemarks] = useState({});

  const pendingRequests = leaveRequests.filter((r) => r.status === 'รออนุมัติ');

  const handleApprove = (id) => {
    const remark = remarks[id] || 'อนุมัติเรียบร้อย';
    approveLeaveRequest(id, remark);
  };

  const handleReject = (id) => {
    const remark = remarks[id] || 'ไม่อนุมัติเนื่องจากมีภารกิจงานเร่งด่วน';
    rejectLeaveRequest(id, remark);
  };

  return (
    <div className="space-y-6">
      {/* Banner if currently viewing as employee */}
      {currentUser.role !== 'approver' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">โหมดทดสอบระบบสำหรับผู้จัดการ:</span> ปัจจุบันคุณเข้าสู่ระบบในชื่อพนักงาน (นางสาวพนิกา) คลิกปุ่มด้านขวาเพื่อสลับเป็นผู้จัดการ (นายสมชาย) เพื่ออนุมัติคำขอ
            </div>
          </div>
          <button
            onClick={() => switchRole('approver')}
            className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            สลับเป็นผู้จัดการ (นายสมชาย)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-prompt">
            ระบบพิจารณาอนุมัติคำขอลา (Approver Portal)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ตรวจสอบ อนุมัติ หรือปฏิเสธคำขอลาของพนักงานในสังกัด
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>รอพิจารณา {pendingRequests.length} รายการ</span>
          </div>
        </div>
      </div>

      {/* Pending Queue */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-800">
              รายการที่รอการพิจารณา ({pendingRequests.length})
            </h3>
          </div>
        </div>

        <div className="p-6">
          {pendingRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-slate-600">ไม่มีคำขอที่รอการพิจารณาในขณะนี้</p>
              <p className="text-xs">ทุกคำขอได้รับการตรวจสอบเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-900 text-sm">
                        {req.employeeName}
                      </span>
                      <span className="text-xs text-slate-400">({req.department})</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {req.type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        <strong className="text-slate-700">ช่วงเวลา:</strong> {req.dateRange} ({req.days} วัน)
                      </span>
                      <span>
                        <strong className="text-slate-700">ผู้ปฏิบัติงานแทน:</strong> {req.substitute || 'ไม่มี'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{req.reason}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>ไม่อนุมัติ</span>
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#155A32] hover:bg-[#114929] text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>อนุมัติคำขอ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

