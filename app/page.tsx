"use client";

import React, { useState, useEffect } from "react";
import { decryptLogInternalAES } from "./helpers/crypto";

interface LogEntry {
  ID: string;
  NIK: number;
  Nama: string;
  TempatLahir: string;
  TanggalLahir: string;
  JenisKelamin: string;
  GolonganDarah: string;
  Alamat: string;
  RT: string;
  RW: string;
  Kelurahan: string;
  Kecamatan: string;
  Kabupaten: string;
  Provinsi: string;
  Agama: string;
  StatusPerkawinan: string;
  Pekerjaan: string;
  Kewarganegaraan: string;
  BerlakuHingga: string;
  FotoBase64: string;
  NewPhotoBase64: string;
  TandaTanganBase64: string;
  BiometrikKiriBase64: string;
  BiometrikKananBase64: string;
  IsVerifyFingerPrint: boolean;
  IsActivateMobileBank: boolean;
  IsVerifyFace: boolean;
  Duration: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

interface ApiResponse {
  status_code: number;
  data: LogEntry[];
  message: string;
  trace_id: string;
}

export default function LogPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/biod/v1/log_internal");
        const data = await res.json();
        const decryptedJson = await decryptLogInternalAES(data.data as string);
        const decryptedData = JSON.parse(decryptedJson);
        const transformed = {
          ...data,
          data: decryptedData,
        };
        setData(transformed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 dark:text-slate-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-red-500">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Log Internal BIOD Sepakat
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Menampilkan log response API
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 shadow-lg shadow-blue-900/5 rounded-xl overflow-hidden border border-blue-100 dark:border-slate-700">
          <div className="p-4 border-b border-blue-100 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="flex gap-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                Status: {data.status_code}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Message: {data.message}
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total Data: {data.data.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-blue-50/80 dark:bg-slate-900/50 uppercase font-semibold text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Status Verifikasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 dark:divide-slate-700">
                {data.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-12 h-12 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        <span className="font-medium">
                          Tidak ada data log yang tersedia
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.data.map((item) => (
                    <React.Fragment key={item.ID}>
                    <tr
                      className={`hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                        expandedRow === item.ID
                          ? "bg-blue-50/80 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => toggleRow(item.ID)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.CreatedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                        {item.NIK}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {item.Nama}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {item.IsVerifyFace && (
                            <StatusBadge label="Face" active={true} />
                          )}
                          {item.IsVerifyFingerPrint && (
                            <StatusBadge label="Finger" active={true} />
                          )}
                          {!item.IsVerifyFace && !item.IsVerifyFingerPrint && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm focus:outline-none transition-colors">
                          {expandedRow === item.ID ? "Tutup" : "Detail"}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === item.ID && (
                      <tr className="bg-blue-50/30 dark:bg-slate-900/30">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Personal Info */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-900 dark:text-blue-100 border-b border-blue-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Data Pribadi
                              </h3>

                              {item.FotoBase64 ? (
                                <div className="mb-4">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                                    Foto
                                  </span>
                                  <img
                                    src={`data:image/png;base64,${item.FotoBase64}`}
                                    alt="Foto"
                                    className="w-32 h-40 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() =>
                                      setSelectedImage({
                                        src: `data:image/png;base64,${item.FotoBase64}`,
                                        title: "Foto",
                                      })
                                    }
                                  />
                                </div>
                              ) : (
                                <DetailItem label="Foto" value="Tidak ada foto" />
                              )}

                              <DetailItem
                                label="Tempat Lahir"
                                value={item.TempatLahir}
                              />
                              <DetailItem
                                label="Tanggal Lahir"
                                value={new Date(
                                  item.TanggalLahir
                                ).toLocaleDateString()}
                              />
                              <DetailItem
                                label="Jenis Kelamin"
                                value={item.JenisKelamin}
                              />
                              <DetailItem
                                label="Golongan Darah"
                                value={item.GolonganDarah}
                              />
                              <DetailItem label="Agama" value={item.Agama} />
                              <DetailItem
                                label="Status Perkawinan"
                                value={item.StatusPerkawinan}
                              />
                              <DetailItem
                                label="Pekerjaan"
                                value={item.Pekerjaan}
                              />
                              <DetailItem
                                label="Kewarganegaraan"
                                value={item.Kewarganegaraan}
                              />
                              <DetailItem
                                label="Berlaku Hingga"
                                value={new Date(
                                  item.BerlakuHingga
                                ).toLocaleDateString()}
                              />
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-900 dark:text-blue-100 border-b border-blue-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Alamat
                              </h3>
                              <DetailItem label="Alamat" value={item.Alamat} />
                              <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="RT" value={item.RT} />
                                <DetailItem label="RW" value={item.RW} />
                              </div>
                              <DetailItem
                                label="Kelurahan"
                                value={item.Kelurahan}
                              />
                              <DetailItem
                                label="Kecamatan"
                                value={item.Kecamatan}
                              />
                              <DetailItem
                                label="Kabupaten"
                                value={item.Kabupaten}
                              />
                              <DetailItem
                                label="Provinsi"
                                value={item.Provinsi}
                              />
                            </div>

                            {/* System Info & Biometrics */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-blue-900 dark:text-blue-100 border-b border-blue-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                  />
                                </svg>
                                System & Biometrik
                              </h3>
                              <DetailItem label="ID" value={item.ID} copyable />
                              <DetailItem
                                label="Duration"
                                value={formatDuration(item.Duration)}
                              />
                              <DetailItem
                                label="Created At"
                                value={new Date(item.CreatedAt).toLocaleString()}
                              />
                              <DetailItem
                                label="Updated At"
                                value={new Date(item.UpdatedAt).toLocaleString()}
                              />
                              {item.DeletedAt && (
                                <DetailItem
                                  label="Deleted At"
                                  value={new Date(
                                    item.DeletedAt
                                  ).toLocaleString()}
                                />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-lg max-w-3xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg dark:text-white">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full h-auto mx-auto rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(ms: number) {
  if (ms < 1000) {
    return `${ms} ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} jam ${remainingMinutes} menit ${remainingSeconds} detik`;
  }

  if (minutes > 0) {
    return `${minutes} menit ${remainingSeconds} detik`;
  }

  return `${(ms / 1000).toFixed(2)} detik`;
}

function DetailItem({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string | number | null;
  copyable?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-200 break-all flex items-center gap-2">
        {value || "-"}
        {copyable && value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(String(value));
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Copy"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        active
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
          active ? "bg-green-600" : "bg-red-600"
        }`}
      ></span>
      {label}
    </span>
  );
}

function Badge({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-zinc-700">
        {label}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800/50"
    >
      {label}
    </button>
  );
}
