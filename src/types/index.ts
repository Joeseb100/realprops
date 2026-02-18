export type PropertyType = "HOUSE" | "PLOT";
export type PropertyStatus = "AVAILABLE" | "SOLD";

export interface PropertyImage {
    id: number;
    propertyId: number;
    imageUrl: string;
}

export interface Property {
    id: number;
    title: string;
    price: number;
    location: string;
    type: PropertyType;
    areaSqft: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    phoneNumber: string;
    status: PropertyStatus;
    createdAt: Date;
    images: PropertyImage[];
}
