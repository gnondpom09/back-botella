export interface Painting {
    id: string;
    title: string;
    path: string;
    thumb: string;
    height: number;
    width: number;
    category: string;
    technic: string;
    price?: number;
}