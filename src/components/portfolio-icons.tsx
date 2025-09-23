// src/components/portfolio-icons.tsx
import React from "react";
import type { ComponentType, FC } from "react";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Eye,
  ExternalLink,
  ChevronDown,
  User,
  Code,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  FileDown,
  Settings,
  Github,
  Link,
  Image,
  Video,
  Check,
  X,
  AlertCircle,
  Info,
  Mail,
  Linkedin,
  Globe,
  type LucideIcon, // tipo de lucide-react
} from "lucide-react";

// Tu interfaz simple usada por el resto de tu UI
export type SimpleIconProps = {
  size?: number;
  className?: string;
};

// Adaptador: envuelve un LucideIcon (size: number|string, ...)
// para exponer exactamente { size?: number; className?: string }
const adapt = (Icon: LucideIcon): FC<SimpleIconProps> =>
  ({ size, className }) =>
    <Icon size={size} className={className} />;

// Exporta TODOS los iconos ya adaptados a tu firma simple
export const Icons: Record<string, ComponentType<SimpleIconProps>> = {
  // Acciones
  Plus: adapt(Plus),
  Trash2: adapt(Trash2),
  Download: adapt(Download),
  Upload: adapt(Upload),
  Eye: adapt(Eye),
  ExternalLink: adapt(ExternalLink),
  ChevronDown: adapt(ChevronDown),

  // Categorías / secciones
  User: adapt(User),
  Code: adapt(Code),
  Award: adapt(Award),
  Briefcase: adapt(Briefcase),
  GraduationCap: adapt(GraduationCap),
  Trophy: adapt(Trophy),

  // Archivos y configuración
  FileDown: adapt(FileDown),
  Settings: adapt(Settings),

  // Tecnología y multimedia
  Github: adapt(Github),
  Link: adapt(Link),
  Image: adapt(Image),
  Video: adapt(Video),

  // Redes / Contacto
  Mail: adapt(Mail),
  Linkedin: adapt(Linkedin),
  Globe: adapt(Globe),

  // Estado
  Check: adapt(Check),
  X: adapt(X),
  AlertCircle: adapt(AlertCircle),
  Info: adapt(Info),
};

// Hook para obtener icono por nombre (clave segura)
export const useIcon = (name: keyof typeof Icons) => Icons[name];

// Componente dinámico que renderiza iconos por nombre
export const DynamicIcon: React.FC<SimpleIconProps & { name: keyof typeof Icons }> = ({
  name,
  size = 16,
  className,
}) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} className={className} />;
};
