var originalData = JSON.parse(res);
var data = JSON.parse(JSON.stringify(originalData));
var changes = {}; // Object to track changes

var totalPages;
var pageSize = 10;
var currentPage = 1;
var editedRows = new Set();

// Handsontable Initialization
var container = document.getElementById('itableOutput');
var hot = new Handsontable(container, {
    width: '100%',
    height: 370,
    colWidths: 100,
    rowHeights: 30,
    data: data,
    columns: [{
            data: 'coid',
            title: 'coid'
        },
        {
            data: 'dod',
            title: 'dod'
        },

    ],
    filters: true,
    dropdownMenu: true,
    columnSorting: true,
    licenseKey: 'non-commercial-and-evaluation',
    afterChange: function(change, source) {
        if (source !== 'loadData' && change) {
            change.forEach(function([row, prop, oldValue, newValue]) {
                var rowData = hot.getSourceDataAtRow(row);
                var originalRowData = originalData[row];
                var uniqueId = rowData["id"];
                var isRowEdited = false;

                // Check all values in the row
                for (var key in rowData) {
                    if (rowData[key] !== originalRowData[key]) {
                        isRowEdited = true;
                        break;
                    }
                }

                if (isRowEdited) {
                    if (!changes[uniqueId]) {
                        changes[uniqueId] = {};
                    }
                    changes[uniqueId] = rowData;
                    editedRows.add(uniqueId);

                    $('#save-data').prop('disabled', false);
                } else {
                    editedRows.delete(uniqueId);

                    if (editedRows.size == 0) {
                        $('#save-data').prop('disabled', true);
                    }
                }
            });

            updateTable();
        }
    },
    afterColumnSort: function() {
        highlightEditedRows(); // Call the function to highlight edited rows
    },

});

function updatePaginationControls(totalPages) {
    var container = $('#paginationControls');
    container.empty(); // Clear existing buttons

    // Previous Button
    var prevBtn = $('<button>', {
        'class': 'btn btn-default',
        'text': 'Previous',
        'id': 'prevPage',
        'click': function() {
            if (currentPage > 1) {
                currentPage--;
                updateTable();
                updatePaginationControls(totalPages);
            }
        }
    });
    container.append(prevBtn);

    // First Page Button
    var firstPageBtn = $('<button>', {
        'class': 'btn btn-default' + (currentPage === 1 ? ' disabled' : ''),
        'text': '1',
        'click': function() {
            if (currentPage !== 1) {
                currentPage = 1;
                updateTable();
                updatePaginationControls(totalPages);
            }
        }
    });
    container.append(firstPageBtn);

    // Ellipsis for pages before current selection if needed
    if (currentPage > 3) {
        var ellipsisPrev = $('<button>', {
            'class': 'btn btn-default disabled',
            'text': '...',
            'disabled': true
        });
        container.append(ellipsisPrev);
    }

    // Compute the visible range of page numbers
    var startPage = Math.max(currentPage - 2, 2);
    var endPage = Math.min(startPage + 4, totalPages - 1);

    // Adjust if nearing the last page
    if (currentPage > totalPages - 4) {
        startPage = Math.max(totalPages - 4, 2);
        endPage = totalPages - 1;
    }

    // Dynamic page buttons
    for (var i = startPage; i <= endPage; i++) {
        var pageBtn = $('<button>', {
            'class': 'btn btn-default' + (i === currentPage ? ' disabled' : ''),
            'text': i,
            'click': function(e) {
                var selectedPage = parseInt(e.target.innerText);
                if (selectedPage !== currentPage) {
                    currentPage = selectedPage;
                    updateTable();
                    updatePaginationControls(totalPages);
                }
            }
        });
        container.append(pageBtn);
    }

    // Ellipsis for pages after current selection if needed
    if (currentPage < totalPages - 2) {
        var ellipsisNext = $('<button>', {
            'class': 'btn btn-default disabled',
            'text': '...',
            'disabled': true
        });
        container.append(ellipsisNext);
    }

    // Last Page Button
    var lastPageBtn = $('<button>', {
        'class': 'btn btn-default' + (currentPage === totalPages ? ' disabled' : ''),
        'text': totalPages,
        'click': function() {
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                updateTable();
                updatePaginationControls(totalPages);
            }
        }
    });
    container.append(lastPageBtn);

    // Next Button
    var nextBtn = $('<button>', {
        'class': 'btn btn-default',
        'text': 'Next',
        'id': 'nextPage',
        'click': function() {
            if (currentPage < totalPages) {
                currentPage++;
                updateTable();
                updatePaginationControls(totalPages);
            }
        }
    });
    container.append(nextBtn);
}

function changeUpdateColor(pageData) {
    pageData.forEach((row, index) => {
        var uniqueId = row['id'];
        for (var col = 0; col < hot.countCols(); col++) {
            if (editedRows.has(uniqueId)) {
                hot.getCell(index, col).style.backgroundColor = 'yellow';
            } else {
                hot.getCell(index, col).style.backgroundColor = '';
            }
        }
    });
}

function updateDisplayRangeText() {
    var startIndex = (currentPage - 1) * pageSize + 1;
    var endIndex = Math.min(startIndex + pageSize - 1, data.length);
    var text = "Showing " + startIndex + " to " + endIndex + " of " + data.length + " entries";

    $('#displayRange').text(text);
}

function updateTable() {
    var filteredData = data
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize, filteredData.length);
    var pageData = filteredData.slice(startIndex, endIndex);
    hot.loadData(pageData);

    totalPages = Math.ceil(data.length / pageSize);
    updatePaginationControls(totalPages);
    updateDisplayRangeText();
    changeUpdateColor(pageData);
}

$('#pageSize').on('change', function(event) {
    pageSize = parseInt(event.target.value, 10);
    currentPage = 1; // Reset back to the first page
    updateTable();
});

// Event listener for firstPage, prevPage, nextPage, and lastPage
$('#paginationControls').on('click', 'button', function(event) {
    var targetId = event.target.id;

    switch (targetId) {
        case 'firstPage':
            currentPage = 1;
            break;
        case 'prevPage':
            if (currentPage > 1) currentPage--;
            break;
        case 'nextPage':
            if (currentPage < totalPages) currentPage++;
            break;
        case 'lastPage':
            currentPage = totalPages;
            break;
    }

    updateTable();
    updatePaginationControls(totalPages);
});


$('#searchInput').on('keyup', function(event) {
    var searchQuery = event.target.value.toLowerCase();

    if (searchQuery) {
        data = JSON.parse(JSON.stringify(originalData));
        data = data.filter(function(row) {
            // Convert the object values to an array and then use some
            return Object.values(row).some(function(cell) {
                return cell.toString().toLowerCase().includes(searchQuery);
            });
        });
    } else {
        // Restore the original data if the search query is empty
        data = JSON.parse(JSON.stringify(originalData));
    }

    currentPage = 1; // Reset to first page
    updateTable();
});


$('#save-data').on('click', function() {
    
});


    updateTable(); // Initial table load
