
# HTMLTableGenerator

HTMLTableGenerator is a flexible Node.js module for creating customizable HTML tables. With its easy-to-use interface, you can generate tables from dynamic data, control styles, sort and filter rows, and even export the table data to CSV.

## Features

-   Dynamic HTML table creation from JSON data
-   Customizable table styles including header background color, header text color, cell border color, cell padding, cell font weight, and cell color
-   Ability to sort rows by a specified column in ascending or descending order
-   Ability to filter rows by a specified column and value
-   Export data to a CSV file

## Installation

Use the package manager [npm](https://npmjs.com/) to install HTMLTableGenerator.

`npm install my-html-template` 

## Usage

You can use this package in your JavaScript code like this:

    const HTMLTableGenerator = require('html-table-generator');

    // Example data
    const data = {
      title: 'My Table',
      header: ['Column 1', 'Column 2'],
      content: [
        { 'Column 1': 'Row 1', 'Column 2': 'Row 1' },
        { 'Column 1': 'Row 2', 'Column 2': 'Row 2' }
      ]
    };

    // Example options
    const options = {
      titleHeaderBgColor: '#ffffff',
      titleTextColor: '#000000',
      headerBgColor: '#ffffff',
      headerTextColor: '#000000',
      tdPadding: '10px',
      tdFontWeight: 'bold',
      tdColor: '#000000'
    };

    // Example conditional styles
    const conditionalStyles = [
      {
        targetColumn: 'Column 1',
        dependsOnColumn: 'Column 2',
        rule: value => value === 'Row 2',
        style: 'background-color: red'
      }
    ];

    // Create a new table
    const table = new HTMLTableGenerator(data, options);

    // Add a new column based on an existing column
    table.addColumn('Column 3', row => row['Column 1'] + ' - ' + row['Column 2']);

    // Add a new column that doesn't depend on existing columns
    table.addColumn('Default Value', () => 'N/A');

    // Get the HTML string
    const html = table.createTableHTML();

    // Sort rows by 'Column 1'
    table.sortRows('Column 1');

    // Sort rows by 'Column 1' in descing order
    table.sortRows('Column 1', 'desc');

    // Filter rows by 'Column 1' value 'Row 2'
    table.filterRows('Column 1', 'Row 2');

    // Export the filtered and sorted data to a CSV file
    table.exportToCSV('myData.csv');

Please ensure that you replace the data and options variables with your actual data and preferred styles.

## Error Handling

In case the validation of the data or options fails, the constructor and the `validateInput` method throw an error with a message specifying the requirement that was not fulfilled.

## Configuration

The constructor of the `HTMLTableGenerator` class accepts two arguments: a data object, an options object, and a conditionalStyles array. The data object should include a title, a header array and a content array. The options object should include style specifications for the table and its elements. The conditionalStyles array may include specific styles depending on some conditions of some columns values.

## Limitations

-   The package currently only supports creating HTML tables and exporting data to CSV. Exporting to other formats (like PDF or Excel) is not supported.
-   It assumes that the provided data is well-structured and the content matches the headers.