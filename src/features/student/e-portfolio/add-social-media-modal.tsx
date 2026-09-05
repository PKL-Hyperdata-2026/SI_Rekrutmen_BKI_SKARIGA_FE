import { useState, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  AlertCircle,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialMediaItem } from "./portfolio.schema";

interface AddSocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  socialMediaList: SocialMediaItem[];
  onUpdateList: (list: SocialMediaItem[]) => void;
}

export interface PlatformConfig {
  id: string;
  name: string;
  baseUrl: string;
  placeholder: string;
  exampleUrl: string;
  domain: string;
  icon: React.ReactNode;
}

export const MONOCHROME_PLATFORMS: PlatformConfig[] = [
  {
    id: "portfolio",
    name: "Portfolio / CV",
    baseUrl: "",
    placeholder: "https://namasiswa.my.id atau tautan CV/Portofolio",
    exampleUrl: "https://namasiswa.my.id (atau Carrd/Notion/Drive)",
    domain: "",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    baseUrl: "https://linkedin.com/in/",
    placeholder: "https://linkedin.com/in/username",
    exampleUrl: "https://linkedin.com/in/nama-anda",
    domain: "linkedin.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" r="2" cy="4" />
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    baseUrl: "https://github.com/",
    placeholder: "https://github.com/username",
    exampleUrl: "https://github.com/username",
    domain: "github.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    baseUrl: "https://instagram.com/",
    placeholder: "https://instagram.com/username",
    exampleUrl: "https://instagram.com/username",
    domain: "instagram.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    baseUrl: "https://tiktok.com/@",
    placeholder: "https://tiktok.com/@username",
    exampleUrl: "https://tiktok.com/@username",
    domain: "tiktok.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    id: "behance",
    name: "Behance",
    baseUrl: "https://behance.net/",
    placeholder: "https://behance.net/username",
    exampleUrl: "https://behance.net/username",
    domain: "behance.net",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9h5a2.5 2.5 0 0 1 0 5H3V5h5a2.5 2.5 0 0 1 0 5" />
        <path d="M14 8h6" />
        <path d="M17.5 11a3.5 3.5 0 1 0 3.5 3.5c0-1.93-1.57-3.5-3.5-3.5z" />
        <path d="M14 14.5h7" />
      </svg>
    ),
  },
  {
    id: "dribbble",
    name: "Dribbble",
    baseUrl: "https://dribbble.com/",
    placeholder: "https://dribbble.com/username",
    exampleUrl: "https://dribbble.com/username",
    domain: "dribbble.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
      </svg>
    ),
  },
  {
    id: "artstation",
    name: "ArtStation",
    baseUrl: "https://artstation.com/",
    placeholder: "https://artstation.com/username",
    exampleUrl: "https://artstation.com/username",
    domain: "artstation.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3L2 19h4l2.5-4.5h7L18 19h4L12 3z" />
        <path d="M9.5 12.5l2-3.5 2 3.5h-4z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    baseUrl: "https://youtube.com/@",
    placeholder: "https://youtube.com/@nama-channel",
    exampleUrl: "https://youtube.com/@channel",
    domain: "youtube.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    baseUrl: "https://x.com/",
    placeholder: "https://x.com/username",
    exampleUrl: "https://x.com/username",
    domain: "x.com",
    icon: (
      <svg
        className="h-5 w-5 text-slate-900 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
  },
];

const KNOWN_DOMAINS: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "github.com": "GitHub",
  "instagram.com": "Instagram",
  "tiktok.com": "TikTok",
  "behance.net": "Behance",
  "dribbble.com": "Dribbble",
  "artstation.com": "ArtStation",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "twitter.com": "Twitter/X",
  "x.com": "X (Twitter)",
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "medium.com": "Medium",
  "gitlab.com": "GitLab",
  "threads.net": "Threads",
  "pinterest.com": "Pinterest",
};

export interface ValidateResult {
  isValid: boolean;
  error?: string;
  username?: string;
  normalizedUrl?: string;
}

