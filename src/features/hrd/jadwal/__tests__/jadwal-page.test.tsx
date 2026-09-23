import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { JadwalPage } from "../jadwal-page";
import { jadwalApi } from "../jadwal.api";
import { buildJadwalItem, buildPesertaJadwalItem } from "./jadwal.test-builder";

function renderJadwalPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <JadwalPage />
      </MemoryRouter>
    </Provider>
  );
}

describe("JadwalPage Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page header and schedule agenda table", async () => {
    const mockJadwal = [
      buildJadwalItem({
        id: 1,
        namaAgenda: "Psikotes & Akademik - Batch 1",
        posisiLowongan: "Junior Mechanic Operator",
        totalPeserta: 25,
      }),
    ];

    vi.spyOn(jadwalApi, "getJadwalList").mockResolvedValue(mockJadwal);
    vi.spyOn(jadwalApi, "getLowonganOptions").mockResolvedValue([
      { value: "1", label: "Junior Mechanic Operator" },
    ]);

    renderJadwalPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Kelola Agenda & Jadwal Tes" })
    ).toBeInTheDocument();
    expect(screen.getByText("Penjadwalan Seleksi")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /buat agenda tes/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Psikotes & Akademik - Batch 1")
      ).toBeInTheDocument();
      expect(screen.getByText("Junior Mechanic Operator")).toBeInTheDocument();
      expect(screen.getByText("Peserta: 25 Peserta")).toBeInTheDocument();
    });
  });

  it("opens create agenda modal when header button is clicked", async () => {
    const user = userEvent.setup();
    renderJadwalPage();

    const createButton = screen.getByRole("button", {
      name: /buat agenda tes/i,
    });
    await user.click(createButton);

    expect(
      await screen.findByRole("dialog", {
        name: /form buat agenda sesi tes baru/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tentukan Jadwal & alokasikan pelamar yang telah lolos berkas."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g Psikotes - Batch 1")
    ).toBeInTheDocument();
  });

  it("displays validation error when required fields are empty on submit", async () => {
    const user = userEvent.setup();
    renderJadwalPage();

    await user.click(screen.getByRole("button", { name: /buat agenda tes/i }));

    const dialog = await screen.findByRole("dialog", {
      name: /form buat agenda sesi tes baru/i,
    });
    expect(dialog).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /simpan data/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText("Nama agenda wajib diisi.")
    ).toBeInTheDocument();
    expect(screen.getByText("Lowongan kerja wajib dipilih.")).toBeInTheDocument();
    expect(
      screen.getByText("Nilai minimum diterima wajib diisi.")
    ).toBeInTheDocument();
  });

  it("resets form inputs when reset button is clicked", async () => {
    const user = userEvent.setup();
    renderJadwalPage();

    await user.click(screen.getByRole("button", { name: /buat agenda tes/i }));

    const agendaInput = await screen.findByPlaceholderText(
      "e.g Psikotes - Batch 1"
    );
    await user.type(agendaInput, "Agenda Draft");
    expect(agendaInput).toHaveValue("Agenda Draft");

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    await user.click(resetBtn);

    expect(agendaInput).toHaveValue("");
  });

  it("opens peserta modal and triggers reminder action", async () => {
    const user = userEvent.setup();
    const mockPeserta = [
      buildPesertaJadwalItem({
        id: 101,
        namaKandidat: "Marvello Cikiwaw",
        nis: "25083",
        nisn: "08813036213",
        email: "marvellouwaw@gmail.com",
        statusKehadiran: "hadir",
        statusKehadiranLabel: "Hadir",
      }),
    ];

    vi.spyOn(jadwalApi, "getPesertaList").mockResolvedValue(mockPeserta);
    const reminderSpy = vi
      .spyOn(jadwalApi, "sendReminder")
      .mockResolvedValue({ success: true, message: "Pengingat terkirim" });

    renderJadwalPage();

    const pesertaButtons = await screen.findAllByRole("button", {
      name: /peserta/i,
    });
    await user.click(pesertaButtons[0]);

    const modal = await screen.findByRole("dialog", {
      name: /daftar peserta:/i,
    });
    expect(modal).toBeInTheDocument();

    expect(await screen.findByText("Marvello Cikiwaw")).toBeInTheDocument();
    expect(screen.getByText("marvellouwaw@gmail.com")).toBeInTheDocument();

    const reminderBtn = screen.getByRole("button", {
      name: /kirim reminder/i,
    });
    await user.click(reminderBtn);

    await waitFor(() => {
      expect(reminderSpy).toHaveBeenCalledWith(1, 101);
    });

    const closeBtn = screen.getByRole("button", { name: /^tutup$/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
