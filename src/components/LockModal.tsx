import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle, Unlock } from 'lucide-react';
import { Note } from '../types';

interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  mode: 'set' | 'unlock';
  onSuccess: (pin?: string) => void;
}

export const LockModal: React.FC<LockModalProps> = ({
  isOpen,
  onClose,
  note,
  mode,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !note) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length < 4) {
      setError('Mã PIN phải có ít nhất 4 chữ số');
      return;
    }

    if (mode === 'set') {
      if (pin !== confirmPin) {
        setError('Mã xác nhận không khớp. Vui lòng nhập lại.');
        return;
      }
      onSuccess(pin);
      handleClose();
    } else {
      // unlock check
      if (note.pinCode && note.pinCode !== pin) {
        setError('Mã PIN không đúng. Vui lòng thử lại.');
        return;
      }
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    setPin('');
    setConfirmPin('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={handleClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden z-10 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              {mode === 'set' ? <Lock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {mode === 'set' ? 'Khóa bảo mật ghi chú' : 'Mở khóa ghi chú'}
              </h2>
              <p className="text-xs text-neutral-500">
                {mode === 'set' ? 'Đặt mã PIN bảo vệ nội dung riêng tư' : 'Nhập mã PIN đã đặt'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {mode === 'set' ? 'Nhập mã PIN (4-6 số):' : 'Nhập mã PIN:'}
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-lg font-mono px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
            />
          </div>

          {mode === 'set' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Xác nhận lại mã PIN:
              </label>
              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] text-lg font-mono px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs cursor-pointer"
            >
              {mode === 'set' ? 'Xác nhận khóa' : 'Mở khóa'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
