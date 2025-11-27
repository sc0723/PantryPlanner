// interface ImageInfo {
//     url: string;
//     width: number;
//     height: number;
// }   

// interface NutrientInfo {
//     label: string;
//     quantity: number;
//     unit: string;
// }

// interface Image {
//     REGULAR: ImageInfo;
//     SMALL: ImageInfo;  
//     THUMBNAIL: ImageInfo;
// }

// interface TotalNutrients {
//     calories: NutrientInfo;
//     protein: NutrientInfo;
//     fat: NutrientInfo;
//     carbs: NutrientInfo;
//     sugar: NutrientInfo;
// }

export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
    readyInMinutes: number;
    healthScore: number;
    servings: number;
}

export interface ComplexSearchResponse {
    offset: number;
    number: number;
    results: Recipe[];
    totalResults: number;
}
