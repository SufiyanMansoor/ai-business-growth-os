import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEMO_MEMBERSHIPS, DEMO_TENANTS, type TenantMembership, type TenantSummary } from '@/lib/demoTenantSeed';

const ACTIVE_TENANT_STORAGE_KEY = 'activeTenantId';

interface TenantState {
  activeTenantId: string | null;
  tenants: TenantSummary[];
  memberships: TenantMembership[];
}

const initialState: TenantState = {
  activeTenantId: localStorage.getItem(ACTIVE_TENANT_STORAGE_KEY) || DEMO_TENANTS[0]?.id ?? null,
  tenants: DEMO_TENANTS,
  memberships: DEMO_MEMBERSHIPS,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenantContext: (
      state,
      action: PayloadAction<{ activeTenantId: string; tenants: TenantSummary[]; memberships: TenantMembership[] }>
    ) => {
      state.activeTenantId = action.payload.activeTenantId;
      state.tenants = action.payload.tenants;
      state.memberships = action.payload.memberships;
      localStorage.setItem(ACTIVE_TENANT_STORAGE_KEY, action.payload.activeTenantId);
    },
    setActiveTenant: (state, action: PayloadAction<string>) => {
      const exists = state.tenants.some((tenant) => tenant.id === action.payload);
      if (exists) {
        state.activeTenantId = action.payload;
        localStorage.setItem(ACTIVE_TENANT_STORAGE_KEY, action.payload);
      }
    },
    resetTenantContext: (state) => {
      state.activeTenantId = DEMO_TENANTS[0]?.id ?? null;
      state.tenants = DEMO_TENANTS;
      state.memberships = DEMO_MEMBERSHIPS;
      if (state.activeTenantId) localStorage.setItem(ACTIVE_TENANT_STORAGE_KEY, state.activeTenantId);
      else localStorage.removeItem(ACTIVE_TENANT_STORAGE_KEY);
    },
  },
});

export const { setTenantContext, setActiveTenant, resetTenantContext } = tenantSlice.actions;
export default tenantSlice.reducer;
