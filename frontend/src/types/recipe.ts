interface ImageInfo {
    url: string;
    width: number;
    height: number;
}   

interface NutrientInfo {
    label: string;
    quantity: number;
    unit: string;
}

interface Image {
    REGULAR: ImageInfo;
    SMALL: ImageInfo;  
    THUMBNAIL: ImageInfo;
}

interface TotalNutrients {
    calories: NutrientInfo;
    protein: NutrientInfo;
    fat: NutrientInfo;
    carbs: NutrientInfo;
    sugar: NutrientInfo;
}

export interface Recipe {
    label: string;
    calories: number;
    totalTime: number;
    yield: number;
    ingredientLines: string[];
    dietLabels: string[];
    healthLabels: string[];
    cusineType: string[];
    images: Image;
    totalNutrients: TotalNutrients;
}
