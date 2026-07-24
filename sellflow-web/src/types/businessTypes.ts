export const BUSINESS_TYPES = [
  {
    value: "food_beverage",
    label: "Food & beverage",
    description: "Restaurants, cafés, bakeries, and drink shops.",
  },
  {
    value: "fashion",
    label: "Fashion & clothing",
    description: "Clothing, shoes, bags, jewelry, and accessories.",
  },
  {
    value: "beauty",
    label: "Beauty & cosmetics",
    description: "Skincare, cosmetics, salons, and personal care.",
  },
  {
    value: "electronics",
    label: "Electronics",
    description: "Devices, accessories, appliances, and repair shops.",
  },
  {
    value: "grocery_retail",
    label: "Grocery & retail",
    description: "Groceries, convenience stores, and general retail.",
  },
  {
    value: "services",
    label: "Services",
    description: "Professional, home, creative, and local services.",
  },
  {
    value: "digital_products",
    label: "Digital products",
    description: "Downloads, templates, courses, and digital goods.",
  },
  {
    value: "other",
    label: "Other",
    description: "A different type of business or a mixed catalog.",
  },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"];

export function businessTypeLabel(value: BusinessType): string {
  return BUSINESS_TYPES.find((type) => type.value === value)?.label ?? "Other";
}
