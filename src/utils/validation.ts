
import * as Yup from "yup";


export const eventSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    email_address: Yup.string().trim()
        .matches(/^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([a-zA-Z-0-9]+(\.[a-zA-Z]{2,})+))$/, "Invalid email address")
        .email('Please enter valid email').required('Please enter email'),
    short_description: Yup.string(),
    website: Yup.string().matches(
        /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
        "Please enter valid URL").required('Please Fill website URL'),
    place_name: Yup.string().required('Please enter place name'),
    address_line_1: Yup.string(),
    address_line_2: Yup.string(),
    postcode: Yup.string(),
    price_to: Yup.string()
    .test(
      'is-positive',
      'The price must be greater than or equal to 0!',
      (value: any) => {
        // Convert the string to a number for validation
        const number = parseFloat(value);
        return !isNaN(number) && number >= 0;
      }
    ),
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
});