export function validateAndParseSocialUrl(
  platformId: string,
  rawInput: string
): ValidateResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { isValid: false };
  }

  const platform = MONOCHROME_PLATFORMS.find((p) => p.id === platformId);
  const platformName = platform?.name || platformId;

  if (platformId === "portfolio") {
    let urlString = trimmed;
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = `https://${urlString}`;
    }

    let parsed: URL;
    try {
      parsed = new URL(urlString);
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        return {
          isValid: false,
          error: "Harap masukkan URL yang valid (contoh: https://namasiswa.my.id atau link Google Drive/Notion/Carrd).",
        };
      }
    } catch {
      return {
        isValid: false,
        error: "Format tautan tidak valid. Pastikan tautan berupa URL lengkap yang benar.",
      };
    }

    return {
      isValid: true,
      username: urlString,
      normalizedUrl: urlString,
    };
  }

  let urlString = trimmed;
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return {
      isValid: false,
      error: `Format tautan tidak valid. Harap masukkan tautan URL lengkap profil ${platformName} Anda (contoh: ${platform?.exampleUrl}).`,
    };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  let isDomainMatched = false;
  if (platformId === "twitter") {
    isDomainMatched = host.includes("x.com") || host.includes("twitter.com");
  } else if (platformId === "youtube") {
    isDomainMatched = host.includes("youtube.com") || host.includes("youtu.be");
  } else if (platform?.domain) {
    isDomainMatched = host.includes(platform.domain);
  }

  if (!isDomainMatched) {
    const matchedKnownKey = Object.keys(KNOWN_DOMAINS).find((d) =>
      host.includes(d)
    );
    const foreignSiteName = matchedKnownKey
      ? KNOWN_DOMAINS[matchedKnownKey]
      : host;

    return {
      isValid: false,
      error: `Tautan tidak cocok! Anda memilih ${platformName}, tetapi tautan yang dimasukkan berasal dari ${foreignSiteName} (${host}).`,
    };
  }

  const path = parsed.pathname;
  const segments = path.split("/").filter(Boolean);

  let username = "";

  if (platformId === "linkedin") {
    const inIdx = segments.indexOf("in");
    if (inIdx !== -1 && segments.length > inIdx + 1) {
      username = segments[inIdx + 1];
    } else if (segments.length >= 1 && segments[0] !== "in") {
      username = segments[0];
    }
  } else if (
    platformId === "github" ||
    platformId === "instagram" ||
    platformId === "behance" ||
    platformId === "dribbble" ||
    platformId === "artstation" ||
    platformId === "twitter"
  ) {
    if (segments.length >= 1) {
      username = segments[0].replace(/^@/, "");
    }
  } else if (platformId === "tiktok") {
    if (segments.length >= 1) {
      username = segments[0].replace(/^@/, "");
    }
  } else if (platformId === "youtube") {
    if (segments.length >= 1) {
      const lastSegment = segments[segments.length - 1];
      username = lastSegment.replace(/^@/, "");
    }
  }

  username = username.replace(/^@+/, "").replace(/\/+$/, "").trim();

  if (!username) {
    return {
      isValid: false,
      error: `Tautan tidak lengkap. Harap masukkan tautan profil ${platformName} Anda (contoh: ${platform?.exampleUrl}).`,
    };
  }

  const normalizedUrl = `${platform?.baseUrl || ""}${username}`;

  return {
    isValid: true,
    username,
    normalizedUrl,
  };
}

export function cleanSocialMediaUsername(platform: string, input: string): string {
  let cleaned = input.trim();
  if (!cleaned) return "";

  if (platform === "portfolio") {
    return cleaned;
  }

  if (
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://") ||
    cleaned.includes(".com") ||
    cleaned.includes(".net") ||
    cleaned.includes("/")
  ) {
    const result = validateAndParseSocialUrl(platform, cleaned);
    if (result.isValid && result.username) {
      return result.username;
    }
  }

  cleaned = cleaned.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?github\.com\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?behance\.net\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?dribbble\.com\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?artstation\.com\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?youtube\.com\/(@|c\/|user\/)?/i, "");
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "");
  cleaned = cleaned.replace(/^https?:\/\/[^/]+\//i, "");

  cleaned = cleaned.replace(/^@+/, "");
  cleaned = cleaned.replace(/\/+$/, "");

  return cleaned.trim();
}

