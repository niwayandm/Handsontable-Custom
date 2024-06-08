# Handsontable Custom Function

## Overview

This repository contains a custom implementation of Handsontable, a JavaScript/HTML5 data grid component with a comprehensive feature set. This custom implementation includes pagination, search functionality, row editing tracking, and dynamic row coloring.

## Features

- **Pagination**: Allows navigation through large data sets by breaking them into pages.
- **Search Functionality**: Enables real-time filtering of table data based on user input.
- **Row Editing Tracking**: Highlights edited rows and keeps track of changes.
- **Dynamic Row Coloring**: Visually differentiates edited rows from non-edited ones.

## Installation

### Clone the Repository
```bash
git clone https://github.com/niwayandm/Handsontable-Custom.git
```
## Include in Your Project
```html
<script src="path/to/Handsontable-Custom.js"></script>
```

Ensure you have Handsontable and jQuery included in your project as well:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css">
<script src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

## Example Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Handsontable Custom Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css">
</head>
<body>
    <div id="itableOutput"></div>
    <div id="paginationControls"></div>
    <input type="text" id="searchInput" placeholder="Search...">
    <button id="save-data" disabled>Save Data</button>
    <script src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="path/to/Handsontable-Custom.js"></script>
    <script>
        // Your data initialization here
        var res = JSON.stringify([ /* your JSON data */ ]);
        var originalData = JSON.parse(res);
        // Ensure you have initialized the `originalData` variable correctly
    </script>
</body>
</html>
```

### Parameters
- **container**: The HTML element where the Handsontable instance will be rendered.
- **data**: The dataset to be displayed in the table.
- **pageSize**: Number of rows per page (default is 10).

### Functions
- **updateTable()**: Updates the table data and pagination controls.
- **updatePaginationControls(totalPages)**: Updates the pagination buttons.
- **changeUpdateColor(pageData)**: Highlights the edited rows.
- **updateDisplayRangeText()**: Updates the text showing the current range of displayed rows.
- **saveData()**: Functionality to handle data saving (to be implemented).