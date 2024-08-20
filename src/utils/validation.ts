
import * as Yup from "yup";


export const eventSchema = Yup.object().shape({
  title: Yup.string().required('Please enter title'),
  email_address: Yup.string().trim()
    .matches(/^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([a-zA-Z-0-9]+(\.[a-zA-Z]{2,})+))$/, "Invalid email address")
    .email('Please enter valid email').required('Please enter email'),
  short_description: Yup.string(),
  website: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL").required('Please fill website URL'),
  place_name: Yup.string().required('Please enter place name'),
  address_line_1: Yup.string(),
  address_line_2: Yup.string(),
  postcode: Yup.string(),
  phoneNumber: Yup.string().nullable().matches(/^\d*$/, 'Phone number must be a valid integer'),
  from_price: Yup.string()
    .test(
      'is-positive',
      'The price must be greater than or equal to 0!',
      (value: any) => {
        // Convert the string to a number for validation
        const number = parseFloat(value);
        return !isNaN(number) && number >= 0;
      }
    ),
  price_to: Yup.string()
    .test(
      'is-positive',
      'The price must be greater than or equal to min price!',
      (value: any, context: Yup.TestContext) => {
        const { from_price } = context.parent as { from_price: string };
        const number = parseFloat(value);
        const fromPriceNumber = parseFloat(from_price);
        return !isNaN(number) && number >= 0 && number >= fromPriceNumber;
      }
    )
    .when(['from_price'], (from_price: string | any, schema: Yup.StringSchema) =>
      from_price
        ? schema.required('Price to is required when Price from is provided')
        : schema
    ),
  // price_to: Yup.string()
  // .test(
  //   'is-positive',
  //   'The price must be greater than or equal to 0!',
  //   (value: any) => {
  //     // Convert the string to a number for validation
  //     const number = parseFloat(value);
  //     return !isNaN(number) && number >= 0;
  //   }
  // ),
});


export const activitySchema = Yup.object().shape({
  DescriptionTitle: Yup.string().required('Please enter title'),
  introDescription: Yup.string().required('Please enter short description'),
  moreInformation: Yup.string().required('Please enter more description'),
  activityType: Yup.string().required('Please select an activity type'),
  subTypeActivity: Yup.array()
    .min(1, 'Please select at least one sub activity type')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
    ),
  Location: Yup.array()
    .min(1, 'Please select at least one location')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  KeyFacilities: Yup.array()
    .min(1, 'Please select at least one key facilities')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Seasonality: Yup.array()
    .min(1, 'Please select at least one seasonality')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  BusRoutes: Yup.array()
    .min(1, 'Please select at least one bus routes')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Booking: Yup.array()
    .min(1, 'Please select at least one booking')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  WeekDays: Yup.array()
    .min(1, 'Please select at least one opening hours')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
      })
        .required(),
    ),
  priceFrom: Yup.string().required("Please enter price from")
    .test(
      'is-positive',
      'The price must be greater than 0!',
      (value: any) => {
        // Convert the string to a number for validation
        const number = parseFloat(value);
        return !isNaN(number) && number > 0;
      }
    ),
  priceTo: Yup.string().required("Please enter Price to")
    .test(
      'is-positive',
      'The price must be greater than the price from!',
      (value: any, context: Yup.TestContext) => {
        const { priceFrom } = context.parent as { priceFrom: string };
        const number = parseFloat(value);
        const fromPriceNumber = parseFloat(priceFrom);
        return !isNaN(number) && number >= 1 && number > fromPriceNumber;
      }
    )
    .when(['priceFrom'], (priceFrom: string | any, schema: Yup.StringSchema) =>
      priceFrom
        ? schema.required("Please enter Price to")
        : schema
    ),
  DisplayName: Yup.string().required('Please enter name'),
  EmailAddress: Yup.string().trim()
    .matches(/^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([a-zA-Z-0-9]+(\.[a-zA-Z]{2,})+))$/, "Invalid email address")
    .email('Please enter valid email').required('Please enter email'),
  Prefix: Yup.number()
    .required('Please fill prefix')
    .positive('The number must be positive')
    .integer('The number must be an integer')
    .max(9999, 'The number can have a maximum of 4 digits'),
  Telephone: Yup.number().nullable()
  .positive('The number must be positive')
  .integer('The number must be an integer')
  // .matches(/^\d*$/, 'Phone number must be a valid integer')
  .required('Please fill telephone'),
  Website: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL").required('Please fill website URL'),
  PlaceName: Yup.string().required('Please fill place name'),
  AddressLine: Yup.string().required('Please fill address line'),
  AddressLineOptional: Yup.string(),
  Parish: Yup.string().required('Please fill parish'),
  latitude: Yup.string().required('Please fill latitude'),
  longitude: Yup.string().required('Please fill longitude'),
  Postcode: Yup.string().required('Please fill post code'),
  Accessibility: Yup.array()
    .min(1, 'Please select at least one accessibility')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Facebook: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  Instagram: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  Twitter: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  AdditionalInfo: Yup.string(),
  AccessibilityURL: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  file: Yup.string().required("Please select image"),
});


