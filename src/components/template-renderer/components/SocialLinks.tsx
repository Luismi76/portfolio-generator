// src/components/template-renderer/components/SocialLinks.tsx
import React from "react";
import { Icons } from "../../portfolio-icons";
import { isValidUrl } from "../../../utils/template-utils";

interface SocialLink {
  url?: string;
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
}

interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  website?: string;
  email?: string;
  variant?: "chips" | "circles";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente de enlaces sociales reutilizable
 * Puede mostrarse como chips (con texto) o círculos (solo iconos)
 */
export const SocialLinks: React.FC<SocialLinksProps> = ({
  github,
  linkedin,
  website,
  email,
  variant = "chips",
  className = "",
}) => {
  // Construir array de links válidos
  const socialLinks: SocialLink[] = [
    {
      url: github,
      Icon: Icons.Github,
      label: "GitHub",
    },
    {
      url: linkedin,
      Icon: Icons.Linkedin,
      label: "LinkedIn",
    },
    {
      url: website,
      Icon: Icons.Globe,
      label: "Sitio web",
    },
  ].filter((link) => isValidUrl(link.url));

  // Agregar email si existe
  if (email) {
    socialLinks.push({
      url: `mailto:${email}`,
      Icon: Icons.Mail,
      label: "Email",
    });
  }

  if (socialLinks.length === 0) return null;

  if (variant === "circles") {
    return (
      <div
        className={className}
        style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        {socialLinks.map(({ url, Icon, label }) => (
          <a
            key={label}
            href={url}
            target={label === "Email" ? undefined : "_blank"}
            rel={label === "Email" ? undefined : "noopener noreferrer"}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            aria-label={label}
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    );
  }

  // Variant: chips
  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
      }}
      role="list"
      aria-label="Enlaces a redes sociales"
    >
      {socialLinks.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url}
          target={label === "Email" ? undefined : "_blank"}
          rel={label === "Email" ? undefined : "noopener noreferrer"}
          className="tpl-chip"
          aria-label={`Visitar mi ${label}`}
          title={label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "transform 0.2s, opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}
        >
          <Icon size={14} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
};