import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  AlertCircle,
  Coffee,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userEmail: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('admin@kopitepidelta.id');
  const [password, setPassword] = useState('delta2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage('Silakan isi email dan kata sandi admin.');
      setIsLoading(false);
      return;
    }

    try {
      if (supabaseReady) {
        // Otentikasi sungguhan melalui Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error.message || 'Email atau kata sandi tidak sesuai di Supabase.');
          setIsLoading(false);
          return;
        }

        if (data.user) {
          onSuccessLogin(data.user.email || email);
          onClose();
        }
      } else {
        // Otentikasi Simulasi Prototype (ketika Supabase belum dikonfigurasi)
        // Demo credentials check
        if (password.length >= 6) {
          onSuccessLogin(email.trim());
          onClose();
        } else {
          setErrorMessage('Kata sandi simulasi minimal 6 karakter.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@kopitepidelta.id');
    setPassword('delta2026!');
    onSuccessLogin('admin@kopitepidelta.id');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#EFE9E1] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-[#1C120C] text-[#FAF7F2] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#A8988C] hover:text-[#FAF7F2] p-1.5 rounded-lg hover:bg-[#2A1B12] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-[#C59A6F] text-[#1C120C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6 text-[#1C120C]" />
          </div>

          <h3 className="font-serif-brand text-2xl font-bold text-[#FAF7F2]">
            Autentikasi Admin
          </h3>
          <p className="text-xs text-[#A8988C] mt-1">
            Panel operasional & analitik Kopi Tepi Delta dilindungi hak akses
          </p>
        </div>

        {/* Database Status Alert Banner */}
        <div className="p-4 border-b border-[#F2ECE4] text-xs">
          {supabaseReady ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Supabase Auth Aktif</strong>
                <span>Kredensial database terdeteksi. Autentikasi diproses melalui server Supabase PostgreSQL.</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#FAF3EA] border border-[#E0D2C3] rounded-xl text-[#523E32] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#8C582B] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#1C120C]">
                  <span>Mode Simulasi (Supabase Belum Dihubungkan)</span>
                </div>
                <p className="text-[11px] text-[#6B5749] mt-0.5 leading-relaxed">
                  Kredensial Supabase belum diisi di <code className="bg-white/80 px-1 py-0.5 rounded font-mono">.env</code>. Anda dapat masuk menggunakan <strong>Akun Demo</strong> untuk menguji prototype tugas kuliah.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-[#1C120C] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Email Pengelola / Barista</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kopitepidelta.id"
              className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3.5 py-2.5 text-xs text-[#261912] focus:ring-1 focus:ring-[#C59A6F] focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#1C120C] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>Kata Sandi</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF7F2] border border-[#E0D2C3] rounded-xl px-3.5 py-2.5 text-xs text-[#261912] focus:ring-1 focus:ring-[#C59A6F] focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#1C120C] hover:bg-[#332117] text-[#FAF7F2] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C59A6F]" />
                  <span>Masuk ke Dashboard Admin</span>
                </>
              )}
            </button>

            {!supabaseReady && (
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5C7B7] bg-[#FAF7F2] hover:bg-[#EFE9E1] text-[#7A695D] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Masuk Cepat sebagai Admin Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Footer info */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE9E1] text-center text-[10px] text-[#8C7A6B]">
          Sistem Keamanan Hak Akses Peran Berjenjang • Kopi Tepi Delta
        </div>
      </div>
    </div>
  );
};
