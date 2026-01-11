import contentstack from "@contentstack/delivery-sdk";
import { Workout, Exercise, MealPlan, Meal, Macros } from "@/cms/types";

let stack: ReturnType<typeof contentstack.stack> | null = null;

function getConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_STACK_API_KEY,
    deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  };
}

// Get variant alias from localStorage
function getVariantAlias(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cs_variant_alias");
}

// Get supplements variant alias from localStorage
function getSupplementsVariantAlias(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cs_variant_alias_supps");
}

// Get price variant alias from localStorage (for recovery prices)
function getPriceVariantAlias(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cs_variant_alias_price");
}

// Get workout variant alias from localStorage
function getWorkoutVariantAlias(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cs_variant_alias_wk");
}

export function initContentstack() {
  const { apiKey, deliveryToken, environment } = getConfig();
  // Debug: This log is to check if initContentstack() is called.
  console.debug("[contentstack] initContentstack() called", {
    apiKey,
    deliveryToken,
    environment,
  });

  if (!apiKey || !deliveryToken || !environment) {
    console.error(
      "Contentstack configuration missing. Check environment variables."
    );
    stack = null;
    return null;
  }

  try {
    stack = contentstack.stack({
      apiKey,
      deliveryToken,
      environment,
    });
    console.info("Contentstack stack initialized successfully.");
    return stack;
  } catch (err) {
    console.error("Failed to initialize Contentstack stack:", err);
    stack = null;
    return null;
  }
}

// Initialize and export the stack at module load time
// This executes when the module is first imported

export const getEntry = async (entryId: string) => {
  if (!contentstackStack) {
    throw new Error("Contentstack stack not initialized");
  }

  const result = await contentstackStack
    .contentType("workout")
    .entry(entryId)
    .includeReference(["exercises.exercise"])
    .fetch<any>();

  console.log(result);
  return result;
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      throw new Error(
        "Contentstack configuration is missing. Please check your environment variables."
      );
    }

    const baseUrl = `https://cdn.contentstack.io/v3/content_types/workout/entries`;
    const url = `${baseUrl}?environment=${config.environment}&include[]=exercises.exercise`;

    // Build headers with workout variant alias if available
    const headers: Record<string, string> = {
      api_key: config.apiKey,
      access_token: config.deliveryToken,
    };
    const variantAlias = getWorkoutVariantAlias();
    if (variantAlias) {
      headers["x-cs-variant-uid"] = variantAlias;
    }

    // Use REST API directly for fetching all entries
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Contentstack API error (${response.status}):`, errorText);
      if (response.status === 404) {
        throw new Error(
          `Workouts not found. Check if entries are published in the '${config.environment}' environment.`
        );
      }
      throw new Error(
        `Failed to fetch workouts: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    // Contentstack returns entries in result.entries array
    const entries = result?.entries || [];

    if (entries.length === 0) {
      console.warn("No workouts found in Contentstack");
      return [];
    }

    // Transform Contentstack entries to Workout format
    return entries.map((entry: any) => transformWorkoutEntry(entry));
  } catch (error) {
    console.error("Error fetching workouts from Contentstack:", error);
    throw error;
  }
};

export const getWorkoutById = async (id: string): Promise<Workout | null> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      throw new Error(
        "Contentstack configuration is missing. Please check your environment variables."
      );
    }
    const baseUrl = `https://cdn.contentstack.io/v3/content_types/workout/entries/${id}`;

    // Build headers with workout variant alias if available
    const headers: Record<string, string> = {
      api_key: config.apiKey,
      access_token: config.deliveryToken,
    };
    const variantAlias = getWorkoutVariantAlias();
    if (variantAlias) {
      headers["x-cs-variant-uid"] = variantAlias;
    }

    // Use REST API directly for fetching a single entry
    const response = await fetch(
      `${baseUrl}?environment=${config.environment}&include[]=exercises.exercise`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Workout ${id} not found in Contentstack`);
        return null;
      }
      const errorText = await response.text();
      console.error(
        `Contentstack API error (${response.status}) for workout ${id}:`,
        errorText
      );
      throw new Error(
        `Failed to fetch workout: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    // Contentstack returns entry in result.entry
    const entry = result?.entry;

    if (!entry) {
      return null;
    }

    // Transform Contentstack entry to Workout format
    return transformWorkoutEntry(entry);
  } catch (error) {
    console.error("Error fetching workout from Contentstack:", error);
    throw error;
  }
};

