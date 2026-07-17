import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { businessService } from "../Services/business";
import type { Business } from "../types/business";
import { ErrorMessage, PageHeader, buttonPrimary, inputClass } from "../components/dashboard/DashboardUI";

/** Default/empty state for the business form */
const emptyBusiness: Business = {
  name: "",
  slug: "",
  logo: "",
  banner: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  country: "",
  primary_color: "#7c3aed",
  secondary_color: "#0f172a",
  is_active: true,
  id: 0,
  // Provide a default empty theme object to satisfy ThemeSettings type
  theme: {} as any,
  created_at: ""
};

export function BusinessPage() {
  // Form state
  const [exists, setExists] = useState(false);
  const [form, setForm] = useState(emptyBusiness);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [success, setSuccess] = useState("");

  /**
   * Load existing business data on mount
   */
  useEffect(() => {
    businessService
      .getBusiness()
      .then((b) => {
        if (b) {
          setExists(true);
          setForm({ ...emptyBusiness, ...b });
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  /**
   * Generic handler to update a single field in the form
   */
  const change = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handle form submission - save business profile
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess("");

    try {
      const saved = await businessService.saveBusiness(
        form as Partial<Business>,
        exists
      );

      setExists(true);
      setForm({ ...emptyBusiness, ...saved });
      setSuccess("Business profile saved successfully.");
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading business profile…</p>;
  }

  return (
    <>
      <PageHeader
        title="Business profile"
        description="Manage the identity and contact details shown in your catalog."
      />

      <ErrorMessage error={error} />

      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={submit} className="max-w-4xl space-y-6">
        {/* Store Identity Section */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Store identity</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Business name"
              required
              value={form.name}
              onChange={(v) => {
                change("name", v);
                // Auto-generate slug from name when creating new business
                if (!exists) {
                  change(
                    "slug",
                    v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
                  );
                }
              }}
            />

            <Field
              label="Catalog slug"
              required
              value={form.slug}
              onChange={(v) => change("slug", v)}
            />

            <Field
              label="Logo URL"
              type="url"
              placeholder="https://"
              value={form.logo}
              onChange={(v) => change("logo", v)}
            />

            <Field
              label="Banner URL"
              type="url"
              placeholder="https://"
              value={form.banner}
              onChange={(v) => change("banner", v)}
            />

            <label className="sm:col-span-2 text-sm font-medium">
              Description
              <textarea
                rows={4}
                className={inputClass}
                value={form.description ?? ""}
                onChange={(e) => change("description", e.target.value)}
              />
            </label>

            <label className="sm:col-span-2 flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((v) => ({ ...v, is_active: e.target.checked }))
                }
              />
              <span>
                <span className="block">Store is active</span>
                <span className="font-normal text-slate-500">
                  Inactive stores return 404 and are hidden from customers.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Contact details</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => change("email", v)}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => change("phone", v)}
            />
            <Field
              label="Website"
              type="url"
              placeholder="https://"
              value={form.website}
              onChange={(v) => change("website", v)}
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => change("address", v)}
            />
            <Field
              label="City"
              value={form.city}
              onChange={(v) => change("city", v)}
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(v) => change("country", v)}
            />
          </div>
        </section>

        {/* Brand Colors Section */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Brand colors</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ColorField
              label="Primary"
              value={form.primary_color}
              onChange={(v) => change("primary_color", v)}
            />
            <ColorField
              label="Secondary"
              value={form.secondary_color}
              onChange={(v) => change("secondary_color", v)}
            />
          </div>
        </section>

        <button disabled={saving} className={buttonPrimary} type="submit">
          <Save size={17} />
          {saving ? "Saving…" : "Save business profile"}
        </button>
      </form>
    </>
  );
}

/** Reusable text input field component */
function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
  type?: string ;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        className={inputClass}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/** Reusable color picker field component */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <span className="mt-1.5 flex gap-2">
        <input
          className="h-11 w-14 rounded-lg border border-slate-200 p-1"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={`${inputClass} mt-0`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  );
}