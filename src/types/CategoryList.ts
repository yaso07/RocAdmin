 
 interface User {
   _id: string;
   userName: string;
   email: string;
 }

 export interface CategoryList {
   _id?: string;
   iconName?: string;
   creatorId?: User;
   categoryList?: SingleCategory[]; // Assuming this can be an array of any type
 }
 

export interface SingleCategory {
  _id: string;
  icon: string;
  name: string;
  rating: number;
  photoUrl: string;
  opening_hours?: {
    open_now: boolean
  };
 
}