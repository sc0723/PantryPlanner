export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
    readyInMinutes: number;
    healthScore: number;
    servings: number;
}

export interface Ingredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
}

export interface InstructionStep {
    number: number;
    step: string;
}

export interface AnalyzedInstruction {
    name: string;
    steps: InstructionStep[];
}

export interface Nutrient {
    name: string;
    amount: number;
    unit: string;
}

export interface NutrientWrapper {
    nutrients: Nutrient[];
}

export interface RecipeDetail {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    preparationMinutes: number;
    cookingMinutes: number;
    summary: string;
    sourceUrl: string;
    extendedIngredients: Ingredient[];
    analyzedInstructions: AnalyzedInstruction[];
    nutrition: NutrientWrapper;
    nutrients: Nutrient[];
    healthScore: number;
}

export interface ComplexSearchResponse {
    offset: number;
    number: number;
    results: Recipe[];
    totalResults: number;
}
