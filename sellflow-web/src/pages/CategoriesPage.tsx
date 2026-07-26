import { useEffect, useState } from "react";
import { 
  Pencil, 
  Plus, 
  Trash2, 
  X, 
  FolderTree, 
  Tag,
  ChevronRight,
  EyeOff,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import { categoryService } from "../Services/category";
import type { Category } from "../types/category";
import {
  EmptyState,
  ErrorMessage,
  PageHeader,
  buttonPrimary,
  buttonSecondary,
  inputClass,
} from "../components/dashboard/DashboardUI";

type Form = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
  is_active: boolean;
};

const blankForm: Form = {
  name: "",
  slug: "",
  description: "",
  image: "",
  sort_order: 0,
  is_active: true,
};

// Color palette for category cards
const cardColors = [
  { bg: "from-violet-50 to-purple-50", border: "border-violet-200", icon: "text-violet-600" },
  { bg: "from-blue-50 to-indigo-50", border: "border-blue-200", icon: "text-blue-600" },
  { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", icon: "text-emerald-600" },
  { bg: "from-amber-50 to-orange-50", border: "border-amber-200", icon: "text-amber-600" },
  { bg: "from-rose-50 to-pink-50", border: "border-rose-200", icon: "text-rose-600" },
  { bg: "from-cyan-50 to-sky-50", border: "border-cyan-200", icon: "text-cyan-600" },
];

export function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState<Form>(blankForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = () => {
    categoryService
      .getCategories()
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const show = (item?: Category) => {
    setError(null);
    setEditing(item?.id || null);

    if (item) {
      setForm({
        name: item.name,
        slug: item.slug,
        description: item.description || "",
        image: item.image || "",
        sort_order: item.sort_order,
        is_active: item.is_active,
      });
    } else {
      setForm(blankForm);
    }

    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editing) {
        await categoryService.updateCategory(editing, form);
      } else {
        await categoryService.createCategory(form);
      }

      setOpen(false);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Category) => {
    if (!confirm(`Delete “${item.name}”?`)) return;

    setError(null);

    try {
      await categoryService.deleteCategory(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize products into clear sections for your customers."
        action={
          <button className={`${buttonPrimary} gap-2`} onClick={() => show()}>
            <Plus size={17} />
            Add category
          </button>
        }
      />

      <ErrorMessage error={error} />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />
                  <div>
                    <div className="h-5 w-32 rounded bg-slate-200" />
                    <div className="mt-1 h-3 w-24 rounded bg-slate-200" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-9 rounded-lg bg-slate-200" />
                  <div className="h-9 w-9 rounded-lg bg-slate-200" />
                </div>
              </div>
              <div className="mt-4 h-12 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const colorIndex = index % cardColors.length;
            const colors = cardColors[colorIndex];
            
            return (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50`}
              >
                {/* Decorative accent */}
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Category Icon/Avatar */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm shadow-sm ${colors.icon}`}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <FolderTree className="h-6 w-6" />
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-base font-semibold text-slate-900">
                            {item.name}
                          </h2>
                          {item.is_active ? (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              <EyeOff className="h-2.5 w-2.5" />
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Tag className="h-3 w-3" />
                          <span className="truncate">/{item.slug}</span>
                          <span className="text-slate-300">·</span>
                          <span>Order {item.sort_order}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-1">
                      <button
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-white/60 hover:text-blue-600"
                        onClick={() => show(item)}
                        aria-label="Edit category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-white/60 hover:text-red-600"
                        onClick={() => remove(item)}
                        aria-label="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 text-sm text-slate-600 leading-relaxed">
                    {item.description || "No description added."}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/60 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>Created {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => show(item)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      View details
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-12">
          <EmptyState
            title="No categories yet"
            description="Create your first category before adding products."
            action={
              <button className={`${buttonPrimary} gap-2`} onClick={() => show()}>
                <Plus size={17} />
                Create category
              </button>
            }
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {open && (
        <Modal
          title={editing ? "Edit category" : "New category"}
          close={() => setOpen(false)}
        >
          <form onSubmit={submit} className="space-y-4 sm:space-y-5">
            {/* Name & Slug Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Name *
                <input
                  autoFocus
                  required
                  className={`${inputClass} mt-1.5`}
                  placeholder="e.g., Electronics"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((v) => ({
                      ...v,
                      name,
                      slug: editing
                        ? v.slug
                        : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
                    }));
                  }}
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Slug *
                <input
                  required
                  className={`${inputClass} mt-1.5`}
                  placeholder="e.g., electronics"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, slug: e.target.value }))
                  }
                />
              </label>
            </div>

            {/* Description */}
            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea
                rows={3}
                className={`${inputClass} mt-1.5 resize-none`}
                placeholder="Brief description of this category..."
                value={form.description}
                onChange={(e) =>
                  setForm((v) => ({ ...v, description: e.target.value }))
                }
              />
            </label>

            {/* Image URL */}
            <label className="block text-sm font-medium text-slate-700">
              Image URL
              <div className="relative mt-1.5">
                <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${inputClass} pl-10`}
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, image: e.target.value }))
                  }
                />
              </div>
            </label>

            {/* Sort Order & Active */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Sort order
                <input
                  type="number"
                  min="0"
                  className={`${inputClass} mt-1.5`}
                  placeholder="0"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      sort_order: Number(e.target.value),
                    }))
                  }
                />
              </label>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm((v) => ({ ...v, is_active: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  Category is active
                  <span className="ml-1 text-xs text-slate-400">
                    (visible in store)
                  </span>
                </label>
              </div>
            </div>

            <ErrorMessage error={error} />

            {/* Actions */}
            <div className="sticky -bottom-4 -mx-4 flex justify-end gap-3 border-t border-slate-200 bg-white px-4 pb-4 pt-4 sm:-bottom-6 sm:-mx-6 sm:px-6 sm:pb-6 sm:pt-5">
              <button
                type="button"
                className={`${buttonSecondary} px-6`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button 
                disabled={saving} 
                className={`${buttonPrimary} px-6 gap-2`}
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  editing ? "Update category" : "Create category"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/**
 * Reusable modal component with improved design
 */
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  // Close on Escape key
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/50 p-2 backdrop-blur-sm transition-opacity duration-300 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl shadow-slate-950/20 transition-all duration-300 animate-in slide-in-from-bottom-4 sm:max-h-[calc(100dvh-2rem)]"
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              {title.includes('Edit') ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </div>
            <h2 id="category-modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close category modal"
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}


export { Modal };
