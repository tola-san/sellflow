import api from "../lib/Axios";

export interface ModifierOption {
  id?: number;
  name: string;
  price_adjustment: string | number;
  is_active: boolean;
  sort_order?: number;
}

export interface ModifierGroup {
  id: number;
  name: string;
  selection_type: "single" | "multiple";
  is_required: boolean;
  min_select: number;
  max_select: number | null;
  is_active: boolean;
  product_ids: number[];
  options: ModifierOption[];
}

export type ModifierGroupPayload = Omit<ModifierGroup, "id" | "options"> & {
  options: Omit<ModifierOption, "id" | "sort_order">[];
};

type Response<T> = { success: boolean; data: T };

export const modifierGroupService = {
  async all(): Promise<ModifierGroup[]> {
    return (await api.get<Response<ModifierGroup[]>>("/modifier-groups")).data.data;
  },
  async create(payload: ModifierGroupPayload): Promise<ModifierGroup> {
    return (await api.post<Response<ModifierGroup>>("/modifier-groups", payload)).data.data;
  },
  async update(id: number, payload: ModifierGroupPayload): Promise<ModifierGroup> {
    return (await api.put<Response<ModifierGroup>>(`/modifier-groups/${id}`, payload)).data.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/modifier-groups/${id}`);
  },
};
