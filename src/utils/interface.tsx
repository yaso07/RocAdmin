export interface Acf {
    title: string;
    short_description: string;
    long_description: string;
    type: any;
    location: { label: any; value: any }[];
    key_facilities: { label: any; value: any }[];
    sub_type: any;
    price_from: string;
    price_to: string;
    url: any;
    map_location: any;
    booking_information: { label: any; value: any }[];
    display_name: string;
    email_address: string;
    telephone_number: {
      area_code: string;
      prefix: string;
      number: string;
    };
    website: string;
    address: {
      place_name: string;
      address_line_1: string;
      address_line_2?: string;
      postcode: string;
    };
    parish: any;
    seasonality: { label: any; value: any }[];
    bus_routes: { label: any; value: any }[];
    opening_hours: any;
    social_media: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
    accessibility: { label: any; value: any }[];
    accessibility_additional_info: string;
    accessibility_url: string;
    customDates?: any; // Optional property
    event_dates_start?: string;
    event_dates_end?: string;
    startTime?: string;
    endTime?: string;
    eventType?: string;
  }
  
  export interface FinalObject {
    acf: Acf;
    data_type: string;
    type: string;
    manual: boolean;
  }
  
  export interface Props {
    isOpen?: any;
    setIsDrawerOpen?: any;
    setDrawerType?: any;
    drawerType?: string;
  }
  
  
  
  
  
  export interface TimeState {
    [key: string]: {
      opens?: string;
      closes?: string;
      is_open?: number;
    };
  }
  
  export interface SelectedItems {
    Type: { label: string; value: string }[];
    subTypeOutdoor: { label: string; value: string }[];
    subTypeIutdoor: { label: string; value: string }[];
    Location: { label: string; value: string }[];
    KeyFacilities: { label: string; value: string }[];
    Booking: { label: string; value: string }[];
    WeekDays: { label: string; value: string }[];
    MonthDays: { label: string; value: string }[];
    Seasonality: { label: string; value: string }[];
    BusRoutes: { label: string; value: string }[];
    Accessibility: { label: string; value: string }[];
  }

  
  
  export type Category =
    | "Type"
    | "subTypeOutdoor"
    | "subTypeIutdoor"
    | "Location"
    | "KeyFacilities"
    | "Booking"
    | "WeekDays"
    | "MonthDays"
    | "Seasonality"
    | "BusRoutes"
    | "Accessibility";