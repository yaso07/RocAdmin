 
 interface User {
   _id: string;
   userName: string;
   email: string;
   password: string;
   prefrence: boolean;
   createdAt: string;
   updatedAt: string;
   __v: number;
 }

 export interface CategoryList {
   _id?: string;
   listName?: string;
   categoryType?: string;
   iconName?: string;
   creatorId?: User;
   bgColor?: string;
   contributers?: []; // Assuming this can be an array of any type
   createdAt?: string;
   updatedAt?: string;
   __v?: number;
   status?: string | number;
   categoryList?: SingleCategory[]; // Assuming this can be an array of any type
 }
 

 interface Location {
   lat: number;
   lng: number;
 }

 interface Viewport {
   northeast: Location;
   southwest: Location;
 }

 interface Geometry {
   location: Location;
   viewport: Viewport;
 }

 interface Photo {
   height: number;
   html_attributions: string[];
   photo_reference: string;
   width: number;
 }

 interface PlusCode {
   compound_code: string;
   global_code: string;
 }

export interface SingleCategory{
   _id: string;
   business_status: string;
   formatted_address: string;
   geometry: Geometry;
   icon: string;
   icon_background_color: string;
   icon_mask_base_uri: string;
   name: string;
   photos: Photo[];
   place_id: string;
   plus_code: PlusCode;
   rating: number;
   reference: string;
   types: string[];
   user_ratings_total: number;
   type: string;
   createdAt: string;
   updatedAt: string;
   __v: number;
   data_type: string;
 }