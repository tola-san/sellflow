import {
  BarChart3,
  Boxes,
  Briefcase,
  CalendarDays,
  ClipboardList,
  CookingPot,
  CreditCard,
  Download,
  FileDown,
  FolderTree,
  KeyRound,
  LayoutDashboard,
  ListPlus,
  Package,
  Palette,
  QrCode,
  Send,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Truck,
  UserRoundCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { BusinessType } from "../../types/businessTypes";

export type SidebarProfile =
  | "retail"
  | "restaurant_food"
  | "service"
  | "digital_products"
  | "other";

export interface DashboardModule {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  path?: string;
  end?: boolean;
  badge?: "New";
  status: "available" | "planned";
  requiredPermission?: string;
  requiredFeature?: string;
}

export interface DashboardModuleSection {
  key: string;
  label: string;
  modules: DashboardModule[];
  personalized?: boolean;
}

const profileByBusinessType: Record<BusinessType, SidebarProfile> = {
  food_beverage: "restaurant_food",
  fashion: "retail",
  beauty: "retail",
  electronics: "retail",
  grocery_retail: "retail",
  services: "service",
  digital_products: "digital_products",
  other: "other",
};

const businessSections: Record<SidebarProfile, DashboardModuleSection[]> = {
  retail: [
    {
      key: "catalog",
      label: "Catalog",
      personalized: true,
      modules: [
        available("products", "Products", "Pricing, media, and product visibility", Package, "/dashboard/products"),
        available("categories", "Categories", "Organize the storefront catalog", FolderTree, "/dashboard/categories"),
        available("inventory", "Inventory", "Stock movements and low-stock management", Boxes, "/dashboard/inventory"),
        available("product-variants", "Product variants", "Sizes, colors, SKUs, and variant stock", ListPlus, "/dashboard/product-variants"),
        planned("discounts", "Discounts", "Promotions and scheduled price rules", Tags),
      ],
    },
  ],
  restaurant_food: [
    {
      key: "menu-management",
      label: "Menu management",
      personalized: true,
      modules: [
        available("menu-items", "Menu items", "Food and drink items available to customers", Package, "/dashboard/products"),
        available("menu-categories", "Menu categories", "Organize the customer-facing menu", FolderTree, "/dashboard/categories"),
        available("add-ons", "Add-ons", "Extras, sizes, and preparation options", ListPlus, "/dashboard/add-ons"),
        available("menu-availability", "Menu availability", "Schedule item and menu availability", CalendarDays, "/dashboard/menu-availability"),
      ],
    },
    {
      key: "restaurant-operations",
      label: "Restaurant operations",
      personalized: true,
      modules: [
        available("tables", "Tables & QR codes", "Table management and printable ordering QR codes", QrCode, "/dashboard/restaurant-tables"),
        planned("kitchen-orders", "Kitchen orders", "Live kitchen preparation queue", CookingPot),
        planned("reservations", "Reservations", "Customer table reservations", CalendarDays),
        planned("delivery-settings", "Delivery settings", "Pickup, delivery zones, and fees", Truck),
      ],
    },
  ],
  service: [
    {
      key: "services",
      label: "Services",
      personalized: true,
      modules: [
        available("services", "Services", "Service catalog, pricing, and duration", Briefcase, "/dashboard/products"),
        available("service-categories", "Service categories", "Organize services for customers", FolderTree, "/dashboard/categories"),
        planned("service-packages", "Packages", "Bundle services into customer packages", ClipboardList),
      ],
    },
    {
      key: "bookings",
      label: "Bookings",
      personalized: true,
      modules: [
        planned("appointments", "Appointments", "Customer appointment management", CalendarDays),
        planned("calendar", "Calendar", "Daily and weekly booking schedule", CalendarDays),
        planned("staff", "Staff", "Team members and service assignments", UserRoundCog),
        planned("availability", "Availability", "Working hours and booking rules", Settings),
      ],
    },
  ],
  digital_products: [
    {
      key: "digital-catalog",
      label: "Digital catalog",
      personalized: true,
      modules: [
        available("digital-products", "Digital products", "Downloads, courses, and digital goods", FileDown, "/dashboard/products"),
        available("collections", "Collections", "Organize related digital products", FolderTree, "/dashboard/categories"),
        planned("files", "Files", "Secure product files and versions", FileDown),
        planned("licenses", "Licenses", "License keys and access rules", KeyRound),
        planned("downloads", "Downloads", "Customer delivery and download history", Download),
      ],
    },
  ],
  other: [
    {
      key: "business",
      label: "Business",
      personalized: true,
      modules: [
        available("products-services", "Products or services", "Manage what your business offers", Package, "/dashboard/products"),
        available("categories", "Categories", "Organize your customer catalog", FolderTree, "/dashboard/categories"),
      ],
    },
  ],
};

export function sidebarProfileFor(businessType?: BusinessType | null): SidebarProfile {
  return businessType ? profileByBusinessType[businessType] ?? "other" : "other";
}

export function dashboardModuleSections(
  businessType?: BusinessType | null,
  storeSlug?: string | null,
  isActive = true,
): DashboardModuleSection[] {
  const profile = sidebarProfileFor(businessType);
  const system = systemSection();

  if (!isActive) {
    return [system];
  }

  return [
    workspaceSection(),
    ...businessSections[profile],
    salesSection(),
    storefrontSection(profile, storeSlug),
    growthSection(),
    system,
  ];
}

function workspaceSection(): DashboardModuleSection {
  return {
    key: "workspace",
    label: "Workspace",
    modules: [
      {
        ...available("overview", "Overview", "Store performance and recent activity", LayoutDashboard, "/dashboard"),
        end: true,
      },
    ],
  };
}

function salesSection(): DashboardModuleSection {
  return {
    key: "sales",
    label: "Sales",
    modules: [
      {
        ...available("orders", "Orders", "Payments and fulfillment workflow", ShoppingCart, "/dashboard/orders"),
        badge: "New",
      },
      planned("customers", "Customers", "Customer profiles and order history", Users),
    ],
  };
}

function storefrontSection(profile: SidebarProfile, storeSlug?: string | null): DashboardModuleSection {
  const designLabel = profile === "restaurant_food"
    ? "Menu design"
    : profile === "service"
      ? "Booking page design"
      : "Store design";
  const viewLabel = profile === "restaurant_food"
    ? "View menu"
    : profile === "service"
      ? "View booking page"
      : "View store";

  return {
    key: "storefront",
    label: "Storefront",
    modules: [
      available("store-design", designLabel, "Customize the customer-facing experience", Palette, "/dashboard/theme"),
      storeSlug
        ? available("view-store", viewLabel, "Open the public customer experience", Store, `/${storeSlug}`)
        : planned("view-store", viewLabel, "Open the public customer experience", Store),
    ],
  };
}

function growthSection(): DashboardModuleSection {
  return {
    key: "growth",
    label: "Growth",
    modules: [
      available("analytics", "Analytics", "Sales trends, best sellers, and reports", BarChart3, "/dashboard/analytics"),
      {
        ...available("telegram", "Telegram", "Telegram destinations and order alerts", Send, "/dashboard/notifications"),
        badge: "New",
      },
      planned("notifications", "Notifications", "Email and push notification preferences", Send),
    ],
  };
}

function systemSection(): DashboardModuleSection {
  return {
    key: "system",
    label: "System",
    modules: [
      available("business-profile", "Business profile", "Identity, contact details, and business type", Store, "/dashboard/business"),
      planned("billing", "Billing & plan", "Subscription, invoices, and plan features", CreditCard),
      planned("settings", "Settings", "Account and workspace preferences", Settings),
    ],
  };
}

function available(
  key: string,
  label: string,
  description: string,
  icon: LucideIcon,
  path: string,
): DashboardModule {
  return { key, label, description, icon, path, status: "available" };
}

function planned(key: string, label: string, description: string, icon: LucideIcon): DashboardModule {
  return { key, label, description, icon, status: "planned" };
}
