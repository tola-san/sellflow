import {
  BarChart3,
  Boxes,
  Briefcase,
  Calendar,
  ClipboardList,
  Clock,
  Coffee,
  CreditCard,
  Download,
  FileText,
  FolderTree,
  Hash,
  Key,
  Layers,
  LayoutDashboard,
  ListPlus,
  Package,
  Palette,
  Ruler,
  ScanBarcode,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { BusinessType } from "../../types/businessTypes";
import { businessTypeLabel } from "../../types/businessTypes";

export interface DashboardModule {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  path?: string;
  end?: boolean;
  badge?: "New";
  status: "available" | "planned";
}

export interface DashboardModuleSection {
  key: string;
  label: string;
  modules: DashboardModule[];
  personalized?: boolean;
}

const sharedSections: DashboardModuleSection[] = [
  {
    key: "core",
    label: "Workspace",
    modules: [
      {
        key: "overview",
        label: "Overview",
        description: "Store performance and recent activity",
        icon: LayoutDashboard,
        path: "/dashboard",
        end: true,
        status: "available",
      },
      {
        key: "business",
        label: "Business profile",
        description: "Store identity and contact details",
        icon: Store,
        path: "/dashboard/business",
        status: "available",
      },
    ],
  },
  {
    key: "catalog",
    label: "Catalog",
    modules: [
      {
        key: "categories",
        label: "Categories",
        description: "Organize the storefront catalog",
        icon: FolderTree,
        path: "/dashboard/categories",
        status: "available",
      },
      {
        key: "products",
        label: "Products",
        description: "Pricing, media, and inventory",
        icon: Package,
        path: "/dashboard/products",
        status: "available",
      },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    modules: [
      {
        key: "orders",
        label: "Orders",
        description: "Payments and fulfillment workflow",
        icon: ShoppingCart,
        path: "/dashboard/orders",
        badge: "New",
        status: "available",
      },
      {
        key: "customers",
        label: "Customers",
        description: "Customer records and order history",
        icon: Users,
        status: "planned",
      },
      {
        key: "payments",
        label: "Payments",
        description: "Bakong and payment reconciliation",
        icon: CreditCard,
        status: "planned",
      },
    ],
  },
  {
    key: "store",
    label: "Store",
    modules: [
      {
        key: "theme",
        label: "Theme",
        description: "Dashboard and storefront appearance",
        icon: Palette,
        path: "/dashboard/theme",
        status: "available",
      },
      {
        key: "notifications",
        label: "Notifications",
        description: "Telegram destinations and preferences",
        icon: Send,
        path: "/dashboard/notifications",
        badge: "New",
        status: "available",
      },
    ],
  },
];

const personalizedModules: Record<BusinessType, DashboardModule[]> = {
  food_beverage: [
    planned("menu", "Menu", "Organize food and drink offerings", Coffee),
    planned("modifiers", "Modifiers", "Sizes, extras, and preparation choices", ListPlus),
    planned("kitchen", "Kitchen", "Preparation queue and kitchen statuses", ClipboardList),
  ],
  fashion: [
    planned("collections", "Collections", "Seasonal and curated product groups", Layers),
    planned("variants", "Product variants", "Size, color, SKU, and variant stock", Boxes),
    planned("size-guide", "Size guide", "Reusable measurements and fitting guides", Ruler),
  ],
  beauty: [
    planned("brands", "Brands", "Organize products by brand", Tag),
    planned("appointments", "Appointments", "Customer booking calendar", Calendar),
    planned("staff", "Staff", "Team members and service availability", Users),
  ],
  electronics: [
    planned("specifications", "Specifications", "Structured technical product details", Settings),
    planned("warranties", "Warranties", "Warranty periods and customer claims", ShieldCheck),
    planned("serial-numbers", "Serial numbers", "Track serialized inventory", Hash),
  ],
  grocery_retail: [
    planned("barcodes", "Barcodes", "Scan and manage product barcodes", ScanBarcode),
    planned("suppliers", "Suppliers", "Supplier records and purchasing details", Truck),
    planned("expiry-tracking", "Expiry tracking", "Batch and expiration-date alerts", Clock),
  ],
  services: [
    planned("services", "Services", "Service catalog, prices, and duration", Briefcase),
    planned("bookings", "Bookings", "Customer appointments and requests", Calendar),
    planned("staff-availability", "Staff availability", "Working hours and assignments", UserRound),
  ],
  digital_products: [
    planned("digital-files", "Digital files", "Secure downloadable product assets", FileText),
    planned("licenses", "Licenses", "License keys and access rules", Key),
    planned("downloads", "Downloads", "Customer delivery and download history", Download),
  ],
  other: [],
};

const insightsSection: DashboardModuleSection = {
  key: "insights",
  label: "Insights",
  modules: [
    planned("analytics", "Advanced analytics", "Sales trends, best sellers, and reports", BarChart3),
  ],
};

export function dashboardModuleSections(businessType?: BusinessType | null): DashboardModuleSection[] {
  const sections = [...sharedSections];
  const typeModules = businessType ? personalizedModules[businessType] : [];

  if (businessType && typeModules.length > 0) {
    sections.push({
      key: "business-tools",
      label: `${businessTypeLabel(businessType)} tools`,
      modules: typeModules,
      personalized: true,
    });
  }

  sections.push(insightsSection);

  return sections;
}

function planned(key: string, label: string, description: string, icon: LucideIcon): DashboardModule {
  return { key, label, description, icon, status: "planned" };
}
