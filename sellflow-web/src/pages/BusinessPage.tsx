import { useEffect, useState } from "react";
import { ImagePlus, Save, Store, Upload, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { businessService, type BusinessPayload } from "../Services/business";
import type { Business } from "../types/business";
import { ErrorMessage, PageHeader, buttonPrimary, inputClass } from "../components/dashboard/DashboardUI";

const emptyBusiness: Business = {
  id: 0,
  name: "",
  slug: "",
  logo: null,
  banner: null,
  description: "",
  phone: "",
  website: "",
  facebook_url: "",
  instagram_url: "",
  telegram_url: "",
  tiktok_url: "",
  address: "",
  city: "",
  country: "",
  primary_color: "#7c3aed",
  secondary_color: "#0f172a",
  is_active: true,
  theme: {} as Business["theme"],
  created_at: "",
};

export function BusinessPage() {
  const [exists, setExists] = useState(false);
  const [form, setForm] = useState<Business>(emptyBusiness);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    businessService.getBusiness().then((business) => {
      if (business) {
        setExists(true);
        setForm({ ...emptyBusiness, ...business });
      }
    }).catch(setError).finally(() => setLoading(false));
  }, []);

  const change = (key: keyof Business, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess("");

    const { id: _id, logo: _logo, banner: _banner, theme: _theme, created_at: _createdAt, ...fields } = form;
    const payload: BusinessPayload = {
      ...fields,
      logo_image: logoFile,
      banner_image: bannerFile,
      remove_logo: removeLogo,
      remove_banner: removeBanner,
    };

    try {
      const saved = await businessService.saveBusiness(payload, exists);
      setExists(true);
      setForm({ ...emptyBusiness, ...saved });
      setLogoFile(null);
      setBannerFile(null);
      setRemoveLogo(false);
      setRemoveBanner(false);
      setSuccess("Business profile saved successfully.");
    } catch (exception) {
      setError(exception);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading business profile...</p>;

  return (
    <>
      <PageHeader title="Business profile" description="Build a recognizable storefront and make it easy for customers to reach you." />
      <ErrorMessage error={error} />
      {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={submit} className="max-w-5xl space-y-6 pb-10">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Store visuals</h2>
            <p className="mt-1 text-sm text-slate-500">Upload images that represent your brand. JPG, PNG, or WebP up to 4 MB.</p>
          </div>
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[220px_1fr]">
            <ImageUpload
              label="Store logo"
              help="Square image recommended"
              aspect="square"
              file={logoFile}
              currentUrl={removeLogo ? null : form.logo}
              onSelect={(file) => { setLogoFile(file); setRemoveLogo(false); }}
              onRemove={() => { setLogoFile(null); setRemoveLogo(true); }}
            />
            <ImageUpload
              label="Store banner"
              help="Wide image, 1600 × 600 recommended · displayed with a soft brand gradient"
              aspect="banner"
              file={bannerFile}
              currentUrl={removeBanner ? null : form.banner}
              onSelect={(file) => { setBannerFile(file); setRemoveBanner(false); }}
              onRemove={() => { setBannerFile(null); setRemoveBanner(true); }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Store identity" description="The basic information customers see on your storefront." />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Business name" required value={form.name} onChange={(value) => {
              change("name", value);
              if (!exists) change("slug", value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
            }} />
            <Field label="Store URL slug" required prefix="sellflow.com/" value={form.slug} onChange={(value) => change("slug", value)} />
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea rows={4} className={inputClass} placeholder="Tell customers what makes your store special..." value={form.description ?? ""} onChange={(event) => change("description", event.target.value)} />
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:col-span-2">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-purple-600" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} />
              <span><strong className="block text-slate-800">Store is active</strong><span className="mt-0.5 block text-slate-500">Customers can open your public store and place orders.</span></span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Contact & location" description="Public contact information for customer questions and delivery." />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Phone" value={form.phone} placeholder="+855 12 345 678" onChange={(value) => change("phone", value)} />
            <Field label="Website" type="url" value={form.website} placeholder="https://yourstore.com" onChange={(value) => change("website", value)} />
            <Field label="Address" value={form.address} onChange={(value) => change("address", value)} />
            <Field label="City" value={form.city} onChange={(value) => change("city", value)} />
            <Field label="Country" value={form.country} onChange={(value) => change("country", value)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Social media" description="Add full profile links. Icons will appear on your public storefront." />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SocialField icon={<FaFacebookF />} label="Facebook" value={form.facebook_url} placeholder="https://facebook.com/yourstore" onChange={(value) => change("facebook_url", value)} />
            <SocialField icon={<FaInstagram />} label="Instagram" value={form.instagram_url} placeholder="https://instagram.com/yourstore" onChange={(value) => change("instagram_url", value)} />
            <SocialField icon={<FaTelegramPlane />} label="Telegram" value={form.telegram_url} placeholder="https://t.me/yourstore" onChange={(value) => change("telegram_url", value)} />
            <SocialField icon={<FaTiktok />} label="TikTok" value={form.tiktok_url} placeholder="https://tiktok.com/@yourstore" onChange={(value) => change("tiktok_url", value)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Brand colors" description="Used across storefront buttons, highlights, and backgrounds." />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ColorField label="Primary" value={form.primary_color} onChange={(value) => change("primary_color", value)} />
            <ColorField label="Secondary" value={form.secondary_color} onChange={(value) => change("secondary_color", value)} />
          </div>
        </section>

        <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <button disabled={saving} className={`${buttonPrimary} w-full justify-center sm:w-auto`} type="submit"><Save size={17} />{saving ? "Saving..." : "Save business profile"}</button>
        </div>
      </form>
    </>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <div><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>;
}

function ImageUpload({ label, help, aspect, file, currentUrl, onSelect, onRemove }: {
  label: string; help: string; aspect: "square" | "banner"; file: File | null; currentUrl: string | null;
  onSelect: (file: File) => void; onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const image = preview || currentUrl;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="text-xs text-slate-500">{help}</p></div>{image && <button type="button" onClick={onRemove} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${label}`}><X size={17} /></button>}</div>
      <label className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-purple-300 hover:bg-purple-50/40 ${aspect === "square" ? "aspect-square w-full" : "aspect-[16/6] w-full"}`}>
        {image ? <img src={image} alt={`${label} preview`} className="h-full w-full object-cover" /> : <div className="px-4 text-center text-slate-500"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-purple-600 shadow-sm">{aspect === "square" ? <ImagePlus size={22} /> : <Store size={22} />}</span><p className="mt-3 text-sm font-semibold text-slate-700">Upload {label.toLowerCase()}</p><p className="mt-1 text-xs">Click to browse</p></div>}
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950/75 px-3 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100"><Upload size={15} />Replace image</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) onSelect(selected); event.target.value = ""; }} />
      </label>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "", prefix }: { label: string; value: string | null; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; prefix?: string }) {
  return <label className="text-sm font-medium text-slate-700">{label}<span className="mt-1.5 flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">{prefix && <span className="hidden items-center border-r border-slate-200 bg-slate-50 px-3 text-slate-400 sm:flex">{prefix}</span>}<input className="min-w-0 flex-1 px-3.5 py-2.5 text-sm outline-none" type={type} required={required} placeholder={placeholder} value={value || ""} onChange={(event) => onChange(event.target.value)} /></span></label>;
}

function SocialField({ icon, label, value, placeholder, onChange }: { icon: React.ReactNode; label: string; value: string | null; placeholder: string; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium text-slate-700">{label}<span className="mt-1.5 flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100"><span className="grid w-11 shrink-0 place-items-center border-r border-slate-200 bg-slate-50 text-slate-500">{icon}</span><input type="url" className="min-w-0 flex-1 px-3 py-2.5 outline-none" value={value || ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></span></label>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium text-slate-700">{label}<span className="mt-1.5 flex gap-2"><input className="h-11 w-14 rounded-lg border border-slate-200 p-1" type="color" value={value} onChange={(event) => onChange(event.target.value)} /><input className={`${inputClass} mt-0`} value={value} onChange={(event) => onChange(event.target.value)} /></span></label>;
}
