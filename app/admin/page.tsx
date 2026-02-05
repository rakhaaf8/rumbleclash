"use client";

import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [fighters, setFighters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari Singapore
  const fetchFighters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fighters")
      .select("*")
      .order("created_at", { ascending: false }); // Pendaftar terbaru di atas

    if (error) {
      alert("Gagal ambil data: " + error.message);
    } else {
      setFighters(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFighters();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER ADMIN */}
        <div className="flex justify-between items-center mb-10 border-b-4 border-rumble-red pb-6">
          <h1 className="text-4xl font-black uppercase italic">
            ADMIN <span className="text-rumble-red">DASHBOARD</span>
          </h1>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-gray-500">Total Pendaftar</p>
            <p className="text-3xl font-black text-rumble-red">{fighters.length} / 40</p>
          </div>
        </div>

        {/* TOMBOL REFRESH */}
        <button 
          onClick={fetchFighters}
          className="mb-6 bg-zinc-800 hover:bg-rumble-red px-6 py-2 font-bold uppercase italic text-xs transition-all"
        >
          {loading ? "MEMUAT..." : "REFRESH DATA"}
        </button>

        {/* TABEL DATA */}
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-900 text-rumble-red uppercase text-xs font-black italic">
              <tr>
                <th className="p-4 border-b border-zinc-800">Nama</th>
                <th className="p-4 border-b border-zinc-800">Kelas</th>
                <th className="p-4 border-b border-zinc-800">Info Fisik</th>
                <th className="p-4 border-b border-zinc-800">Camp</th>
                <th className="p-4 border-b border-zinc-800">Kontak</th>
                <th className="p-4 border-b border-zinc-800">Bukti Bayar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {fighters.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-900/50 border-b border-zinc-800 transition-colors">
                  <td className="p-4 font-bold uppercase italic">
                    {f.nama} 
                    <span className="block text-[10px] text-gray-500">{f.is_atlet ? "ATLET" : "NON-ATLET"}</span>
                  </td>
                  <td className="p-4 font-black text-rumble-red">{f.kelas_bb}</td>
                  <td className="p-4 text-xs">
                    {f.berat}KG / {f.tinggi}CM<br/>
                    {f.umur} TAHUN
                  </td>
                  <td className="p-4 uppercase italic font-bold">{f.asal_camp}</td>
                  <td className="p-4">
                    <a href={`https://wa.me/${f.whatsapp}`} target="_blank" className="text-blue-400 hover:underline">WA</a>
                    {" | "}
                    <a href={`https://instagram.com/${f.instagram.replace('@','')}`} target="_blank" className="text-pink-400 hover:underline">IG</a>
                  </td>
                  <td className="p-4 text-center">
                    {f.bukti_bayar_url ? (
                      <a 
                        href={f.bukti_bayar_url} 
                        target="_blank" 
                        className="bg-white text-black px-3 py-1 text-[10px] font-black uppercase italic hover:bg-rumble-red hover:text-white transition-all"
                      >
                        LIHAT FOTO
                      </a>
                    ) : (
                      <span className="text-gray-600">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fighters.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500 uppercase italic font-bold">
            Belum ada pendaftar yang masuk ring.
          </div>
        )}
      </div>
    </main>
  );
}