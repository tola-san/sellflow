import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Globe2, MapPin, Navigation, Phone, Store, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import type { PublicBusiness } from "../../Services/storefront";
import type { ThemeSettings } from "../../types/theme";

interface StoreProfileDrawerProps {
  business: PublicBusiness;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeSettings;
}

const socialChannels = [
  { key: "facebook_url", label: "Facebook", icon: FaFacebookF, color: "#1877F2" },
  { key: "instagram_url", label: "Instagram", icon: FaInstagram, color: "#E1306C" },
  { key: "tiktok_url", label: "TikTok", icon: FaTiktok, color: "#111111" },
  { key: "telegram_url", label: "Telegram", icon: FaTelegramPlane, color: "#229ED9" },
] as const;

export function StoreProfileDrawer({ business, isOpen, onClose, theme }: StoreProfileDrawerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fullAddress = [business.address, business.city, business.country].filter(Boolean).join(", ");
  const encodedAddress = encodeURIComponent(fullAddress);
  const hasSocials = socialChannels.some(({ key }) => Boolean(business[key]));

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close store profile"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] cursor-default bg-slate-950/50 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="fixed inset-y-0 left-0 z-[100] flex w-4/5 flex-col shadow-2xl sm:w-full sm:max-w-md"
            style={{ backgroundColor: theme.surface_color, color: theme.text_color }}
          >
            <div className="flex min-h-16 items-center justify-between gap-4 border-b px-5 py-3" style={{ borderColor: `${theme.muted_color}35` }}>
              <div className="flex min-w-0 items-center gap-3">
                {business.logo ? (
                  <img src={business.logo} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: theme.primary_color }}>
                    <Store size={20} />
                  </span>
                )}
                <div className="min-w-0">
                  <h2 id={titleId} className="truncate font-bold">{business.name}</h2>
                  <p className="text-xs" style={{ color: theme.muted_color }}>Store information</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close store profile"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {business.description && <p className="text-sm leading-6" style={{ color: theme.muted_color }}>{business.description}</p>}

              {(business.phone || business.website) && (
                <section className="mt-6" aria-labelledby={`${titleId}-contact`}>
                  <SectionTitle id={`${titleId}-contact`} theme={theme}>Contact</SectionTitle>
                  <div className="mt-3 space-y-3">
                    {business.phone && (
                      <ProfileLink href={`tel:${business.phone}`} icon={<Phone size={18} />} label="Telephone" value={business.phone} theme={theme} />
                    )}
                    {business.website && (
                      <ProfileLink
                        href={business.website}
                        icon={<Globe2 size={18} />}
                        label="Website"
                        value={business.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        theme={theme}
                        external
                      />
                    )}
                  </div>
                </section>
              )}

              {hasSocials && (
                <section className="mt-7" aria-labelledby={`${titleId}-socials`}>
                  <SectionTitle id={`${titleId}-socials`} theme={theme}>Follow us</SectionTitle>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {socialChannels.map(({ key, label, icon: Icon, color }) => {
                      const href = business[key];
                      if (!href) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2"
                          style={{ borderColor: `${theme.muted_color}35` }}
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white" style={{ backgroundColor: color }}>
                            <Icon size={17} />
                          </span>
                          <span className="truncate">{label}</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              {fullAddress && (
                <section className="mt-7" aria-labelledby={`${titleId}-location`}>
                  <div className="flex items-center justify-between gap-4">
                    <SectionTitle id={`${titleId}-location`} theme={theme}>Location</SectionTitle>
                    {business.show_map && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: theme.primary_color }}
                      >
                        Directions <Navigation size={13} />
                      </a>
                    )}
                  </div>
                  <div className="mt-3 overflow-hidden rounded-2xl border" style={{ borderColor: `${theme.muted_color}35` }}>
                    {business.show_map && (
                      <iframe
                        title={`${business.name} location`}
                        src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
                        className="h-52 w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    )}
                    <div className="flex gap-3 p-4">
                      <MapPin className="mt-0.5 shrink-0" size={18} style={{ color: theme.primary_color }} />
                      <p className="text-sm leading-5">{fullAddress}</p>
                    </div>
                  </div>
                </section>
              )}

              {!business.phone && !business.website && !fullAddress && !hasSocials && (
                <div className="grid min-h-[45vh] place-items-center text-center">
                  <div>
                    <Store className="mx-auto" size={36} style={{ color: theme.muted_color }} />
                    <p className="mt-4 text-sm" style={{ color: theme.muted_color }}>This store has not added contact information yet.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ id, theme, children }: { id: string; theme: ThemeSettings; children: ReactNode }) {
  return <h3 id={id} className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.muted_color }}>{children}</h3>;
}

function ProfileLink({ href, icon, label, value, theme, external = false }: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  theme: ThemeSettings;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl border p-3 transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2"
      style={{ borderColor: `${theme.muted_color}35` }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${theme.primary_color}14`, color: theme.primary_color }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs" style={{ color: theme.muted_color }}>{label}</span>
        <span className="block truncate text-sm font-semibold">{value}</span>
      </span>
      {external && <ExternalLink size={15} style={{ color: theme.muted_color }} />}
    </a>
  );
}
