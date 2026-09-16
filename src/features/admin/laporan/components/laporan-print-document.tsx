import type {
  AbsorptionMetrics,
  AbsorptionRow,
  AttendanceMetrics,
  AttendanceRow,
  LaporanOptions,
  RecruitmentMetrics,
  RecruitmentRow,
  ReportFilterState,
  ReportTabType,
  TracerStudyMetrics,
  TracerStudyRow,
} from '../laporan.types';

interface LaporanPrintDocumentProps {
  activeTab: ReportTabType;
  filters: ReportFilterState;
  options: LaporanOptions;
  rekrutmenData: { metrics: RecruitmentMetrics; data: RecruitmentRow[] };
  absensiData: { metrics: AttendanceMetrics; data: AttendanceRow[] };
  keterserapanData: { metrics: AbsorptionMetrics; data: AbsorptionRow[] };
  tracerData: { metrics: TracerStudyMetrics; data: TracerStudyRow[] };
  adminName?: string;
}

export function LaporanPrintDocument({
  activeTab,
  filters,
  options,
  rekrutmenData,
  absensiData,
  keterserapanData,
  tracerData,
  adminName = 'Administrator BKK',
}: LaporanPrintDocumentProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const documentTitles: Record<ReportTabType, string> = {
    rekrutmen: 'LAPORAN REKAPITULASI HASIL REKRUTMEN DAN PENEMPATAN KERJA',
    absensi: 'LAPORAN REKAPITULASI KEHADIRAN SELEKSI DAN EVALUASI AGENDA',
    keterserapan: 'LAPORAN REKAPITULASI KETERSERAPAN LULUSAN & INDUSTRI MITRA (DUDI)',
    'tracer-study': 'LAPORAN TRACER STUDY, RETENSI KERJA, DAN SEBARAN ALUMNI',
  };

  const getPeriodeString = () => {
    if (filters.startDate && filters.endDate) {
      return `${filters.startDate} s/d ${filters.endDate}`;
    }
    if (filters.startDate) {
      return `Mulai ${filters.startDate}`;
    }
    if (filters.endDate) {
      return `Sampai dengan ${filters.endDate}`;
    }
    return 'Semua Periode / Tahun Berjalan';
  };

  const getFilterDetail = () => {
    if (activeTab === 'rekrutmen') {
      if (filters.applicantType === 'siswa') return 'Siswa Aktif (Kelas 12)';
      if (filters.applicantType === 'alumni') return 'Alumni Lulusan';
      return 'Semua Kategori Pelamar';
    }
    if (activeTab === 'absensi') {
      const company = options.companies.find((c) => c.value === filters.companyId);
      return company ? company.label : 'Semua Perusahaan Mitra';
    }
    if (activeTab === 'keterserapan') {
      const major = options.majors.find((m) => m.value === filters.majorId);
      return major ? major.label : 'Semua Program Keahlian / Jurusan';
    }
    if (activeTab === 'tracer-study') {
      return filters.graduationYear ? `Lulusan Tahun ${filters.graduationYear}` : 'Semua Angkatan Kelulusan';
    }
    return 'Semua Data';
  };

  const docNumber = `BKK-SKARIGA/LAP/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 900) + 100)}`;

  return (
    <div className="hidden print:block font-serif text-black bg-white p-0 m-0">
      {/* 1. KOP SURAT FORMAL RESMI */}
      <div className="border-b-2 border-black pb-2">
        <div className="flex items-center gap-4">
          <img
            src="/skariga.png"
            alt="Logo SMK PGRI 3 Malang"
            className="h-20 w-20 object-contain shrink-0"
          />

          <div className="flex-1 text-center pr-12">
            <p className="text-[11px] font-bold uppercase tracking-wider text-black">
              YAYASAN PEMBINA LEMBAGA PENDIDIKAN DASAR DAN MENENGAH PGRI (YPLP DASMEN PGRI) MALANG
            </p>
            <h1 className="text-base font-bold uppercase tracking-wide text-black mt-0.5">
              SMK PGRI 3 MALANG (SKARIGA)
            </h1>
            <h2 className="text-xs font-bold uppercase tracking-wide text-black">
              BURSA KERJA KHUSUS (BKK) &amp; HUBUNGAN INDUSTRI
            </h2>
            <p className="text-[9px] text-black leading-tight mt-0.5">
              Jl. Raya Tlogomas IX No. 29, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144 <br />
              Telp: (0341) 554383 | Email: bkk@smkpgri3-malang.sch.id | Website: www.smkpgri3-malang.sch.id
            </p>
          </div>
        </div>
      </div>
      <div className="border-b border-black mt-[1.5px] mb-4" />

      {/* 2. JUDUL DOKUMEN & NOMOR REGISTRASI */}
      <div className="mb-4 text-center">
        <h3 className="text-sm font-bold uppercase tracking-wide underline underline-offset-4 text-black">
          {documentTitles[activeTab]}
        </h3>
        <p className="text-xs text-black mt-1">
          Nomor Registrasi Dokumen: <span className="font-semibold">{docNumber}</span>
        </p>
      </div>

      {/* 3. METADATA SECTION (TABEL FORMAL 1PX SOLID BLACK BORDER) */}
      <table className="w-full text-xs border-collapse border border-black mb-4">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold w-28 text-black bg-white">Periode Data</td>
            <td className="border border-black px-2 py-1 text-black bg-white">: {getPeriodeString()}</td>
            <td className="border border-black px-2 py-1 font-semibold w-28 text-black bg-white">Waktu Cetak</td>
            <td className="border border-black px-2 py-1 text-black bg-white">: {currentDate}, {currentTime} WIB</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold w-28 text-black bg-white">Filter Kriteria</td>
            <td className="border border-black px-2 py-1 text-black bg-white">: {getFilterDetail()}</td>
            <td className="border border-black px-2 py-1 font-semibold w-28 text-black bg-white">Petugas Cetak</td>
            <td className="border border-black px-2 py-1 text-black bg-white">: {adminName}</td>
          </tr>
        </tbody>
      </table>

      {/* 4. SECTION I (RINGKASAN EKSEKUTIF - FLAT COLUMN TANPA CARD / BORDER / BG) */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-black mb-1.5">
          I. RINGKASAN EKSEKUTIF &amp; INDIKATOR KUNCI
        </p>

        {activeTab === 'rekrutmen' && (
          <div className="grid grid-cols-3 gap-4 text-xs pl-2 mb-2">
            <div>
              <span className="font-semibold block">• Total Pelamar Terdaftar:</span>
              <span className="font-bold text-sm block">{rekrutmenData.metrics.total_applicants ?? 0} Siswa / Alumni</span>
              <span className="text-[10px] text-black block">(*Berdasarkan data seleksi terverifikasi)</span>
            </div>
            <div>
              <span className="font-semibold block">• Lolos Seleksi Akhir:</span>
              <span className="font-bold text-sm block">{rekrutmenData.metrics.total_accepted ?? 0} Peserta</span>
              <span className="text-[10px] text-black block">(Tingkat Kelulusan: {rekrutmenData.metrics.pass_rate ?? 0}%)</span>
            </div>
            <div>
              <span className="font-semibold block">• Perusahaan Mitra Aktif:</span>
              <span className="font-bold text-sm block">{rekrutmenData.metrics.active_companies ?? 0} Perusahaan</span>
              <span className="text-[10px] text-black block">(Mitra Industri BKK SKARIGA)</span>
            </div>
          </div>
        )}

        {activeTab === 'absensi' && (
          <div className="grid grid-cols-3 gap-4 text-xs pl-2 mb-2">
            <div>
              <span className="font-semibold block">• Kehadiran Sosialisasi:</span>
              <span className="font-bold text-sm block">{absensiData.metrics.sosialisasi_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Validasi Presensi QR Code &amp; GPS)</span>
            </div>
            <div>
              <span className="font-semibold block">• Kehadiran Tes / Psikotes:</span>
              <span className="font-bold text-sm block">{absensiData.metrics.psikotes_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Peserta Tahapan Terjadwal)</span>
            </div>
            <div>
              <span className="font-semibold block">• Kehadiran Wawancara HRD:</span>
              <span className="font-bold text-sm block">{absensiData.metrics.interview_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Tepat Waktu Sesuai Agenda)</span>
            </div>
          </div>
        )}

        {activeTab === 'keterserapan' && (
          <div className="grid grid-cols-4 gap-3 text-xs pl-2 mb-2">
            <div>
              <span className="font-semibold block">• Keterserapan Kelas 12:</span>
              <span className="font-bold text-sm block">{keterserapanData.metrics.class_12_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Diterima Sebelum Lulus)</span>
            </div>
            <div>
              <span className="font-semibold block">• Keterserapan Alumni:</span>
              <span className="font-bold text-sm block">{keterserapanData.metrics.alumni_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Lulusan Angkatan Terakhir)</span>
            </div>
            <div>
              <span className="font-semibold block">• Bekerja di DUDI:</span>
              <span className="font-bold text-sm block">{keterserapanData.metrics.working_dudi_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Sesuai Kompetensi Keahlian)</span>
            </div>
            <div>
              <span className="font-semibold block">• Kuliah / Wirausaha:</span>
              <span className="font-bold text-sm block">{keterserapanData.metrics.study_entrepreneur_rate ?? 0}%</span>
              <span className="text-[10px] text-black block">(Studi Lanjut &amp; Wirausaha)</span>
            </div>
          </div>
        )}

        {activeTab === 'tracer-study' && (
          <div className="grid grid-cols-3 gap-4 text-xs pl-2 mb-2">
            <div>
              <span className="font-semibold block">• Rata-Rata Masa Tunggu:</span>
              <span className="font-bold text-sm block">{tracerData.metrics.avg_waiting_time ?? '-'}</span>
              <span className="text-[10px] text-black block">(Target BKK: &lt; 3 Bulan)</span>
            </div>
            <div>
              <span className="font-semibold block">• Sebaran Perusahaan:</span>
              <span className="font-bold text-sm block">{tracerData.metrics.industries_count ?? 0} Industri</span>
              <span className="text-[10px] text-black block">({tracerData.metrics.sectors_count ?? 4} Sektor Bisnis Terdaftar)</span>
            </div>
            <div>
              <span className="font-semibold block">• Sebaran Wilayah Kerja:</span>
              <span className="font-bold text-sm block">{tracerData.metrics.regions_count ?? 0} Kota/Provinsi</span>
              <span className="text-[10px] text-black block">(Wilayah Penempatan Kerja)</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. SECTION II (RINCIAN DATA LAPORAN - TABEL STANDAR CETAK 1PX SOLID BLACK BORDER) */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-black mb-1.5">
          II. RINCIAN DATA LAPORAN
        </p>

        {activeTab === 'rekrutmen' && (
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 text-center font-bold w-8 bg-white text-black">NO</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">PERUSAHAAN</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">POSISI / JABATAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">TOTAL PELAMAR</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">LOLOS ADMIN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">LOLOS TES</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">DITERIMA</th>
                <th className="border border-black px-2 py-1 text-right font-bold bg-white text-black">KELULUSAN (%)</th>
              </tr>
            </thead>
            <tbody>
              {rekrutmenData.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border border-black px-2 py-3 text-center text-black italic bg-white">
                    Tidak ada data rekrutmen pada kriteria dan periode yang dipilih.
                  </td>
                </tr>
              ) : (
                rekrutmenData.data.map((row) => (
                  <tr key={row.no}>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.no}</td>
                    <td className="border border-black px-2 py-1 font-semibold bg-white text-black">{row.company_name}</td>
                    <td className="border border-black px-2 py-1 bg-white text-black">{row.job_title}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.total_applicants}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.passed_admin}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.passed_interview}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.accepted}</td>
                    <td className="border border-black px-2 py-1 text-right font-semibold bg-white text-black">{row.pass_rate_percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'absensi' && (
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 text-center font-bold w-8 bg-white text-black">NO</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">AGENDA / TAHAPAN SELEKSI</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">TANGGAL KEGIATAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">TARGET PESERTA</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">HADIR (VALID)</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">TIDAK HADIR</th>
                <th className="border border-black px-2 py-1 text-right font-bold bg-white text-black">KEHADIRAN (%)</th>
              </tr>
            </thead>
            <tbody>
              {absensiData.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-black px-2 py-3 text-center text-black italic bg-white">
                    Tidak ada data absensi pada kriteria dan periode yang dipilih.
                  </td>
                </tr>
              ) : (
                absensiData.data.map((row) => (
                  <tr key={row.no}>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.no}</td>
                    <td className="border border-black px-2 py-1 font-semibold bg-white text-black">{row.agenda_name}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.event_date}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.target_participants}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.present_valid}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.absent}</td>
                    <td className="border border-black px-2 py-1 text-right font-semibold bg-white text-black">{row.attendance_rate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'keterserapan' && (
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 text-center font-bold w-8 bg-white text-black">NO</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">PROGRAM KEAHLIAN / JURUSAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">JUMLAH LULUSAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">BEKERJA (DUDI)</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">LANJUT STUDI</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">WIRAUSAHA</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">BELUM BEKERJA</th>
                <th className="border border-black px-2 py-1 text-right font-bold bg-white text-black">KETERSERAPAN (%)</th>
              </tr>
            </thead>
            <tbody>
              {keterserapanData.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border border-black px-2 py-3 text-center text-black italic bg-white">
                    Tidak ada data keterserapan pada program keahlian yang dipilih.
                  </td>
                </tr>
              ) : (
                keterserapanData.data.map((row) => (
                  <tr key={row.no}>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.no}</td>
                    <td className="border border-black px-2 py-1 font-semibold bg-white text-black">{row.major_name}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.total_graduates}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.working_dudi}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.higher_education}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.entrepreneur}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.unemployed}</td>
                    <td className="border border-black px-2 py-1 text-right font-semibold bg-white text-black">{row.absorption_rate}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'tracer-study' && (
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 text-center font-bold w-8 bg-white text-black">NO</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">TAHUN KELULUSAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">MASA TUNGGU (AVG)</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">BERTAHAN 3 BULAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">BERTAHAN 6 BULAN</th>
                <th className="border border-black px-2 py-1 text-center font-bold bg-white text-black">BERTAHAN 12 BULAN</th>
                <th className="border border-black px-2 py-1 text-left font-bold bg-white text-black">DOMINASI WILAYAH KERJA</th>
              </tr>
            </thead>
            <tbody>
              {tracerData.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-black px-2 py-3 text-center text-black italic bg-white">
                    Tidak ada data tracer study untuk tahun kelulusan yang dipilih.
                  </td>
                </tr>
              ) : (
                tracerData.data.map((row) => (
                  <tr key={row.no}>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.no}</td>
                    <td className="border border-black px-2 py-1 font-semibold bg-white text-black">{row.graduation_year}</td>
                    <td className="border border-black px-2 py-1 text-center font-semibold bg-white text-black">{row.waiting_time_avg}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.retention_3_months}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.retention_6_months}</td>
                    <td className="border border-black px-2 py-1 text-center bg-white text-black">{row.retention_12_months}</td>
                    <td className="border border-black px-2 py-1 bg-white text-black">{row.dominant_region}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. LEMBAR PENGESAHAN & TANDA TANGAN FORMAL */}
      <div className="mt-8 pt-2 break-inside-avoid">
        <div className="flex justify-between items-end">
          {/* Catatan Legalitas Kiri */}
          <div className="text-[9px] text-black max-w-xs space-y-1">
            <p className="font-bold">Catatan &amp; Keterangan:</p>
            <p>1. Data dokumen ini digenerate secara otomatis melalui Sistem Informasi BKI SKARIGA.</p>
            <p>2. Laporan sah digunakan untuk evaluasi keterserapan kerja dan audit akreditasi.</p>
            <p className="font-mono text-[8px] mt-1 text-black">ID Dokumen: {docNumber}</p>
          </div>

          {/* Kolom Tanda Tangan Kanan */}
          <div className="text-center w-64 text-xs">
            <p className="text-black">Malang, {currentDate}</p>
            <p className="font-bold text-black mt-0.5">Koordinator Bursa Kerja Khusus (BKK)</p>
            <p className="font-semibold text-black">SMK PGRI 3 MALANG</p>

            <br /><br /><br /><br /><br />

            <div className="border-t border-black pt-1">
              <p className="font-bold text-black text-xs underline">
                M. TIANSYAH WAHYUDI PUTRA, S.Pd., M.M.
              </p>
              <p className="text-[10px] text-black">NIP. 19740512 200501 1 008</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
