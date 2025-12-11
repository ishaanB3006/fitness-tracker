// =============================================================================
// Brand Campaign Store (Admin/B2B)
// =============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BrandCampaign,
  SponsoredChallenge,
  ProductPlacement,
  Coupon,
} from "@/cms/types";
import {
  brandCampaigns as defaultCampaigns,
  sponsoredChallenges as defaultChallenges,
  productPlacements as defaultPlacements,
  coupons as defaultCoupons,
} from "@/cms/data";

interface BrandState {
  campaigns: BrandCampaign[];
  challenges: SponsoredChallenge[];
  placements: ProductPlacement[];
  coupons: Coupon[];
  
  // Campaign actions
  addCampaign: (campaign: BrandCampaign) => void;
  updateCampaign: (id: string, updates: Partial<BrandCampaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Challenge actions
  addChallenge: (challenge: SponsoredChallenge) => void;
  updateChallenge: (id: string, updates: Partial<SponsoredChallenge>) => void;
  deleteChallenge: (id: string) => void;
  
  // Placement actions
  addPlacement: (placement: ProductPlacement) => void;
  updatePlacement: (id: string, updates: Partial<ProductPlacement>) => void;
  deletePlacement: (id: string) => void;
  togglePlacementActive: (id: string) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  
  // Analytics
  incrementImpressions: (placementId: string) => void;
  incrementClicks: (placementId: string) => void;
  incrementConversions: (campaignId: string) => void;
  
  // Reset
  resetToDefaults: () => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      campaigns: defaultCampaigns,
      challenges: defaultChallenges,
      placements: defaultPlacements,
      coupons: defaultCoupons,

      // Campaign actions
      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),

      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),

      // Challenge actions
      addChallenge: (challenge) =>
        set((state) => ({
          challenges: [...state.challenges, challenge],
        })),

      updateChallenge: (id, updates) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.filter((c) => c.id !== id),
        })),

      // Placement actions
      addPlacement: (placement) =>
        set((state) => ({
          placements: [...state.placements, placement],
        })),

      updatePlacement: (id, updates) =>
        set((state) => ({
          placements: state.placements.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePlacement: (id) =>
        set((state) => ({
          placements: state.placements.filter((p) => p.id !== id),
        })),

      togglePlacementActive: (id) =>
        set((state) => ({
          placements: state.placements.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          ),
        })),

      // Coupon actions
      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons, coupon],
        })),

      updateCoupon: (id, updates) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        })),

      toggleCouponActive: (id) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      // Analytics
      incrementImpressions: (placementId) =>
        set((state) => ({
          placements: state.placements.map((p) =>
            p.id === placementId ? { ...p, impressions: p.impressions + 1 } : p
          ),
        })),

      incrementClicks: (placementId) =>
        set((state) => ({
          placements: state.placements.map((p) =>
            p.id === placementId ? { ...p, clicks: p.clicks + 1 } : p
          ),
        })),

      incrementConversions: (campaignId) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId
              ? { ...c, conversions: c.conversions + 1, updatedAt: new Date().toISOString() }
              : c
          ),
        })),

      // Reset
      resetToDefaults: () =>
        set({
          campaigns: defaultCampaigns,
          challenges: defaultChallenges,
          placements: defaultPlacements,
          coupons: defaultCoupons,
        }),
    }),
    {
      name: "fitness-brand-storage",
    }
  )
);

