// =============================================================================
// Contentstack Personalize Edge SDK Integration
// =============================================================================

import Personalize from "@contentstack/personalize-edge-sdk";

// TypeScript declarations
declare global {
  interface Window {
    personalizeSDK?: typeof Personalize;
  }
}

// Store the initialized SDK instance
let personalizeInstance: Awaited<ReturnType<typeof Personalize.init>> | null =
  null;
let isInitializing = false;

// Project UID for Contentstack Personalize
const PROJECT_UID = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID || "";

// Initialize Personalize SDK
export const initPersonalize = async (
  userId?: string
): Promise<typeof personalizeInstance> => {
  if (typeof window === "undefined") return null;

  // Return existing instance if already initialized
  if (personalizeInstance) {
    return personalizeInstance;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    // Wait for initialization to complete
    return new Promise((resolve) => {
      const checkInit = setInterval(() => {
        if (personalizeInstance) {
          clearInterval(checkInit);
          resolve(personalizeInstance);
        }
      }, 100);
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInit);
        resolve(null);
      }, 10000);
    });
  }

  if (!PROJECT_UID) {
    console.warn(
      "[Personalize] Project UID not configured. Set NEXT_PUBLIC_PERSONALIZE_PROJECT_UID environment variable."
    );
    return null;
  }

  isInitializing = true;

  try {
    personalizeInstance = await Personalize.init(PROJECT_UID, {
      userId: userId,
    });

    // Store reference on window for debugging
    window.personalizeSDK = Personalize;

    console.log("[Personalize] SDK initialized successfully");
    return personalizeInstance;
  } catch (error) {
    console.error("[Personalize] Failed to initialize SDK:", error);
    return null;
  } finally {
    isInitializing = false;
  }
};

// Get the initialized SDK instance
export const getPersonalizeInstance = () => personalizeInstance;

// Set user attributes
export const setUserAttributes = async (
  attributes: Record<string, unknown>
) => {
  if (!personalizeInstance) {
    console.warn(
      "[Personalize] SDK not initialized. Call initPersonalize first."
    );
    return;
  }

  try {
    await personalizeInstance.set(attributes);
    console.log("[Personalize] User attributes set:", attributes);
  } catch (error) {
    console.error("[Personalize] Failed to set user attributes:", error);
  }
};

// Get active experiences
export const getExperiences = () => {
  if (!personalizeInstance) {
    console.warn(
      "[Personalize] SDK not initialized. Call initPersonalize first."
    );
    return [];
  }

  try {
    return personalizeInstance.getExperiences();
  } catch (error) {
    console.error("[Personalize] Failed to get experiences:", error);
    return [];
  }
};

// Get variant aliases for CMS Delivery API
export const getVariantAliases = () => {
  if (!personalizeInstance) {
    console.warn(
      "[Personalize] SDK not initialized. Call initPersonalize first."
    );
    return [];
  }

  try {
    const variantAlias = personalizeInstance.getVariantAliases();
    console.log("variantAlias==>", variantAlias);

    if (variantAlias) {
      localStorage.setItem("cs_variant_alias_wk", variantAlias[0]);
      localStorage.setItem("cs_variant_alias_price", variantAlias[1]);
      localStorage.setItem("cs_variant_alias_supps", variantAlias[2]);
    }
  } catch (error) {
    console.error("[Personalize] Failed to get variant aliases:", error);
    return [];
  }
};

// Trigger a personalization event
export const triggerPersonalizeEvent = async (eventKey: string) => {
  if (!personalizeInstance) {
    console.warn(
      "[Personalize] SDK not initialized. Call initPersonalize first."
    );
    return;
  }

  try {
    await personalizeInstance.triggerEvent(eventKey);
    console.log("[Personalize] Event triggered:", eventKey);
  } catch (error) {
    console.error("[Personalize] Failed to trigger event:", error);
  }
};
