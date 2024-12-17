const data = [
    {

        "title": "",
        "short_description": "data kldsfj fsdlkjkfds kjflks fdskjl fds;k; fdsljoifd fdskjlflds kfdsljk lfdsj fdjlfdslk lflkdsj lfkdslk ",
        "types": [
            "Data Entry",
            "Algorithmic"
        ],
        "header_image_data": "[{\"url\":\"https://storage.googleapis.com/roc-app-425011.appspot.com//Events/photo/festive activitiesz.jpeg\"}]",
        "website": "",
        "telephone_number": {
            "area_code": "",
            "prefix": "",
            "number": "",
            "formatted": " () "
        },
        "email_address": "laluprasath23@gmail.com",
        "address": {
            "place_name": "",
            "address_line_1": "",
            "address_line_2": "",
            "postcode": ""
        },
        "parish": {
            "label": "",
            "value": ""
        },
        "opening_hours": {
            "Monday": {
                "closes": "17:50",
                "opens": "15:50",
                "is_open": "1"
            },
            "Tuesday": {
                "closes": "17:50",
                "opens": "15:50",
                "is_open": "1"
            },
            "Wednesday": {
                "closes": "17:50",
                "opens": "15:50",
                "is_open": "1"
            },
            "Thursday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            },
            "Friday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            },
            "Saturday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            },
            "Sunday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            }
        },
        "map_location": {
            "lat": 0,
            "lng": 0
        }

    },
    {

        "title": "Shankar Bhole",
        "short_description": "This will be used for the What’s On printed guide. It will also be used on the website where a short, preview piece of copy may be required to introduce your listing.",
        "types": [
            "Data Entry"
        ],
        "header_image_data": "[{\"url\":\"https://cdn.magicdecor.in/com/2023/09/19171540/Gautam-Buddha-Stone-Textured-Wallpaper.jpg\"}]",
        "website": "https://www.google.com/",
        "telephone_number": {
            "area_code": "",
            "prefix": 8957,
            "number": 9025198004,
            "formatted": " (8957) 9025198004"
        },
        "email_address": "fdsf@fdsfs.fdsfsd",
        "address": {
            "place_name": "Hamptonne Country Life Museum32",
            "address_line_1": "177, Village Dhannad Indore, MP",
            "address_line_2": "Jersey",
            "postcode": "453001"
        },
        "parish": {
            "label": "St. John",
            "value": "st-john"
        },
        "opening_hours": {
            "Monday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            },
            "Tuesday": {
                "closes": "17:57",
                "opens": "15:57",
                "is_open": "1"
            },
            "Wednesday": {
                "closes": "17:57",
                "opens": "15:57",
                "is_open": "1"
            },
            "Thursday": {
                "closes": "17:57",
                "opens": "15:57",
                "is_open": "1"
            },
            "Friday": {
                "closes": "17:57",
                "opens": "15:57",
                "is_open": "1"
            },
            "Saturday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            },
            "Sunday": {
                "closes": "",
                "opens": "",
                "is_open": "0"
            }
        },
        "map_location": {
            "lat": 2.54522,
            "lng": 25.2524
        },
        "creatorId": "663d2e6171b6ab006a2ced37"

    },
    {

        "title": "test1",
        "short_description": "FREE Event at Central Library. Join for festive arts and crafts fun!",
        "types": "seasonal",
        "header_image_data": "[\"url:https://example.com/image1.jpg\"]",
        "website": "https://example.com/event1",
        "telephone_number": {
            "formatted": "undefined (undefined) undefined"
        },
        "email_address": "event1@example.com",
        "map_location": {
            "lat": 49,
            "lng": -2
        },
        "creatorId": "663d2e6171b6ab006a2ced37"

    },
    {

        "title": "test2",
        "short_description": "FREE Christmas crafts at North Library! Fun for kids aged 5+!",
        "types": "seasonal, arts",
        "header_image_data": "[\"url:https://example.com/image2.jpg\"]",
        "website": "https://example.com/event2",
        "telephone_number": {
            "formatted": "undefined (undefined) undefined"
        },
        "email_address": "event2@example.com",
        "map_location": {
            "lat": 49,
            "lng": -2
        },
        "creatorId": "663d2e6171b6ab006a2ced37"

    },
    {

        "title": "test4",
        "short_description": "Snow globe making at South Library! Join the fun!",
        "types": "",
        "header_image_data": "[\"url:https://example.com/image4.jpg\"]",
        "website": "https://example.com/event4",
        "telephone_number": {
            "formatted": "undefined (undefined) undefined"
        },
        "map_location": {
            "lat": 49,
            "lng": -2
        },
        "creatorId": "663d2e6171b6ab006a2ced37"

    },
    {

        "title": "test6",
        "short_description": "FREE Event at Jersey Library this Christmas holidays.",
        "types": "seasonal, family",
        "header_image_data": "[\"url:https://example.com/image6.jpg\"]",
        "website": "https://example.com/event6",
        "telephone_number": {
            "formatted": "undefined (undefined) undefined"
        },
        "email_address": "event6@example.com",
        "map_location": {
            "lat": 49,
            "lng": -2
        },
        "creatorId": "663d2e6171b6ab006a2ced37"

    }
]


const checkFields = (dataArray) => {
    const emptyFields = [];

    dataArray.forEach((item, index) => {
        const fieldsToCheck = ['title', 'short_description', 'types', 'header_image_data'];

        fieldsToCheck.forEach(field => {
            // Check if the field is empty or undefined
            if (!item[field] || (Array.isArray(item[field]) && item[field].length === 0)) {
                emptyFields.push(`Item ${index + 1}: ${field} is empty`);
            }
        });
    });

    return emptyFields.length > 0 ? emptyFields : ["All required fields are filled."];
};

// const checkFields = (dataArray) => {
//     const emptyFields = [];

//     dataArray.forEach((item, index) => {
//         const fieldsToCheck = ['title', 'short_description', 'types', 'header_image_data'];

//         fieldsToCheck.forEach(field => {
//             // Check if the field is empty or undefined
//             if (!item[field] || (Array.isArray(item[field]) && item[field].length === 0)) {
//                 emptyFields.push(`Item ${index + 1}: ${field} is empty`);
//             }
//         });
//     });

//     return emptyFields.length > 0 ? emptyFields : ["All required fields are filled."];
// };

const result = checkFields(data);
console.log(result);