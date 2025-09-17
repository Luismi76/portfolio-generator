// portfolio-icons.tsx
import React from 'react';
import { IconProps } from '../types/portfolio-types';

// Componente base para iconos con props comunes
const BaseIcon: React.FC<IconProps & { children: React.ReactNode; viewBox?: string }> = ({ 
  size = 16, 
  className = "", 
  viewBox = "0 0 24 24", 
  children 
}) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    viewBox={viewBox} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

// Iconos de acciones y navegación
export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
);

export const Trash2Icon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
  </BaseIcon>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </BaseIcon>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </BaseIcon>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </BaseIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="6,9 12,15 18,9" />
  </BaseIcon>
);

// Iconos de categorías y secciones
export const UserIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseIcon>
);

export const CodeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </BaseIcon>
);

export const AwardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
  </BaseIcon>
);

export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </BaseIcon>
);

export const GraduationCapIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </BaseIcon>
);

export const TrophyIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M6 20h12" />
    <path d="M12 16V6a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4z" />
  </BaseIcon>
);

// Iconos de archivos y datos
export const FileDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <path d="M12 18v-6M9 15l3 3 3-3" />
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-3.5l-4.24 4.24M6.74 6.74l-4.24-4.24m12.02 12.02l4.24 4.24M6.74 17.26l-4.24 4.24" />
  </BaseIcon>
);

// Iconos de tecnología y herramientas
export const GithubIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </BaseIcon>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </BaseIcon>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </BaseIcon>
);

export const VideoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </BaseIcon>
);

// Iconos de estado
export const CheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="20,6 9,17 4,12" />
  </BaseIcon>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
);

export const AlertCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <path d="M12 16h.01" />
  </BaseIcon>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </BaseIcon>
);

// Objeto con todos los iconos para fácil importación
export const Icons = {
  // Acciones
  Plus: PlusIcon,
  Trash2: Trash2Icon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Eye: EyeIcon,
  ExternalLink: ExternalLinkIcon,
  ChevronDown: ChevronDownIcon,
  
  // Categorías
  User: UserIcon,
  Code: CodeIcon,
  Award: AwardIcon,
  Briefcase: BriefcaseIcon,
  GraduationCap: GraduationCapIcon,
  Trophy: TrophyIcon,
  
  // Archivos y configuración
  FileDown: FileDownIcon,
  Settings: SettingsIcon,
  
  // Tecnología
  Github: GithubIcon,
  Link: LinkIcon,
  Image: ImageIcon,
  Video: VideoIcon,
  
  // Estado
  Check: CheckIcon,
  X: XIcon,
  AlertCircle: AlertCircleIcon,
  Info: InfoIcon,
};

// Hook para obtener icono por nombre
export const useIcon = (name: keyof typeof Icons) => {
  return Icons[name];
};

// Componente genérico que renderiza iconos por nombre
export const DynamicIcon: React.FC<IconProps & { name: keyof typeof Icons }> = ({ 
  name, 
  ...props 
}) => {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
};