// Transform Contentstack entry to Workout type
function transformWorkoutEntry(entry: any): Workout {
  // Transform exercises from Contentstack format
  const exercises: Exercise[] = [];
  if (entry.exercises && Array.isArray(entry.exercises)) {
    entry.exercises.forEach((exerciseGroup: any) => {
      if (exerciseGroup.exercise && Array.isArray(exerciseGroup.exercise)) {
        exerciseGroup.exercise.forEach((ex: any) => {
          // If exercise is expanded (includes full data), use it
          if (ex.title) {
            exercises.push({
              id: ex.uid || ex._id || "",
              name: ex.title || "",
              sets: ex.sets || 0,
              reps: ex.reps?.toString() || "0",
              restSeconds: ex.rest_duration ? ex.rest_duration * 60 : 30, // Convert minutes to seconds if needed
              notes: ex.notes || undefined,
              videoUrl: ex.tutorial?.url || undefined,
            });
          }
        });
      }
    });
  }

  // Get image URL with fallback
  const thumbnailUrl =
    entry.image?.url ||
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop";

  return {
    id: entry.uid || entry._id || "",
    title: entry.title || "",
    description: entry.description || "",
    muscleGroups: entry.muscle_groups || [], // Assuming this field exists in Contentstack
    difficulty: entry.difficulty || "beginner",
    duration: entry.duration || 0,
    equipment: entry.equipment || [], // Assuming this field exists in Contentstack
    calories: entry.calories || 0,
    videoUrl: entry.video_url || undefined,
    thumbnailUrl,
    exercises,
    tags: entry.tags || [],
    createdAt: entry.created_at || new Date().toISOString(),
    updatedAt: entry.updated_at || new Date().toISOString(),
  };
}

// =============================================================================
// Meal Plan Functions
// =============================================================================

export const getAllMealPlans = async (): Promise<MealPlan[]> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      throw new Error(
        "Contentstack configuration is missing. Please check your environment variables."
      );
    }

    // Destructure to ensure TypeScript knows these are strings
    const apiKey = config.apiKey;
    const deliveryToken = config.deliveryToken;
    const environment = config.environment;

    const baseUrl = `https://cdn.contentstack.io/v3/content_types/meal_plan/entries`;

    const response = await fetch(
      `${baseUrl}?environment=${environment}&include[]=daily_macros.reference&include[]=meals.breakfast.reference&include[]=meals.lunch.reference&include[]=meals.dinner.reference`,
      {
        headers: {
          api_key: apiKey,
          access_token: deliveryToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch meal plans: ${response.statusText}`);
    }

    const result = await response.json();
    const entries = result?.entries || [];

    // Fetch macro details for each entry
    const mealPlansWithMacros = await Promise.all(
      entries.map(async (entry: any) => {
        // Fetch macro details if they're references
        if (entry.daily_macros && Array.isArray(entry.daily_macros)) {
          const macroPromises = entry.daily_macros.map(
            async (macroGroup: any) => {
              if (macroGroup.reference && Array.isArray(macroGroup.reference)) {
                return Promise.all(
                  macroGroup.reference.map(async (ref: any) => {
                    if (ref.uid && !ref.title) {
                      // Fetch the macro entry if not expanded
                      try {
                        const macroResponse = await fetch(
                          `https://cdn.contentstack.io/v3/content_types/macros/entries/${ref.uid}?environment=${environment}`,
                          {
                            headers: {
                              api_key: apiKey,
                              access_token: deliveryToken,
                            },
                          }
                        );
                        if (macroResponse.ok) {
                          const macroData = await macroResponse.json();
                          return macroData?.entry || ref;
                        }
                      } catch (err) {
                        console.error("Error fetching macro:", err);
                      }
                    }
                    return ref;
                  })
                );
              }
              return [];
            }
          );

          const resolvedMacros = await Promise.all(macroPromises);
          entry.daily_macros = entry.daily_macros.map(
            (group: any, index: number) => ({
              ...group,
              reference: resolvedMacros[index] || group.reference,
            })
          );
        }

        // Fetch meal details if they're references
        if (entry.meals) {
          const mealTypes = ["breakfast", "lunch", "dinner"];
          for (const mealType of mealTypes) {
            if (
              entry.meals[mealType]?.reference &&
              Array.isArray(entry.meals[mealType].reference)
            ) {
              const mealPromises = entry.meals[mealType].reference.map(
                async (ref: any) => {
                  // Always fetch the full meal entry to ensure we get the image field
                  if (ref.uid) {
                    try {
                      const mealResponse = await fetch(
                        `https://cdn.contentstack.io/v3/content_types/meal/entries/${ref.uid}?environment=${environment}`,
                        {
                          headers: {
                            api_key: apiKey,
                            access_token: deliveryToken,
                          },
                        }
                      );
                      if (mealResponse.ok) {
                        const mealData = await mealResponse.json();
                        return mealData?.entry || ref;
                      }
                    } catch (err) {
                      console.error("Error fetching meal:", err);
                    }
                  }
                  return ref;
                }
              );

              const resolvedMeals = await Promise.all(mealPromises);
              entry.meals[mealType].reference = resolvedMeals;
            }
          }
        }

        return entry;
      })
    );

    return mealPlansWithMacros.map((entry: any) =>
      transformMealPlanEntry(entry)
    );
  } catch (error) {
    console.error("Error fetching meal plans from Contentstack:", error);
    throw error;
  }
};

