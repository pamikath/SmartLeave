import React, { useState } from 'react';
import { X, Calendar, User, FileText, CheckCircle, Clock, XCircle, AlertTriangle, Check, Ban, Printer } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

export default function LeaveDetailModal() {
  const {
    selectedLeaveDetail,
    setSelectedLeaveDetail,
    currentUser,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
  } = useLeave();

  const [approverRemark, setApproverRemark] = useState('');

  if (!selectedLeaveDetail) return null;

  const req = selectedLeaveDetail;
  const isPending = req.status === 'รออนุมัติ';
  const isApprover = currentUser.role === 'approver';

  const handleApprove = () => {
    approveLeaveRequest(req.id, approverRemark || 'อนุมัติเรียบร้อย');
    setSelectedLeaveDetail(null);
  };

  const handleReject = () => {
    rejectLeaveRequest(req.id, approverRemark || 'ไม่อนุมัติเนื่องจากมีภารกิจจำเป็น');
    setSelectedLeaveDetail(null);
  };

  const handleCancel = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำขอนี้?')) {
      cancelLeaveRequest(req.id);
      setSelectedLeaveDetail(null);
    }
  };

  const handlePrintSlip = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ใบคำขอลา - ${req.id}</title>
          <style>
            body { font-family: 'Sarabun', 'Prompt', sans-serif; padding: 40px; color: #1e293b; max-width: 750px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #15803d; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 22px; font-weight: bold; color: #14532d; margin: 0; }
            .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; color: #0f172a; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; }
            .field-label { color: #64748b; font-weight: 500; }
            .field-val { font-weight: 600; color: #0f172a; }
            .reason-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 5px; font-size: 14px; }
            .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 50px; text-align: center; font-size: 13px; }
            .sig-line { border-bottom: 1px dotted #94a3b8; height: 40px; margin-bottom: 8px; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #dcfce7; color: #15803d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">LeaveFlow - แบบฟอร์มขออนุมัติการลา</h1>
            <p class="subtitle">ระบบจัดการการลาอิเล็กทรอนิกส์ (Electronic Leave Slip)</p>
          </div>
          <div style="text-align: right; margin-bottom: 15px; font-size: 13px; color: #64748b;">
            เลขที่เอกสาร: <strong>${req.id}</strong> | วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}
          </div>
          <div class="section">
            <div class="section-title">ข้อมูลพนักงาน</div>
            <div class="grid">
              <div><span class="field-label">ชื่อ-นามสกุล:</span> <span class="field-val">${req.employeeName}</span></div>
              <div><span class="field-label">แผนก/ฝ่าย:</span> <span class="field-val">${req.department}</span></div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">รายละเอียดการลา</div>
            <div class="grid">
              <div><span class="field-label">ประเภทการลา:</span> <span class="field-val">${req.type}</span></div>
              <div><span class="field-label">สถานะคำขอ:</span> <span class="status-badge">${req.status}</span></div>
              <div><span class="field-label">ช่วงวันที่ลา:</span> <span class="field-val">${req.dateRange}</span></div>
              <div><span class="field-label">จำนวนวันลา:</span> <span class="field-val">${req.days} วัน</span></div>
              <div><span class="field-label">ผู้ปฏิบัติงานแทน:</span> <span class="field-val">${req.substitute || 'ไม่มี'}</span></div>
              <div><span class="field-label">ผู้อนุมัติ:</span> <span class="field-val">${req.approver || 'นายสมชาย มั่นคง'}</span></div>
            </div>
            <div style="margin-top: 15px;">
              <span class="field-label">เหตุผลการลา:</span>
              <div class="reason-box">${req.reason || 'ไม่ได้ระบุเหตุผล'}</div>
            </div>
          </div>
          <div class="signatures">
            <div>
              <div class="sig-line"></div>
              <div>( ${req.employeeName} )</div>
              <div style="color: #64748b; font-size: 11px;">ผู้ยื่นคำขอลา</div>
            </div>
            <div>
              <div class="sig-line"></div>
              <div>( ${req.substitute || '...........................................'} )</div>
              <div style="color: #64748b; font-size: 11px;">ผู้ปฏิบัติงานแทน</div>
            </div>
            <div>
              <div class="sig-line"></div>
              <div>( ${req.approver || 'นายสมชาย มั่นคง'} )</div>
              <div style="color: #64748b; font-size: 11px;">ผู้อนุมัติ / ผู้บังคับบัญชา</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#123E24] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-emerald-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-prompt">รายละเอียดคำขอลา</h3>
              <p className="text-[11px] text-emerald-200/80">รหัสคำขอ: {req.id}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedLeaveDetail(null)}
            className="p-1.5 rounded-full hover:bg-white/15 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Top Status & Type Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">ประเภทการลา</span>
              <h4 className="text-base font-bold text-slate-800">{req.type}</h4>
            </div>
            <div>
              {req.status === 'อนุมัติ' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>อนุมัติแล้ว</span>
                </span>
              )}
              {req.status === 'รออนุมัติ' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>รอการอนุมัติ</span>
                </span>
              )}
              {req.status === 'ไม่อนุมัติ' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626]">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>ไม่อนุมัติ</span>
                </span>
              )}
              {req.status === 'ยกเลิก' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
                  <Ban className="w-3.5 h-3.5" />
                  <span>ยกเลิกแล้ว</span>
                </span>
              )}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">ผู้ยื่นคำขอ</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{req.employeeName}</span>
              <span className="text-[11px] text-slate-500">{req.department}</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">จำนวนวันลา</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{req.days} วัน</span>
              <span className="text-[11px] text-slate-500">{req.dateRange}</span>
            </div>
          </div>

          {/* Reason */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-medium block mb-1">เหตุผลการลา</span>
            <p className="text-slate-800 text-xs sm:text-sm font-normal leading-relaxed">
              {req.reason || 'ไม่ได้ระบุเหตุผล'}
            </p>
          </div>

          {/* Substitute Colleague & Approver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">ผู้ปฏิบัติงานแทน</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {req.substitute || 'ไม่มี'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">ผู้อนุมัติ</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {req.approver || 'นายสมชาย มั่นคง'}
              </span>
            </div>
          </div>

          {/* Attachment */}
          {req.attachment && (
            <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-600">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{req.attachment}</span>
              </div>
              <span className="text-emerald-700 font-medium cursor-pointer hover:underline">
                ดาวน์โหลด
              </span>
            </div>
          )}

          {/* Approver Note */}
          {req.note && (
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
              <span className="font-semibold block">ความเห็นจากผู้อนุมัติ:</span>
              <p className="mt-0.5">{req.note}</p>
            </div>
          )}

          {/* If Approver Mode & Pending -> Show Action Input & Buttons */}
          {isApprover && isPending && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block font-semibold text-slate-700 text-xs">
                ข้อคิดเห็น / หมายเหตุจากผู้อนุมัติ
              </label>
              <input
                type="text"
                value={approverRemark}
                onChange={(e) => setApproverRemark(e.target.value)}
                placeholder="ระบุข้อความถึงผู้ขอลา..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>ไม่อนุมัติ</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-[#155A32] text-white hover:bg-[#124A29] font-semibold text-xs transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>อนุมัติคำขอ</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrintSlip}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>พิมพ์ใบลา</span>
            </button>
            {!isApprover && isPending && (
              <button
                onClick={handleCancel}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
              >
                ยกเลิกคำขอนี้
              </button>
            )}
          </div>
          <button
            onClick={() => setSelectedLeaveDetail(null)}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

