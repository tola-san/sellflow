import { useEffect, useState } from "react";
import { Check, ExternalLink, Monitor, Save, Smartphone, Store } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { businessService } from "../Services/business";
import { themeService } from "../Services/theme";
import { ErrorMessage, PageHeader, buttonPrimary, inputClass } from "../components/dashboard/DashboardUI";
import { useToast } from "../components/ui/ToastContext";
import type { Business } from "../types/business";
import { THEME_PRESETS, type ThemeSettings } from "../types/theme";
import { CUSTOMER_THEMES, CUSTOMER_THEME_LABELS, type CustomerThemeId } from "../theme/customerThemes";
import { DASHBOARD_THEMES, getDashboardThemeId, saveDashboardTheme, type DashboardThemeId } from "../theme/dashboardThemes";
import { withHexOpacity } from "../lib/color";

export function ThemePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [theme, setTheme] = useState<ThemeSettings>(THEME_PRESETS.modern);
  const [selectedTemplate, setSelectedTemplate] = useState<CustomerThemeId | null>(null);
  const [dashboardTheme, setDashboardTheme] = useState<DashboardThemeId>(() => getDashboardThemeId());
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([businessService.getBusiness(), themeService.getTheme()])
      .then(([businessData, themeData]) => {
        setBusiness(businessData);
        if (themeData) {
          const resolvedTheme = { ...THEME_PRESETS[themeData.preset], ...themeData };
          setTheme(resolvedTheme);
          setSelectedTemplate(findMatchingTemplate(resolvedTheme));
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSelectedTemplate(null);
    setTheme((current) => ({ ...current, [key]: value }));
  };

  const selectTemplate = (template: CustomerThemeId) => {
    setSelectedTemplate(template);
    setTheme({ ...CUSTOMER_THEMES[template] });
  };

  const publish = async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await themeService.publishTheme(theme);
      setTheme(saved);
      showToast("Storefront theme published successfully.");
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading theme editor...</p>;

  if (!business) {
    return <><PageHeader title="Storefront theme" description="Create your business profile before designing its storefront."/><div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">A business profile is required before a theme can be published.</div></>;
  }

  return (
    <>
      <PageHeader
        title="Storefront theme"
        description="Choose a preset, customize the details, and preview your public store before publishing."
        action={<a href={`/${business.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700">Open storefront <ExternalLink size={16}/></a>}
      />
      <ErrorMessage error={error}/>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <div className="space-y-6">
          <Panel title="Dashboard appearance" description="Personalize your private SellFlow workspace. This does not change the customer storefront.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(DASHBOARD_THEMES) as DashboardThemeId[]).map((themeId) => {
                const item = DASHBOARD_THEMES[themeId];
                const active = dashboardTheme === themeId;
                return <button key={themeId} type="button" onClick={() => { setDashboardTheme(themeId); saveDashboardTheme(themeId); }} className={`relative rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-200"}`}>
                  {active && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-white shadow" style={{ backgroundColor: item.accent }}><Check size={14}/></span>}
                  <span className="block h-16 overflow-hidden rounded-lg border" style={{ backgroundColor: item.canvas, borderColor: item.border }}>
                    <span className="m-2 flex h-12 overflow-hidden rounded-md" style={{ backgroundColor: item.surface }}>
                      <span className="w-4" style={{ backgroundColor: item.accent }}/><span className="m-auto h-2 w-12 rounded-full" style={{ backgroundColor: item.accentSoft }}/>
                    </span>
                  </span>
                  <span className="mt-2 block text-sm font-semibold">{item.label}</span>
                </button>;
              })}
            </div>
          </Panel>

          <Panel title="Theme gallery" description="Choose a ready-made theme, then customize every detail below before publishing.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(CUSTOMER_THEMES) as CustomerThemeId[]).map((template) => {
                const item = CUSTOMER_THEMES[template];
                const active = selectedTemplate === template;
                return <button key={template} type="button" onClick={() => selectTemplate(template)} className={`group relative overflow-hidden rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-200 hover:border-slate-300"}`}>
                  {active && <span className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-purple-600 text-white shadow"><Check size={14}/></span>}
                  <span className="relative flex h-20 overflow-hidden rounded-lg border border-black/5" style={{ background: `linear-gradient(135deg, ${item.background_color}, ${item.primary_color}45)` }}>
                    <span className="m-auto h-10 w-16 rounded-lg" style={{ backgroundColor: item.surface_color, boxShadow: item.card_style === "elevated" ? "0 8px 20px #0003" : "none", border: item.card_style === "bordered" ? `1px solid ${item.muted_color}55` : "none" }}>
                      <span className="mx-auto mt-3 block h-2 w-9 rounded-full" style={{ backgroundColor: item.primary_color }}/>
                    </span>
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{CUSTOMER_THEME_LABELS[template]}</span>
                    <span className="flex gap-1" aria-hidden="true">
                      {[item.primary_color, item.secondary_color, item.surface_color].map((color) => <span key={color} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: color }}/>) }
                    </span>
                  </span>
                </button>;
              })}
            </div>
          </Panel>

          <Panel title="Brand colors" description="All values are validated before publishing.">
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorControl label="Primary" value={theme.primary_color} onChange={(v) => update("primary_color", v)}/>
              <ColorControl label="Secondary" value={theme.secondary_color} onChange={(v) => update("secondary_color", v)}/>
              <ColorControl label="Background" value={theme.background_color} onChange={(v) => update("background_color", v)}/>
              <ColorControl label="Surface" value={theme.surface_color} onChange={(v) => update("surface_color", v)}/>
              <ColorControl label="Text" value={theme.text_color} onChange={(v) => update("text_color", v)}/>
              <ColorControl label="Muted text" value={theme.muted_color} onChange={(v) => update("muted_color", v)}/>
            </div>
          </Panel>

          <Panel title="Layout and components" description="Customize the storefront without allowing unsafe custom CSS.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectControl label="Typography" value={theme.font_family} onChange={(v) => update("font_family", v as ThemeSettings["font_family"])} options={["system","modern","classic"]}/>
              <SelectControl label="Product cards" value={theme.card_style} onChange={(v) => update("card_style", v as ThemeSettings["card_style"])} options={["elevated","bordered","flat"]}/>
              <SelectControl label="Buttons" value={theme.button_style} onChange={(v) => update("button_style", v as ThemeSettings["button_style"])} options={["rounded","pill","square"]}/>
              <SelectControl label="Store hero" value={theme.hero_style} onChange={(v) => update("hero_style", v as ThemeSettings["hero_style"])} options={["gradient","banner","minimal"]}/>
              <SelectControl label="Desktop grid" value={String(theme.grid_columns)} onChange={(v) => update("grid_columns", Number(v) as ThemeSettings["grid_columns"])} options={["2","3","4"]}/>
            </div>
            {business.banner && (
              <BannerOverlayControl
                value={theme.banner_overlay_opacity ?? 35}
                primaryColor={theme.primary_color}
                secondaryColor={theme.secondary_color}
                onChange={(value) => update("banner_overlay_opacity", value)}
              />
            )}
          </Panel>

          <button type="button" disabled={saving} onClick={publish} className={buttonPrimary}><Save size={17}/>{saving ? "Publishing..." : "Publish theme"}</button>
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Live preview</p>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1">
              <PreviewButton active={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")} label="Desktop"><Monitor size={15}/></PreviewButton>
              <PreviewButton active={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")} label="Mobile"><Smartphone size={15}/></PreviewButton>
            </div>
          </div>
          <StorePreview business={business} theme={theme} mobile={previewMode === "mobile"}/>
        </div>
      </div>
    </>
  );
}