export const getMealPlanById = async (id: string): Promise<MealPlan | null> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      throw new Error(
        "Contentstack configuration is missing. Please check your environment variables."
      );
    }

    // Destructure to ensure TypeScript knows these are strings
    const apiKey = config.apiKey;
    const deliveryToken = config.deliveryToken;
    const environment = config.environment;

    const baseUrl = `https://cdn.contentstack.io/v3/content_types/meal_plan/entries/${id}`;

    const response = await fetch(
      `${baseUrl}?environment=${environment}&include[]=daily_macros.reference&include[]=meals.breakfast.reference&include[]=meals.lunch.reference&include[]=meals.dinner.reference`,
      {
        headers: {
          api_key: apiKey,
          access_token: deliveryToken,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch meal plan: ${response.statusText}`);
    }

    const result = await response.json();
    let entry = result?.entry;

    if (!entry) {
      return null;
    }

    // Fetch macro details if they're references
    if (entry.daily_macros && Array.isArray(entry.daily_macros)) {
      const macroPromises = entry.daily_macros.map(async (macroGroup: any) => {
        if (macroGroup.reference && Array.isArray(macroGroup.reference)) {
          return Promise.all(
            macroGroup.reference.map(async (ref: any) => {
              if (ref.uid && !ref.title) {
                // Fetch the macro entry if not expanded
                try {
                  const macroResponse = await fetch(
                    `https://cdn.contentstack.io/v3/content_types/macros/entries/${ref.uid}?environment=${environment}`,
                    {
                      headers: {
                        api_key: apiKey,
                        access_token: deliveryToken,
                      },
                    }
                  );
                  if (macroResponse.ok) {
                    const macroData = await macroResponse.json();
                    return macroData?.entry || ref;
                  }
                } catch (err) {
                  console.error("Error fetching macro:", err);
                }
              }
              return ref;
            })
          );
        }
        return [];
      });

      const resolvedMacros = await Promise.all(macroPromises);
      entry.daily_macros = entry.daily_macros.map(
        (group: any, index: number) => ({
          ...group,
          reference: resolvedMacros[index] || group.reference,
        })
      );
    }

    // Fetch meal details if they're references
    if (entry.meals) {
      const mealTypes = ["breakfast", "lunch", "dinner"];
      for (const mealType of mealTypes) {
        if (
          entry.meals[mealType]?.reference &&
          Array.isArray(entry.meals[mealType].reference)
        ) {
          const mealPromises = entry.meals[mealType].reference.map(
            async (ref: any) => {
              // Always fetch the full meal entry to ensure we get the image field
              if (ref.uid) {
                try {
                  const mealResponse = await fetch(
                    `https://cdn.contentstack.io/v3/content_types/meal/entries/${ref.uid}?environment=${environment}`,
                    {
                      headers: {
                        api_key: apiKey,
                        access_token: deliveryToken,
                      },
                    }
                  );
                  if (mealResponse.ok) {
                    const mealData = await mealResponse.json();
                    return mealData?.entry || ref;
                  }
                } catch (err) {
                  console.error("Error fetching meal:", err);
                }
              }
              return ref;
            }
          );

          const resolvedMeals = await Promise.all(mealPromises);
          entry.meals[mealType].reference = resolvedMeals;
        }
      }
    }

    return transformMealPlanEntry(entry);
  } catch (error) {
    console.error("Error fetching meal plan from Contentstack:", error);
    throw error;
  }
};

