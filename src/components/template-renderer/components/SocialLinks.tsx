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
  onDark?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  github,
  linkedin,
  website,
  email,
  variant = "chips",
  className = "",
  style,
  onDark = false,
}) => {
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
        style={{ display: "flex", gap: 16, flexWrap: "wrap", ...style }}
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
              backgroundColor: onDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
              border: onDark ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = onDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.borderColor = onDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = onDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.borderColor = onDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)";
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

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        ...style,
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
            backgroundColor: onDark ? "rgba(255, 255, 255, 0.2)" : undefined,
            border: onDark ? "1px solid rgba(255, 255, 255, 0.3)" : undefined,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            if (onDark) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
            }
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
            if (onDark) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }
          }}
        >
          <Icon size={14} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
};