function findMatchingTemplate(theme: ThemeSettings): CustomerThemeId | null {
  const keys = Object.keys(theme) as Array<keyof ThemeSettings>;
  return (Object.keys(CUSTOMER_THEMES) as CustomerThemeId[]).find((template) =>
    keys.every((key) => CUSTOMER_THEMES[template][key] === theme[key])
  ) ?? null;
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>{children}</section>;
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium">{label}<span className="mt-1.5 flex gap-2"><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-12 rounded-lg border border-slate-200 bg-white p-1"/><input value={value} onChange={(e) => onChange(e.target.value)} pattern="#[0-9A-Fa-f]{6}" className={`${inputClass} mt-0 font-mono uppercase`}/></span></label>;
}

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium">{label}<select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option} value={option}>{option.replace("_", " ")}</option>)}</select></label>;
}

function PreviewButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`rounded-md p-1.5 ${active ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"}`}>{children}</button>;
}

function StorePreview({ business, theme, mobile }: { business: Business; theme: ThemeSettings; mobile: boolean }) {
  const radius = theme.button_style === "pill" ? "999px" : theme.button_style === "square" ? "4px" : "12px";
  const cardShadow = theme.card_style === "elevated" ? "0 12px 28px rgba(15,23,42,.12)" : "none";
  const cardBorder = theme.card_style === "bordered" ? `1px solid ${theme.muted_color}45` : "1px solid transparent";
  const font = theme.font_family === "classic"
    ? "Georgia, 'Kantumruy Pro', serif"
    : "'Plus Jakarta Sans', 'Kantumruy Pro', ui-sans-serif, system-ui";
  const previewHasBanner = Boolean(business.banner);
  const previewOverlayOpacity = theme.banner_overlay_opacity ?? 35;
  const previewHeroBackground = previewHasBanner
    ? `linear-gradient(90deg, ${withHexOpacity(theme.secondary_color, previewOverlayOpacity)}, ${withHexOpacity(theme.primary_color, previewOverlayOpacity * 0.36)}), url("${business.banner}") center / cover`
    : theme.hero_style === "gradient"
      ? `linear-gradient(135deg, ${theme.primary_color}, ${theme.secondary_color})`
      : theme.hero_style === "banner"
        ? `linear-gradient(135deg, ${theme.secondary_color}, ${theme.primary_color}99)`
        : theme.background_color;
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-200 p-2 shadow-sm"><div className={`mx-auto overflow-hidden bg-white transition-all duration-300 ${mobile ? "max-w-[320px] rounded-[1.5rem]" : "w-full rounded-xl"}`} style={{ fontFamily: font, color: theme.text_color }}>
    <div className="flex h-12 items-center gap-2 border-b px-4" style={{ backgroundColor: theme.surface_color, borderColor: `${theme.muted_color}35` }}>{business.logo ? <img src={business.logo} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <span className="grid h-7 w-7 place-items-center rounded-lg text-white" style={{ backgroundColor: theme.primary_color }}><Store size={14}/></span>}<strong className="text-xs">{business.name}</strong><span className="ml-auto h-7 w-16" style={{ borderRadius: radius, backgroundColor: `${theme.primary_color}18` }}/></div>
    <div className="px-5 py-9" style={{ background: previewHeroBackground, color: theme.hero_style === "minimal" && !previewHasBanner ? theme.text_color : "white" }}><p className="text-[9px] font-bold uppercase tracking-widest opacity-75">Welcome to</p><h3 className="mt-1 text-xl font-bold">{business.name}</h3><p className="mt-2 max-w-xs text-[10px] opacity-75">Discover our latest products and collections.</p>{(business.facebook_url || business.instagram_url || business.telegram_url || business.tiktok_url) && <div className="mt-3 flex gap-1.5 text-[10px]"><PreviewSocial show={Boolean(business.facebook_url)}><FaFacebookF /></PreviewSocial><PreviewSocial show={Boolean(business.instagram_url)}><FaInstagram /></PreviewSocial><PreviewSocial show={Boolean(business.telegram_url)}><FaTelegramPlane /></PreviewSocial><PreviewSocial show={Boolean(business.tiktok_url)}><FaTiktok /></PreviewSocial></div>}</div>
    <div className="flex gap-2 overflow-hidden border-b p-3" style={{ backgroundColor: theme.surface_color, borderColor: `${theme.muted_color}35` }}><span className="px-3 py-1.5 text-[9px] font-semibold text-white" style={{ borderRadius: radius, backgroundColor: theme.primary_color }}>All products</span>{["Featured","New"].map((item)=><span key={item} className="border px-3 py-1.5 text-[9px]" style={{ borderRadius: radius, borderColor: `${theme.muted_color}45` }}>{item}</span>)}</div>
    <div className={`grid gap-3 p-4 ${mobile ? "grid-cols-2" : theme.grid_columns === 2 ? "grid-cols-2" : theme.grid_columns === 3 ? "grid-cols-3" : "grid-cols-4"}`} style={{ backgroundColor: theme.background_color }}>{[0,1,2,3].slice(0, mobile ? 4 : theme.grid_columns).map((item)=><div key={item} className="overflow-hidden" style={{ borderRadius: theme.button_style === "square" ? "6px" : "14px", backgroundColor: theme.surface_color, boxShadow: cardShadow, border: cardBorder }}><div className="aspect-square" style={{ background: `linear-gradient(135deg, ${theme.primary_color}20, ${theme.secondary_color}30)` }}/><div className="p-2"><p className="text-[8px] font-bold" style={{ color: theme.primary_color }}>CATEGORY</p><div className="mt-1 h-2 w-3/4 rounded bg-current opacity-70"/><div className="mt-2 h-2 w-1/3 rounded" style={{ backgroundColor: theme.primary_color }}/></div></div>)}</div>
  </div></div>;
}

function PreviewSocial({ show, children }: { show: boolean; children: React.ReactNode }) {
  return show ? <span className="grid h-6 w-6 place-items-center rounded-full border border-white/30 bg-white/15">{children}</span> : null;
}

function BannerOverlayControl({ value, primaryColor, secondaryColor, onChange }: { value: number; primaryColor: string; secondaryColor: string; onChange: (value: number) => void }) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Banner overlay</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Lower values show more of the uploaded image. Increase it when storefront text needs stronger contrast.</p>
        </div>
        <span className="min-w-14 rounded-lg bg-white px-2.5 py-1 text-center text-sm font-bold text-purple-700 shadow-sm ring-1 ring-slate-200">{value}%</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500">Clear</span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          aria-label="Banner overlay opacity"
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-purple-600"
          style={{ background: `linear-gradient(90deg, transparent, ${secondaryColor}, ${primaryColor})` }}
        />
        <span className="text-xs font-medium text-slate-500">Strong</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span className="h-4 w-8 rounded border border-slate-200 bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:8px_8px]" />
        Transparent background is supported at 0%.
      </div>
    </div>
  );
}
