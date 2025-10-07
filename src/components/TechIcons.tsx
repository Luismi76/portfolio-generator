// src/components/TechIcons.tsx
import React from "react";
// Todos los iconos desde lucide-react
import { 
  Link2, 
  Feather, 
  Lightbulb, 
  BarChart2,
  Atom,        // Para React (equivalente a SiReact)
  Waves,       // Para Tailwind (equivalente a SiTailwindcss)
  Rocket,      // Para Astro (equivalente a SiAstro)
  Bluetooth,   // Para Bluetooth (equivalente a SiBluetooth)
  Cpu,         // Para Espressif (equivalente a SiEspressif)
} from "lucide-react";

/* --------------------------- Normalización ES5-safe --------------------------- */
const DIACRITICS_RE = /[\u0300-\u036f]/g;

const normalizeTech = (raw: string): string => {
  const safeNormalize = (s: string) =>
    typeof (s as any).normalize === "function" ? s.normalize("NFD") : s;

  let s = safeNormalize((raw || "").toLowerCase())
    .replace(DIACRITICS_RE, "")
    .replace(/\s+/g, " ")
    .trim();

  // aliases comunes
  s = s.replace(/^node\.?\s*js$/, "nodejs");
  s = s.replace(/^js$/, "javascript");
  s = s.replace(/^ts$/, "typescript");
  s = s.replace(/^postgres(?:ql)?$/, "postgresql");
  s = s.replace(/^sql\s*server$/, "sqlserver");
  s = s.replace(/^maria\s*db$/, "mariadb");
  s = s.replace(/^spring\s*boot$/, "spring");
  s = s.replace(/^c\+{2}$/, "cpp");
  s = s.replace(/^c#$/, "csharp");
  s = s.replace(/^express\.?js$/, "express");
  s = s.replace(/^amazon web services|aws cloud$/, "aws");

  // nuevos aliases
  s = s.replace(/^astro\.?js$/, "astro");
  s = s.replace(/^power\s*bi$/, "powerbi");
  s = s.replace(/^(api\s*rest|rest\s*api|rest)$/, "restapi");

  s = s.replace(/^bluetooth(\s*low\s*energy)?$|^ble$/, "bluetooth");
  s = s.replace(/^esp32(?:-c3)?$/, "esp32");
  s = s.replace(/^esp8266$/, "esp8266");
  s = s.replace(/^espressif$/, "espressif");
  s = s.replace(/^ws2812b?$/, "ws2812");
  s = s.replace(/^tof(\s*vl53l1x)?$|^vl53l1x$/, "vl53l1x");

  s = s.replace(/^tailwind\s*css$/, "tailwindcss");
  s = s.replace(/^shadcn(?:\/ui)?$/, "shadcnui");
  s = s.replace(/^lucide(?:-react)?$/, "lucide");

  return s;
};

/* ------------------------------- Emojis fallback ------------------------------ */
const TECH_EMOJI: Record<string, string> = {
  // Web base
  html: "🟧",
  css: "🎨",
  javascript: "💛",
  typescript: "💙",
  sass: "🎀",
  tailwindcss: "🌊",
  bootstrap: "🅱️",

  // Frameworks / libs
  react: "⚛️",
  vue: "💚",
  angular: "🅰️",
  nodejs: "💚",
  express: "🚂",

  // Lenguajes
  python: "🐍",
  java: "☕",
  php: "🐘",
  cpp: "➕",
  csharp: "♯",

  // Bases de datos
  mysql: "🐬",
  mariadb: "🦭",
  postgresql: "🐘",
  sqlite: "🗃️",
  redis: "🔴",
  sqlserver: "🗄️",
  mongodb: "🍃",

  // DevOps / Sistemas
  git: "📦",
  docker: "🐳",
  linux: "🐧",
  nginx: "🚦",
  grafana: "📊",
  zabbix: "📈",
  aws: "☁️",
  spring: "🍃",
  flask: "🧪",

  // Nuevos / hardware / ui
  astro: "🪐",
  powerbi: "📈",
  restapi: "🔗",
  bluetooth: "🟦",
  esp32: "📶",
  esp8266: "📶",
  espressif: "📶",
  ws2812: "💡",
  vl53l1x: "📡",
  shadcnui: "🧩",
  lucide: "✒️",

  default: "⚡",
};

/* ----------------------------- Adaptadores de icono ----------------------------- */
// Tipo compatible con lucide-react
type IconComp = (props: { size?: number | string; className?: string }) => JSX.Element;

// Envoltorio para componentes de lucide-react
const wrapIcon =
  (C: any): IconComp =>
  ({ size = 14, className }) =>
    <C size={size as any} className={className} />;

/* ----------------------------- SVGs (lucide-react) ----------------------------- */
const TECH_SVG: Record<string, IconComp> = {
  astro: wrapIcon(Rocket),        // Astro
  powerbi: wrapIcon(BarChart2),   // Power BI
  restapi: wrapIcon(Link2),       // REST API

  // Hardware/IoT
  bluetooth: wrapIcon(Bluetooth), // Bluetooth
  espressif: wrapIcon(Cpu),       // Espressif/ESP32
  esp32: wrapIcon(Cpu),           // ESP32
  
  // Frameworks populares
  react: wrapIcon(Atom),          // React
  tailwindcss: wrapIcon(Waves),   // Tailwind CSS
  
  // UI libraries
  lucide: wrapIcon(Feather),      // Lucide
  ws2812: wrapIcon(Lightbulb),    // WS2812 LEDs
  // vl53l1x -> sin icono específico; usará emoji 📡
};

/* ------------------------------- API pública -------------------------------- */
export const getSimpleTechIcon = (tech: string): string => {
  const key = normalizeTech(tech);
  return TECH_EMOJI[key] || TECH_EMOJI.default;
};

export const renderTechBadge = (tech: string): string => {
  return `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
    <span>${getSimpleTechIcon(tech)}</span>
    ${tech.trim()}
  </span>`;
};

export const renderTechList = (technologies: string): string => {
  if (!technologies) return "";
  return technologies
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => renderTechBadge(t))
    .join(" ");
};