// Transform Contentstack meal plan entry to MealPlan type
function transformMealPlanEntry(entry: any): MealPlan {
  // Transform macros from references
  const macros: Macros = {
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  if (entry.daily_macros && Array.isArray(entry.daily_macros)) {
    entry.daily_macros.forEach((macroGroup: any) => {
      if (macroGroup.reference && Array.isArray(macroGroup.reference)) {
        macroGroup.reference.forEach((macro: any) => {
          if (macro.title && macro.value !== undefined) {
            const macroName = macro.title.toLowerCase();
            if (macroName === "protein") macros.protein = macro.value;
            else if (macroName === "carbs" || macroName === "carbohydrates")
              macros.carbs = macro.value;
            else if (macroName === "fat") macros.fat = macro.value;
            else if (macroName === "fiber") macros.fiber = macro.value;
          }
        });
      }
    });
  }

  // Get thumbnail URL with fallback
  const thumbnailUrl =
    entry.thumbnail?.url ||
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop";

  // Transform meals from references
  const meals: Meal[] = [];

  // Handle breakfast
  if (
    entry.meals?.breakfast?.reference &&
    Array.isArray(entry.meals.breakfast.reference)
  ) {
    entry.meals.breakfast.reference.forEach((mealRef: any) => {
      if (mealRef.title || mealRef.uid) {
        meals.push({
          id: mealRef.uid || "",
          name: mealRef.title || "",
          type: "breakfast",
          calories: mealRef.calories || 0,
          macros: {
            protein: mealRef.macros?.protein || 0,
            carbs: mealRef.macros?.carbs || 0,
            fat: mealRef.macros?.fat || 0,
          },
          ingredients: mealRef.ingredients || [],
          prepTime: mealRef.prep_time || 0,
          cookTime: mealRef.cook_time || 0,
          imageUrl:
            mealRef.image?.url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        });
      }
    });
  }

  // Handle lunch
  if (
    entry.meals?.lunch?.reference &&
    Array.isArray(entry.meals.lunch.reference)
  ) {
    entry.meals.lunch.reference.forEach((mealRef: any) => {
      if (mealRef.title || mealRef.uid) {
        meals.push({
          id: mealRef.uid || "",
          name: mealRef.title || "",
          type: "lunch",
          calories: mealRef.calories || 0,
          macros: {
            protein: mealRef.macros?.protein || 0,
            carbs: mealRef.macros?.carbs || 0,
            fat: mealRef.macros?.fat || 0,
          },
          ingredients: mealRef.ingredients || [],
          prepTime: mealRef.prep_time || 0,
          cookTime: mealRef.cook_time || 0,
          imageUrl:
            mealRef.image?.url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        });
      }
    });
  }

  // Handle dinner
  if (
    entry.meals?.dinner?.reference &&
    Array.isArray(entry.meals.dinner.reference)
  ) {
    entry.meals.dinner.reference.forEach((mealRef: any) => {
      if (mealRef.title || mealRef.uid) {
        meals.push({
          id: mealRef.uid || "",
          name: mealRef.title || "",
          type: "dinner",
          calories: mealRef.calories || 0,
          macros: {
            protein: mealRef.macros?.protein || 0,
            carbs: mealRef.macros?.carbs || 0,
            fat: mealRef.macros?.fat || 0,
          },
          ingredients: mealRef.ingredients || [],
          prepTime: mealRef.prep_time || 0,
          cookTime: mealRef.cook_time || 0,
          imageUrl:
            mealRef.image?.url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        });
      }
    });
  }

  return {
    id: entry.uid || entry._id || "",
    title: entry.title || "",
    description: entry.description || "",
    dietType: entry.diet_type || "balanced",
    macros,
    allergyTags: entry.allergy_tags || [],
    meals,
    totalCalories: entry.total_calories || 0,
    thumbnailUrl,
    createdAt: entry.created_at || new Date().toISOString(),
    updatedAt: entry.updated_at || new Date().toISOString(),
  };
}

// =============================================================================
// Recovery Functions
// =============================================================================

export const getRecoveryPrice = async (): Promise<number | null> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      return null;
    }

    // Recovery is a singleton content type, so we fetch it directly
    const baseUrl = `https://cdn.contentstack.io/v3/content_types/recovery/entries`;
    const url = `${baseUrl}?environment=${config.environment}`;

    // Build headers with price variant alias if available
    const headers: Record<string, string> = {
      api_key: config.apiKey,
      access_token: config.deliveryToken,
    };
    const variantAlias = getPriceVariantAlias();
    if (variantAlias) {
      headers["x-cs-variant-uid"] = variantAlias;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(
        `Contentstack API error (${response.status}) for recovery:`,
        await response.text()
      );
      return null;
    }

    const result = await response.json();
    const entries = result?.entries || [];

    if (entries.length === 0) {
      console.warn("No recovery entry found in Contentstack");
      return null;
    }

    // Get the first entry (singleton should only have one)
    const entry = entries[0];
    return entry.session_price || null;
  } catch (error) {
    console.error("Error fetching recovery price from Contentstack:", error);
    return null;
  }
};

