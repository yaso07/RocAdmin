

// Sample JSON data for products
const dummyData = [
    {
        "product_name": "Widget",
        "price": 50,
        "quantity": 2,
        "total_price": 100
    },
    {
        "product_name": "Gadget",
        "price": 100,
        "quantity": 1,
        "total_price": 100
    },
    {
        "product_name": "Tool",
        "price": 75,
        "quantity": 3,
        "total_price": 225
    },
    {
        "product_name": "Accessory",
        "price": 25,
        "quantity": 4,
        "total_price": 100
    },
    {
        "product_name": "Equipment",
        "price": 200,
        "quantity": 1,
        "total_price": 200
    }
];

const newData = {
    id:  "",
    acf: {
      map_location: { lat: "", lng: "" },
      email_address: "",
      website: "",
      address: {
        place_name:  "",
        address_line_1:  "",
        address_line_2:  "",
        postcode:  "",
      },
      parish: { label:  "", value:  "" },
      opening_hours: {
        Monday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Tuesday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Wednesday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Thursday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Friday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Saturday: {
          closes: "",
          opens: "",
          is_open: "0"
        },
        Sunday: {
          closes: "",
          opens: "",
          is_open: "0"
        }
      },
      types: "",
      telephone_number: { area_code: "", prefix: "", number:  "" },
      header_image_data: ""
    }
  }




// Define the DownloadProducts component
const DownloadProducts = () => {
    // Define column headers for CSV
    const fileHeaders = [
        'product_name',
        'price',
        'quantity',
        'total_price'
    ];

    // Function to convert JSON to CSV string
    function convertJSONToCSV(jsonData: any, columnHeaders: any) {
        // Check if JSON data is empty
        if (jsonData.length === 0) {
            return '';
        }

        // Create headers string
        const headers = columnHeaders.join(',') + '\n';

        // Map JSON data to CSV rows
        const rows = jsonData
            .map((row: any) => {
                // Map each row to CSV format
                return columnHeaders.map((field: any) => row[field] || '').join(',');
            })
            .join('\n');

        // Combine headers and rows
        return headers + rows;
    }

    // Function to initiate CSV download
    function downloadCSV(jsonData: any, headers: any) {
        const csvData = convertJSONToCSV(jsonData, headers);

        // Check if CSV data is empty
        if (csvData === '') {
            alert('No data to export');
        } else {
            // Create CSV file and initiate download
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'product_data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Render the button for CSV export
    return (
        <button
            onClick={() => {
                downloadCSV(dummyData, fileHeaders);
            }}
        >
            Export Product Data
        </button>
    );
};



// Export the component with sample data
export default DownloadProducts ;