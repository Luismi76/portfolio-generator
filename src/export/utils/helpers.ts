// src/export/utils/helpers.ts

/**
 * Descarga un archivo directamente en el navegador
 */
export const downloadFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Obtiene el emoji/icon apropiado para una tecnología
 */
export const getTechIcon = (tech: string): string => {
  const t = tech.toLowerCase();
  if (t.includes("react")) return "⚛️";
  if (t.includes("vue")) return "💚";
  if (t.includes("angular")) return "🅰️";
  if (t.includes("javascript") || t.includes("js")) return "💛";
  if (t.includes("typescript") || t.includes("ts")) return "💙";
  if (t.includes("python")) return "🐍";
  if (t.includes("node")) return "💚";
  if (t.includes("css")) return "🎨";
  if (t.includes("html")) return "🌐";
  if (t.includes("docker")) return "🐳";
  if (t.includes("git")) return "📦";
  return "⚡";
};

/**
 * Hace un merge profundo de dos objetos
 * @param target - Objeto objetivo
 * @param source - Objeto fuente
 * @returns Objeto merged
 */
export const deepMerge = (target: any, source: any): any => {
  const t = target && typeof target === "object" ? target : {};
  const s = source && typeof source === "object" ? source : {};
  const result: any = { ...t };
  
  for (const key in s) {
    const sv = s[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      result[key] = deepMerge(t[key], sv);
    } else {
      result[key] = sv;
    }
  }
  
  return result;
};