export const eventsSchema = Yup.object().shape({
  DescriptionTitle: Yup.string().required('Please enter title'),
  introDescription: Yup.string().required('Please enter short description'),
  moreInformation: Yup.string().required('Please enter more description'),
  Type: Yup.array()
    .min(1, 'Please select at least one sub activity type')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
    ),
  Location: Yup.array()
    .min(1, 'Please select at least one location')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  KeyFacilities: Yup.array()
    .min(1, 'Please select at least one key facilities')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Seasonality: Yup.array()
    .min(1, 'Please select at least one seasonality')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  BusRoutes: Yup.array()
    .min(1, 'Please select at least one bus routes')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Booking: Yup.array()
    .min(1, 'Please select at least one booking')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  priceFrom: Yup.string().required("Please enter price from")
    .test(
      'is-positive',
      'The price must be greater than 0!',
      (value: any) => {
        // Convert the string to a number for validation
        const number = parseFloat(value);
        return !isNaN(number) && number > 0;
      }
    ),
  priceTo: Yup.string().required("Please enter Price to")
    .test(
      'is-positive',
      'The price must be greater than the price from!',
      (value: any, context: Yup.TestContext) => {
        const { priceFrom } = context.parent as { priceFrom: string };
        const number = parseFloat(value);
        const fromPriceNumber = parseFloat(priceFrom);
        return !isNaN(number) && number >= 1 && number > fromPriceNumber;
      }
    )
    .when(['priceFrom'], (priceFrom: string | any, schema: Yup.StringSchema) =>
      priceFrom
        ? schema.required("Please enter Price to")
        : schema
    ),
  DisplayName: Yup.string().required('Please enter name'),
  EmailAddress: Yup.string().trim()
    .matches(/^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([a-zA-Z-0-9]+(\.[a-zA-Z]{2,})+))$/, "Invalid email address")
    .email('Please enter valid email').required('Please enter email'),
  Prefix: Yup.number()
    .required('Please fill prefix')
    .positive('The number must be positive')
    .integer('The number must be an integer')
    .max(9999, 'The number can have a maximum of 4 digits'),
  Telephone: Yup.string().nullable().matches(/^\d*$/, 'Phone number must be a valid integer').required('Please fill telephone'),
  Website: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL").required('Please fill website URL'),
  PlaceName: Yup.string().required('Please fill place name'),
  AddressLine: Yup.string().required('Please fill address line'),
  AddressLineOptional: Yup.string(),
  Parish: Yup.string().required('Please fill parish'),
  latitude: Yup.string().required('Please fill latitude'),
  longitude: Yup.string().required('Please fill longitude'),
  Postcode: Yup.string().required('Please fill post code'),
  Accessibility: Yup.array()
    .min(1, 'Please select at least one accessibility')
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        title: Yup.string().required(),
      })
        .required(),
    ),
  Facebook: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  Instagram: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  Twitter: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  AdditionalInfo: Yup.string(),
  AccessibilityURL: Yup.string().matches(
    /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
    "Please enter valid URL"),
  file: Yup.string().required("Please select image"),
});