// =============================================================================
// Supplements Functions
// =============================================================================

export interface Supplement {
  id: string;
  title: string;
  description?: string;
  productName: string;
  productType: string;
  imageUrl: string;
  linkUrl?: string;
  price?: number;
  brandName?: string;
  isActive?: boolean;
}

export const getAllSupplements = async (): Promise<Supplement[]> => {
  try {
    const config = getConfig();

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      console.error("Contentstack configuration missing:", config);
      return [];
    }

    // Try both singular and plural content type names
    const contentTypes = ["supplement", "supplements"];
    let entries: any[] = [];

    for (const contentType of contentTypes) {
      const baseUrl = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries`;
      const url = `${baseUrl}?environment=${config.environment}`;

      // Build headers with supplements variant alias if available
      const headers: Record<string, string> = {
        api_key: config.apiKey,
        access_token: config.deliveryToken,
      };
      const variantAlias = getSupplementsVariantAlias();
      if (variantAlias) {
        headers["x-cs-variant-uid"] = variantAlias;
      }

      try {
        const response = await fetch(url, { headers });

        if (response.ok) {
          const result = await response.json();
          entries = result?.entries || [];
          if (entries.length > 0) {
            console.log(
              `[Contentstack] Found supplements in content type: ${contentType}`
            );
            break; // Found entries, stop trying other content types
          }
        } else if (response.status === 404) {
          // Content type doesn't exist, try next one
          continue;
        } else {
          console.error(
            `Contentstack API error (${response.status}) for ${contentType}:`,
            await response.text()
          );
        }
      } catch (fetchError) {
        console.error(`Error fetching ${contentType}:`, fetchError);
        continue;
      }
    }

    if (entries.length === 0) {
      console.warn("No supplements found in Contentstack");
      return [];
    }

    // Log first entry structure for debugging
    if (entries.length > 0) {
      console.log(
        "[Contentstack] First supplement entry structure:",
        JSON.stringify(entries[0], null, 2)
      );
    }

    // Transform Contentstack entries to Supplement format
    // Only using 'name' and 'image' fields as per user's content structure
    return entries.map((entry: any) => {
      // Extract image URL from image field
      const imageField = entry.image || {};
      const imageUrl =
        imageField.url ||
        (typeof imageField === "string" ? imageField : null) ||
        "/images/products/product-1593095948071.jpg";

      return {
        id: entry.uid || entry._id || "",
        title: entry.name || entry.title || "",
        description: "", // Not available in CMS
        productName: entry.name || entry.title || "",
        productType: "supplement",
        imageUrl,
        linkUrl: "", // Not available in CMS
        price: undefined, // Not available in CMS
        brandName: "", // Not available in CMS
        isActive: true, // Default to active
      };
    });
  } catch (error) {
    console.error("Error fetching supplements from Contentstack:", error);
    return [];
  }
};

export const contentstackStack = initContentstack();

// Log to confirm module execution
console.debug(
  "[contentstack] Module loaded, stack initialized:",
  contentstackStack !== null
);