/* --------- (Opcional) habilidades "blandas" con emoji por nombre ---------- */
export const getSkillIcon = (skill: string): string => {
  const s = normalizeTech(skill);
  const skillIcons: Record<string, string> = {
    comunicacion: "💬",
    liderazgo: "🧭",
    "trabajo en equipo": "👥",
    programacion: "💻",
    creatividad: "🎨",
    organizacion: "📋",
    default: "⭐",
  };
  return skillIcons[s] || skillIcons.default;
};

export const renderSkillBadge = (skill: string): string => {
  return `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
    <span>${getSkillIcon(skill)}</span>
    ${skill.trim()}
  </span>`;
};

export const renderSkillList = (skills: string): string => {
  if (!skills) return "";
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => renderSkillBadge(s))
    .join(" ");
};

interface TechListProps {
  technologies: string;
  variant?: "default" | "outlined" | "minimal";
  className?: string;
}

/* ------------------------- Lista React con icono SVG ------------------------ */
export const TechList: React.FC<TechListProps> = ({
  technologies,
  variant = "default",
  className = "",
}) => {
  if (!technologies) return null;
  const techs = technologies
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const base =
    variant === "outlined" || variant === "minimal"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      : "bg-blue-100 text-blue-800 hover:bg-blue-200";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {techs.map((tech, i) => {
        const key = normalizeTech(tech);
        const Svg = TECH_SVG[key];
        return (
          <span
            key={`${key}-${i}`}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${base}`}
          >
            {Svg ? (
              <Svg size={14} className="shrink-0" />
            ) : (
              <span className="shrink-0">{getSimpleTechIcon(tech)}</span>
            )}
            {tech}
          </span>
        );
      })}
    </div>
  );
};