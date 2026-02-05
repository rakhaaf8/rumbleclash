"use client";

import { supabase } from "./utils/supabase";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    umur: "",
    berat: "",
    tinggi: "",
    instagram: "",
    whatsapp: "",
    is_atlet: false,
    kelas_bb: "52KG",
    asal_camp: "",
    pernah_tanding: false,
    jumlah_tanding: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State untuk Pop-up

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Upload bukti pembayaran dulu!");

    setLoading(true);
    try {
      // 1. Upload Foto ke Singapore
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `payments/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);

      // 2. Masukkan Data ke Database
      const { error: dbError } = await supabase.from('fighters').insert([{ 
        ...formData,
        bukti_bayar_url: publicUrl,
        umur: parseInt(formData.umur),
        jumlah_tanding: formData.pernah_tanding ? parseInt(formData.jumlah_tanding) : null
      }]);

      if (dbError) throw dbError;

      // 3. Tampilkan Pop-up Sukses
      setIsSuccess(true);

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-rumble-red scroll-smooth font-sans">
      
      {/* CSS KHUSUS SMOOTH SCROLL */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>

      {/* HALAMAN 1: HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 border-b-8 border-rumble-red">
        <div className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.3] z-0" style={{ backgroundImage: "url('/bg3.jpg')" }}></div>
        <div className="relative z-10">
          <h1 className="text-7xl md:text-[10rem] font-black uppercase italic leading-none tracking-tighter">
            RUMBLE<br /><span className="text-rumble-red">CLASH</span>
          </h1>
          <a href="#rules" className="mt-12 inline-block bg-rumble-red py-4 px-10 font-black uppercase italic text-xl hover:bg-white hover:text-black transition-all transform hover:-skew-x-6">
            BACA GUIDE BOOK
          </a>
        </div>
      </section>

      {/* HALAMAN 2: GUIDE BOOK */}
      <section id="rules" className="relative min-h-screen py-20 px-6 flex flex-col justify-center border-b-8 border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.2] z-0" style={{ backgroundImage: "url('/bg.jpg')" }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-16 text-center tracking-tighter">
            GUIDE <span className="text-rumble-red">BOOK</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 text-gray-200">
            <div className="border-l-4 border-rumble-red pl-6 bg-black/60 p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black uppercase italic text-rumble-red mb-4">A. Persyaratan Administrasi</h3>
              <ul className="space-y-2 font-bold uppercase italic text-sm md:text-base">
                <li>• Mengisi formulir pendaftaran resmi panitia</li>
                <li>• Fotokopi KTP/Pelajar/Mahasiswa (Menyusul)</li>
                <li>• Foto terbaru (Topless, hadap depan) (Menyusul)</li>
                <li>• Membayar biaya pendaftaran</li>
                <li>• Wajib memiliki Rekor Book</li>
              </ul>
            </div>
            <div className="border-l-4 border-rumble-red pl-6 bg-black/60 p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black uppercase italic text-rumble-red mb-4">B. Persyaratan Teknis</h3>
              <ul className="space-y-2 font-bold uppercase italic text-sm md:text-base">
                <li>• Lolos timbang badan sesuai jadwal</li>
                <li>• Medical check up dokter panitia</li>
                <li>• Wajib: Headguard, Sarung Tinju panitia</li>
                <li>• Wajib: Trunk & Singlet, Pelindung Kemaluan</li>
                <li>• Pelatih wajib memiliki ID Official</li>
              </ul>
            </div>
            <div className="border-l-4 border-rumble-red pl-6 bg-black/60 p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black uppercase italic text-rumble-red mb-4">C. Persyaratan Kesehatan</h3>
              <ul className="space-y-2 font-bold uppercase italic text-sm md:text-base">
                <li>• Surat keterangan sehat dokter (Menyusul)</li>
                <li>• Bebas riwayat Jantung, Epilepsi, Cedera Kepala</li>
                <li>• Lulus Pre-Fight Medical Check</li>
                <li>• Tidak sedang skorsing medis</li>
              </ul>
            </div>
            <div className="border-l-4 border-rumble-red pl-6 bg-black/60 p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-black uppercase italic text-white mb-4">D. Ketentuan Tambahan</h3>
              <ul className="space-y-2 font-bold uppercase italic text-sm md:text-base text-gray-400">
                <li>• Wajib mengikuti Teknikal Meeting</li>
                <li>• Menyerahkan Rekor Book</li>
                <li>• Jika terdapat perubahan aturan, akan diinformasikan melalui WhatsApp</li>
              </ul>
              <a href="#register" className="mt-8 block w-full text-center bg-white text-black py-4 font-black uppercase italic hover:bg-rumble-red hover:text-white transition-all">
                DAFTAR SEKARANG
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HALAMAN 3: FORM REGISTRASI */}
      <section id="register" className="relative py-24 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.2] z-0" style={{ backgroundImage: "url('/bg2.jpg')" }}></div>

        <div className="relative z-10 max-w-2xl w-full bg-black/80 backdrop-blur-md p-8 border-2 border-rumble-red shadow-[15px_15px_0px_0px_#7b0d0d]">
          <h2 className="text-5xl font-black uppercase italic mb-10 text-center tracking-tighter">
            PENDAFTARAN <span className="text-rumble-red">FIGHTER</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required name="nama" placeholder="NAMA LENGKAP" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
              <input required name="umur" type="number" placeholder="UMUR" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
              <input required name="berat" type="number" placeholder="BERAT BADAN (KG)" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
              <input required name="tinggi" type="number" placeholder="TINGGI BADAN (CM)" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase italic text-rumble-red tracking-widest">Pilih Kelas Berat</label>
              <select name="kelas_bb" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white">
                {["52KG", "55KG", "57KG", "60KG", "62KG", "65KG", "67KG", "70KG", "72KG", "75KG", "77KG", "80KG", "82KG", "85KG"].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <input required name="asal_camp" placeholder="ASAL CAMP / GYM" onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />

            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="p-4 border border-zinc-800 bg-black/40">
                <p className="text-xs font-black uppercase italic mb-2">Pernah Bertanding?</p>
                <div className="flex gap-4 font-bold uppercase italic text-sm">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={formData.pernah_tanding} onChange={() => setFormData({...formData, pernah_tanding: true})} className="accent-rumble-red"/> YA</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={!formData.pernah_tanding} onChange={() => setFormData({...formData, pernah_tanding: false})} className="accent-rumble-red"/> BELUM</label>
                </div>
              </div>
              <div className="p-4 border border-zinc-800 bg-black/40">
                <p className="text-xs font-black uppercase italic mb-2">Kategori</p>
                <div className="flex gap-4 font-bold uppercase italic text-sm">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={formData.is_atlet} onChange={() => setFormData({...formData, is_atlet: true})} className="accent-rumble-red"/> ATLET</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={!formData.is_atlet} onChange={() => setFormData({...formData, is_atlet: false})} className="accent-rumble-red"/> NON-ATLET</label>
                </div>
              </div>
            </div>

            {formData.pernah_tanding && (
              <input required name="jumlah_tanding" type="number" placeholder="BERAPA KALI BERTANDING?" onChange={handleChange} className="w-full bg-black border-2 border-rumble-red p-4 outline-none font-black uppercase italic text-white animate-pulse" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required name="whatsapp" type="number" placeholder="NOMOR WHATSAPP (08...)" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
              <input required name="instagram" placeholder="INSTAGRAM (@...)" onChange={handleChange} className="bg-zinc-900 border border-zinc-800 p-4 outline-none focus:border-rumble-red font-bold uppercase italic text-white" />
            </div>

            <div className="p-6 border-2 border-dashed border-rumble-red bg-black/60 text-center">
              <p className="text-lg font-black uppercase italic text-rumble-red mb-1">BUKTI PEMBAYARAN (Rp 350.000)</p>
              <p className="text-xs font-bold uppercase italic text-gray-300 mb-4">BNI: 1931960147<br/>A.n Falsya Ari Niskhaira</p>
              <input type="file" required accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs font-bold uppercase italic file:bg-rumble-red file:text-white file:border-0 file:px-6 file:py-2 file:font-black file:uppercase file:italic cursor-pointer" />
            </div>

            <button disabled={loading} className="w-full bg-rumble-red py-6 font-black uppercase italic text-2xl shadow-[8px_8px_0px_0px_#fff] hover:bg-white hover:text-rumble-red transition-all active:translate-y-2 active:shadow-none disabled:opacity-50">
              {loading ? "MENGIRIM DATA..." : "SUBMIT PENDAFTARAN"}
            </button>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-[10px] font-bold uppercase italic text-gray-500 mb-2">Ada kendala atau pertanyaan?</p>
              <a href="https://wa.me/6281213515297" target="_blank" className="text-xs font-black uppercase italic text-white hover:text-rumble-red transition-colors">
                HUBUNGI PANITIA: 081213515297 (Jazmi)
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* POP-UP MODAL SUKSES */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-zinc-900 border-4 border-rumble-red p-8 text-center shadow-[20px_20px_0px_0px_#7b0d0d] animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-6">🥊</div>
            <h2 className="text-4xl font-black uppercase italic mb-4">PENDAFTARAN <span className="text-rumble-red">BERHASIL!</span></h2>
            <p className="font-bold uppercase italic text-gray-300 mb-8 leading-relaxed">
              Data kamu sudah mendarat di ring. Langkah terakhir, silakan bergabung ke grup koordinasi melalui tombol di bawah ini:
            </p>
            <a 
              href="https://chat.whatsapp.com/CcVxRM5P0cPKBqQKdRgO2N?mode=gi_t" 
              target="_blank"
              className="block w-full bg-green-600 hover:bg-green-500 text-white py-4 font-black uppercase italic text-xl transition-all shadow-[5px_5px_0px_0px_#fff] active:translate-y-1 active:shadow-none"
            >
              GABUNG GRUP WHATSAPP
            </a>
            <button onClick={() => window.location.reload()} className="mt-8 text-xs font-bold uppercase italic text-gray-500 hover:text-white underline">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      <footer className="py-10 text-center text-gray-600 font-black uppercase italic text-xs tracking-[0.5em]">
        © 2026 RumbleClash Boxing Event.
      </footer>
    </main>
  );
}