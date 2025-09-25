// src/components/portfolio-icons.tsx
import React from "react";
import type { ComponentType, FC } from "react";
import type { LucideIcon } from "lucide-react";
import {
  // Acciones
  Plus,
  Trash2,
  Download,
  Upload,

  // Vista / navegación
  Eye,
  ExternalLink,
  ChevronDown,
  Search,
  LayoutGrid, // lo mapeamos como "Grid"
  List as ListIcon, // lo mapeamos como "List"

  // Secciones / categorías
  User,
  Code,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,

  // Archivos y configuración
  FileDown,
  Settings,

  // Tech y multimedia
  Github,
  Link,
  Image,
  Video,

  // Redes / contacto
  Mail,
  Linkedin,
  Globe,

  // Estado
  Check,
  X,
  AlertCircle,
  Info,

  // Drag & Drop / Personalizador (añadidos)
  GripVertical,
  Move,
  Layers,
  Paintbrush,
  LayoutTemplate,
  PlusCircle,
  Menu,
  EyeOff,
  ArrowLeft,
  Palette,
  Type,
  Settings2,
} from "lucide-react";

// Interfaz simple usada por tu UI
export type SimpleIconProps = {
  size?: number;
  className?: string;
};

// Adaptador de iconos de lucide para tu firma SimpleIconProps
const adapt =
  (Icon: LucideIcon): FC<SimpleIconProps> =>
  ({ size, className }) =>
    <Icon size={size} className={className} />;

// Exporta los iconos con las claves EXACTAS que usas en el JSX
export const Icons: Record<string, ComponentType<SimpleIconProps>> = {
  // Acciones
  Plus: adapt(Plus),
  Trash2: adapt(Trash2),
  Download: adapt(Download),
  Upload: adapt(Upload),

  // Vista / navegación
  Eye: adapt(Eye),
  ExternalLink: adapt(ExternalLink),
  ChevronDown: adapt(ChevronDown),
  Search: adapt(Search),
  Grid: adapt(LayoutGrid), // <Icons.Grid />
  List: adapt(ListIcon), // <Icons.List />

  // Secciones / categorías
  User: adapt(User),
  Code: adapt(Code),
  Award: adapt(Award),
  Briefcase: adapt(Briefcase),
  GraduationCap: adapt(GraduationCap),
  Trophy: adapt(Trophy),

  // Archivos y configuración
  FileDown: adapt(FileDown),
  Settings: adapt(Settings),

  // Tech y multimedia
  Github: adapt(Github),
  Link: adapt(Link),
  Image: adapt(Image),
  Video: adapt(Video),

  // Redes / contacto
  Mail: adapt(Mail),
  Linkedin: adapt(Linkedin),
  Globe: adapt(Globe),

  // Estado
  Check: adapt(Check),
  X: adapt(X),
  AlertCircle: adapt(AlertCircle),
  Info: adapt(Info),

  // Drag & Drop / Personalizador
  GripVertical: adapt(GripVertical),
  Move: adapt(Move),
  Layers: adapt(Layers),
  Paintbrush: adapt(Paintbrush),
  LayoutTemplate: adapt(LayoutTemplate),
  PlusCircle: adapt(PlusCircle),
  EyeOff: adapt(EyeOff),
  Menu: adapt(Menu),

  ArrowLeft: adapt(ArrowLeft),
  Palette: adapt(Palette),
  Type: adapt(Type),
  Advanced: adapt(Settings2), // "Avanzado" mapeado a Settings2
};

// Hook para obtener icono por nombre (clave segura)
export const useIcon = (name: keyof typeof Icons) => Icons[name];

// Componente dinámico por nombre
export const DynamicIcon: React.FC<
  SimpleIconProps & { name: keyof typeof Icons }
> = ({ name, size = 16, className }) => {
  const IconComponent = Icons[name];
  return <IconComponent size={size} className={className} />;
};