export function AddSocialMediaModal({
  isOpen,
  onClose,
  socialMediaList,
  onUpdateList,
}: AddSocialMediaModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const filteredPlatforms = useMemo(() => {
    return MONOCHROME_PLATFORMS.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedPlatform = useMemo(() => {
    return MONOCHROME_PLATFORMS.find((p) => p.id === selectedPlatformId);
  }, [selectedPlatformId]);

  const validation = useMemo(() => {
    if (!selectedPlatformId || !inputValue.trim()) {
      return { isValid: false };
    }
    return validateAndParseSocialUrl(selectedPlatformId, inputValue);
  }, [selectedPlatformId, inputValue]);

  if (!isOpen) return null;

  const existingItem = selectedPlatformId
    ? socialMediaList.find((i) => i.platform.toLowerCase() === selectedPlatformId.toLowerCase())
    : null;

  const handleSelectPlatform = (platformId: string) => {
    const existing = socialMediaList.find(
      (i) => i.platform.toLowerCase() === platformId.toLowerCase()
    );
    const platform = MONOCHROME_PLATFORMS.find((p) => p.id === platformId);

    setSelectedPlatformId(platformId);
    setInputValue(
      existing ? existing.url || `${platform?.baseUrl || ""}${existing.username}` : ""
    );
    setSubmitError("");
  };

  const handleBack = () => {
    setSelectedPlatformId(null);
    setInputValue("");
    setSubmitError("");
  };

  const handleClose = () => {
    setSelectedPlatformId(null);
    setInputValue("");
    setSearchQuery("");
    setSubmitError("");
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!selectedPlatformId || !selectedPlatform) return;

    if (!validation.isValid || !validation.username || !validation.normalizedUrl) {
      setSubmitError(
        validation.error ||
          `Harap masukkan tautan profil ${selectedPlatform.name} yang valid.`
      );
      return;
    }

    const newItem: SocialMediaItem = {
      platform: selectedPlatform.id,
      username: validation.username,
      url: validation.normalizedUrl,
    };

    const filtered = socialMediaList.filter(
      (i) => i.platform.toLowerCase() !== selectedPlatform.id.toLowerCase()
    );
    onUpdateList([...filtered, newItem]);

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-[380px] w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[460px] max-h-[85vh]">
        <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-slate-50">
          <div className="w-8">
            {selectedPlatformId && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer -ml-1"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>

          <h2 className="text-sm font-bold text-slate-900 tracking-tight text-center">
            {selectedPlatformId ? selectedPlatform?.name : "Add social icon"}
          </h2>

          <div className="w-8 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer -mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!selectedPlatformId && (
          <div className="flex-1 min-h-0 flex flex-col p-3.5 overflow-hidden">
            <div className="relative mb-2.5 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-9 pl-8.5 pr-3 bg-slate-100/70 hover:bg-slate-100 focus-visible:bg-white text-xs rounded-xl"
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1.5 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              {filteredPlatforms.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Platform tidak ditemukan.
                </div>
              ) : (
                filteredPlatforms.map((platform) => {
                  const isAdded = socialMediaList.some(
                    (i) => i.platform.toLowerCase() === platform.id.toLowerCase()
                  );

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handleSelectPlatform(platform.id)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between gap-3 text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8.5 w-8.5 rounded-xl bg-slate-100 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0 transition-colors">
                          {platform.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-800 block truncate">
                            {platform.name}
                          </span>
                          {isAdded && (
                            <span className="text-xs text-emerald-600 font-medium block">
                              Sudah ditambahkan
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {selectedPlatformId && selectedPlatform && (
          <form onSubmit={handleSave} className="flex-1 flex flex-col p-4.5 space-y-3.5">
            {submitError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-medium animate-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-1 text-center">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-1.5 shadow-inner">
                {selectedPlatform.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedPlatform.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Masukkan tautan URL profil resmi akun Anda.
              </p>
            </div>

            <div>
              <Label className="block text-xs font-bold text-slate-700 mb-1">
                Tautan Profil
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                  placeholder={selectedPlatform.placeholder}
                  autoFocus
                  className={`h-9.5 pl-9 pr-3 bg-slate-50 focus-visible:bg-white text-xs rounded-xl font-medium ${
                    inputValue && !validation.isValid
                      ? "border-rose-300 focus-visible:border-rose-500"
                      : inputValue && validation.isValid
                      ? "border-emerald-400 focus-visible:border-emerald-600"
                      : "border-slate-200"
                  }`}
                />
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>

              {inputValue && !validation.isValid && validation.error ? (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-rose-600 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{validation.error}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1 truncate">
                  Contoh:{" "}
                  <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">
                    {selectedPlatform.exampleUrl}
                  </code>
                </p>
              )}
            </div>

            {inputValue && validation.isValid && validation.username && (
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-2 text-xs animate-in zoom-in-95 duration-150">
                <div className="min-w-0">
                  <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                    Link Terverifikasi
                  </div>
                  <div className="font-bold text-slate-900 truncate text-xs">
                    {validation.username}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Check className="h-3 w-3" />
                  Cocok
                </span>
              </div>
            )}

            <div className="pt-2 mt-auto space-y-1.5">
              <Button
                type="submit"
                disabled={!validation.isValid}
                className="w-full h-9.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{existingItem ? "Perbarui Akun" : "Tambahkan ke Profil"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="w-full h-8 rounded-full border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Pilih Platform Lain
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
