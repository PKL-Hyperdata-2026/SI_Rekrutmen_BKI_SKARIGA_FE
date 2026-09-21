import { useState, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  AlertCircle,
  Link2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CharCounter } from "@/components/custom";
import type { SocialMediaItem } from "./e-portfolio.schema";

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
    placeholder: "johndoe.com",
    exampleUrl: "johndoe.com",
    domain: "",
    icon: (
      <Globe/>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    baseUrl: "https://linkedin.com/in/",
    placeholder: "linkedin.com/in/username",
    exampleUrl: "linkedin.com/in/nama-anda",
    domain: "linkedin.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fillRule="evenodd"></path>
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    baseUrl: "https://github.com/",
    placeholder: "github.com/username",
    exampleUrl: "github.com/username",
    domain: "github.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z"></path>
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    baseUrl: "https://instagram.com/",
    placeholder: "instagram.com/username",
    exampleUrl: "instagram.com/username",
    domain: "instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0"></path>
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    baseUrl: "https://tiktok.com/@",
    placeholder: "tiktok.com/@username",
    exampleUrl: "tiktok.com/@username",
    domain: "tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M24.562,7.613c-1.508-.983-2.597-2.557-2.936-4.391-.073-.396-.114-.804-.114-1.221h-4.814l-.008,19.292c-.081,2.16-1.859,3.894-4.039,3.894-.677,0-1.315-.169-1.877-.465-1.288-.678-2.169-2.028-2.169-3.582,0-2.231,1.815-4.047,4.046-4.047,.417,0,.816,.069,1.194,.187v-4.914c-.391-.053-.788-.087-1.194-.087-4.886,0-8.86,3.975-8.86,8.86,0,2.998,1.498,5.65,3.783,7.254,1.439,1.01,3.19,1.606,5.078,1.606,4.886,0,8.86-3.975,8.86-8.86V11.357c1.888,1.355,4.201,2.154,6.697,2.154v-4.814c-1.345,0-2.597-.4-3.647-1.085Z"></path>
      </svg>
    ),
  },
  {
    id: "behance",
    name: "Behance",
    baseUrl: "https://behance.net/",
    placeholder: "behance.net/username",
    exampleUrl: "behance.net/username",
    domain: "behance.net",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M10.144,7.203c.808,0,1.554,.062,2.238,.249,.684,.124,1.243,.373,1.741,.684s.87,.746,1.119,1.306c.249,.56,.373,1.243,.373,1.989,0,.87-.187,1.616-.622,2.176-.373,.56-.995,1.057-1.741,1.43,1.057,.311,1.865,.87,2.362,1.616s.808,1.679,.808,2.735c0,.87-.187,1.616-.497,2.238s-.808,1.181-1.368,1.554c-.56,.373-1.243,.684-1.989,.87-.746,.187-1.492,.311-2.238,.311H2V7.203H10.144Zm-.497,6.963c.684,0,1.243-.187,1.679-.497s.622-.87,.622-1.554c0-.373-.062-.746-.187-.995s-.311-.435-.56-.622c-.249-.124-.497-.249-.808-.311s-.622-.062-.995-.062h-3.606v4.041h3.854Zm.187,7.336c.373,0,.746-.062,1.057-.124s.622-.187,.87-.373c.249-.187,.435-.373,.622-.684,.124-.311,.249-.684,.249-1.119,0-.87-.249-1.492-.746-1.927-.497-.373-1.181-.56-1.989-.56H5.792v4.787h4.041Zm11.998-.062c.497,.497,1.243,.746,2.238,.746,.684,0,1.306-.187,1.803-.497,.497-.373,.808-.746,.933-1.119h3.046c-.497,1.492-1.243,2.549-2.238,3.233-.995,.622-2.176,.995-3.606,.995-.995,0-1.865-.187-2.673-.497s-1.43-.746-1.989-1.368c-.56-.56-.995-1.243-1.243-2.052-.311-.808-.435-1.679-.435-2.673,0-.933,.124-1.803,.435-2.611s.746-1.492,1.306-2.114c.56-.56,1.243-1.057,1.989-1.368,.808-.311,1.616-.497,2.611-.497,1.057,0,1.989,.187,2.798,.622s1.43,.933,1.927,1.679c.497,.684,.87,1.492,1.119,2.362,.124,.87,.187,1.741,.124,2.735h-9.014c0,.995,.373,1.927,.87,2.425Zm3.917-6.528c-.435-.435-1.119-.684-1.927-.684-.56,0-.995,.124-1.368,.311-.373,.187-.622,.435-.87,.684-.249,.249-.373,.56-.435,.87s-.124,.56-.124,.808h5.595c-.124-.933-.435-1.554-.87-1.989Zm-5.471-6.528h6.963v1.679h-6.963v-1.679Z"></path>
      </svg>
    ),
  },
  {
    id: "dribbble",
    name: "Dribbble",
    baseUrl: "https://dribbble.com/",
    placeholder: "dribbble.com/username",
    exampleUrl: "dribbble.com/username",
    domain: "dribbble.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M16,2C8.266,2,2,8.271,2,15.997c0,7.345,5.666,13.374,12.864,13.952v.051h1.136c7.734,0,14-6.271,14-13.997S23.734,2,16,2Zm11.563,12.045c-1.778-.249-3.605-.171-5.391,.21-.352-.988-.805-1.934-1.335-2.838,1.47-.848,2.813-1.914,3.967-3.16,1.41,1.602,2.389,3.591,2.759,5.788Zm-4.416-7.34c-1.039,1.124-2.255,2.08-3.587,2.828-.914-1.161-1.966-2.212-3.145-3.11l-.029-.022-.03-.02s-.003-.002-.008-.006c-.006-.004-.015-.01-.025-.018-.022-.016-.049-.036-.081-.06-.039-.029-.079-.059-.121-.091-.032-.024-.066-.05-.103-.078-.08-.06-.169-.126-.25-.184-.057-.041-.138-.098-.221-.149-.016-.011-.033-.023-.053-.036-.108-.075-.27-.187-.418-.278-.138-.097-.324-.207-.446-.278-.118-.069-.246-.142-.325-.187-.026-.015-.046-.027-.06-.034-.015-.009-.028-.016-.033-.019h0c-.01-.006-.021-.012-.031-.017-.003-.002-.007-.004-.01-.006-.018-.01-.035-.019-.054-.03-.021-.012-.038-.021-.05-.029l-.009-.006-.03-.018c-.11-.067-.224-.128-.286-.161-.008-.004-.015-.008-.021-.012l-.026-.014-.027-.013c-.053-.025-.132-.063-.221-.105,.822-.183,1.676-.282,2.554-.282,2.691,0,5.168,.909,7.147,2.434Zm-12.826-.967s.007,.002,.011,.004c.193,.061,.377,.119,.554,.182,.065,.025,.129,.049,.192,.073,.288,.109,.544,.206,.759,.306l.061,.031,.015,.007c.135,.063,.33,.156,.506,.24,.093,.045,.181,.086,.252,.12,0,0,.002,0,.003,.001,.059,.032,.109,.058,.155,.086,.038,.024,.071,.044,.089,.055,.033,.019,.067,.038,.095,.054,.024,.013,.047,.026,.065,.036,.003,.002,.006,.003,.009,.005,.009,.005,.015,.008,.019,.01h.002c.026,.016,.058,.034,.094,.055,.077,.044,.175,.1,.282,.162,.076,.044,.146,.086,.204,.122,.044,.027,.067,.043,.076,.048,.005,.003,.005,.003,.002,0l.051,.039,.055,.033c.084,.05,.168,.108,.272,.18,.047,.033,.099,.069,.157,.108l.039,.027,.034,.019s0,0,0,0c0,0,.022,.014,.074,.051,.059,.042,.129,.095,.207,.153,.029,.022,.06,.045,.092,.07,.047,.036,.096,.072,.137,.103,.054,.04,.12,.09,.18,.131,.87,.665,1.661,1.429,2.369,2.266-.752,.275-1.527,.49-2.316,.632h0c-1.726,.311-3.489,.32-5.199,.006h-.003s-.003-.001-.003-.001c-1.356-.241-2.671-.679-3.9-1.293,1.058-1.716,2.545-3.139,4.312-4.119ZM4.271,15.997c0-1.443,.262-2.824,.739-4.102,1.42,.707,2.936,1.211,4.497,1.489,1.989,.365,4.027,.353,6.01-.005h0c1.125-.203,2.222-.53,3.276-.961,.472,.784,.872,1.608,1.187,2.467-4.716,1.701-8.834,5.525-10.49,10.865-3.146-2.104-5.22-5.688-5.22-9.753Zm11.729,11.727c-1.578,0-3.083-.314-4.458-.88,1.333-4.797,4.937-8.236,9.068-9.774,.713,3.458,.196,7.16-1.521,10.246-.877,.239-1.794,.381-2.741,.408h-.348Zm6.183-1.757c1.089-3.039,1.298-6.372,.617-9.52,1.642-.332,3.314-.367,4.92-.076-.125,4.052-2.305,7.587-5.537,9.596Z" fillRule="evenodd"></path>
      </svg>
    ),
  },
  {
    id: "artstation",
    name: "ArtStation",
    baseUrl: "https://artstation.com/",
    placeholder: "artstation.com/username",
    exampleUrl: "artstation.com/username",
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
    placeholder: "youtube.com/@nama-channel",
    exampleUrl: "youtube.com/@channel",
    domain: "youtube.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M31.331,8.248c-.368-1.386-1.452-2.477-2.829-2.848-2.496-.673-12.502-.673-12.502-.673,0,0-10.007,0-12.502,.673-1.377,.37-2.461,1.462-2.829,2.848-.669,2.512-.669,7.752-.669,7.752,0,0,0,5.241,.669,7.752,.368,1.386,1.452,2.477,2.829,2.847,2.496,.673,12.502,.673,12.502,.673,0,0,10.007,0,12.502-.673,1.377-.37,2.461-1.462,2.829-2.847,.669-2.512,.669-7.752,.669-7.752,0,0,0-5.24-.669-7.752ZM12.727,20.758V11.242l8.364,4.758-8.364,4.758Z"></path>
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    baseUrl: "https://x.com/",
    placeholder: "username",
    exampleUrl: "x.com/username",
    domain: "x.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
      </svg>
    ),
  },
  {
    id: "threads",
    name: "Threads",
    baseUrl: "https://threads.com/@",
    placeholder: "username",
    exampleUrl: "threads.com/@username",
    domain: "threads.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path d="M22.7,14.977c-.121-.058-.243-.113-.367-.167-.216-3.982-2.392-6.262-6.046-6.285-.017,0-.033,0-.05,0-2.185,0-4.003,.933-5.122,2.63l2.009,1.378c.836-1.268,2.147-1.538,3.113-1.538,.011,0,.022,0,.033,0,1.203,.008,2.111,.357,2.698,1.04,.428,.497,.714,1.183,.855,2.049-1.067-.181-2.22-.237-3.453-.166-3.474,.2-5.707,2.226-5.557,5.041,.076,1.428,.788,2.656,2.003,3.459,1.028,.678,2.351,1.01,3.727,.935,1.817-.1,3.242-.793,4.236-2.06,.755-.963,1.233-2.21,1.444-3.781,.866,.523,1.507,1.21,1.862,2.037,.603,1.405,.638,3.714-1.246,5.596-1.651,1.649-3.635,2.363-6.634,2.385-3.326-.025-5.842-1.091-7.478-3.171-1.532-1.947-2.323-4.759-2.353-8.359,.03-3.599,.821-6.412,2.353-8.359,1.636-2.079,4.151-3.146,7.478-3.171,3.35,.025,5.91,1.097,7.608,3.186,.833,1.025,1.461,2.313,1.874,3.815l2.355-.628c-.502-1.849-1.291-3.443-2.365-4.764-2.177-2.679-5.361-4.051-9.464-4.08h-.016c-4.094,.028-7.243,1.406-9.358,4.095-1.882,2.393-2.853,5.722-2.886,9.895v.01s0,.01,0,.01c.033,4.173,1.004,7.503,2.886,9.895,2.115,2.689,5.264,4.067,9.358,4.095h.016c3.64-.025,6.206-.978,8.32-3.09,2.765-2.763,2.682-6.226,1.771-8.352-.654-1.525-1.901-2.763-3.605-3.581Zm-6.285,5.909c-1.522,.086-3.104-.598-3.182-2.061-.058-1.085,.772-2.296,3.276-2.441,.287-.017,.568-.025,.844-.025,.909,0,1.76,.088,2.533,.257-.288,3.602-1.98,4.187-3.471,4.269Z"></path>
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
  "threads.com": "Threads",
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
          error: "Harap masukkan tautan yang valid (contoh: johndoe.com).",
        };
      }
    } catch {
      return {
        isValid: false,
        error: "Format tautan tidak valid. Pastikan tautan berupa domain atau URL yang benar.",
      };
    }

    return {
      isValid: true,
      username: trimmed,
      normalizedUrl: urlString,
    };
  }

  const isUrlFormat =
    /^https?:\/\//i.test(trimmed) ||
    trimmed.includes(".com") ||
    trimmed.includes(".net") ||
    trimmed.includes(".in/") ||
    trimmed.includes("youtu.be");

  if (!isUrlFormat) {
    const username = trimmed.replace(/^@+/, "").replace(/\/+$/, "").trim();
    if (!username) {
      return {
        isValid: false,
        error: `Harap masukkan username ${platformName} Anda.`,
      };
    }
    if (/\s/.test(username)) {
      return {
        isValid: false,
        error: "Username tidak boleh mengandung spasi.",
      };
    }

    return {
      isValid: true,
      username,
      normalizedUrl: `${platform?.baseUrl || ""}${username}`,
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
      error: `Format tautan tidak valid. Harap masukkan username atau URL lengkap ${platformName} Anda.`,
    };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  let isDomainMatched = false;
  if (platformId === "twitter") {
    isDomainMatched = host.includes("x.com") || host.includes("twitter.com");
  } else if (platformId === "youtube") {
    isDomainMatched = host.includes("youtube.com") || host.includes("youtu.be");
  } else if (platformId === "threads") {
    isDomainMatched = host.includes("threads.com") || host.includes("threads.net");
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
    platformId === "twitter" ||
    platformId === "threads" ||
    platformId === "tiktok"
  ) {
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
      error: `Tautan tidak lengkap. Harap masukkan username profil ${platformName} Anda (contoh: ${platform?.exampleUrl}).`,
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
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?threads\.(com|net)\/@?/i, "");
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

    setSelectedPlatformId(platformId);
    setInputValue(
      existing
        ? existing.username || (platformId === "portfolio" ? existing.url || "" : cleanSocialMediaUsername(platformId, existing.url || ""))
        : ""
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
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[460px] max-h-[85vh]">
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

            <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1.5 custom-scrollbar">
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
                {selectedPlatformId === "portfolio"
                  ? "Masukkan tautan URL web atau CV resmi Anda."
                  : `Cukup masukkan username ${selectedPlatform.name} Anda.`}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="block text-xs font-bold text-slate-700">
                  {selectedPlatformId === "portfolio"
                    ? "Tautan Portofolio / CV"
                    : "Username Akun"}
                </Label>
                <CharCounter length={inputValue.length} max={255} />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  maxLength={255}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                  placeholder={
                    selectedPlatformId === "portfolio"
                      ? "johndoe.com"
                      : "username akun (tanpa URL)"
                  }
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
                    {selectedPlatformId === "portfolio"
                      ? selectedPlatform.exampleUrl
                      : `@${selectedPlatform.placeholder} atau ${selectedPlatform.placeholder}`}
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
                    {validation.normalizedUrl}
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
