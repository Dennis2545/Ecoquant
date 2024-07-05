// Function to fetch and update table with data from CSV file
function updateTable() {
    fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        const table = document.getElementById('data-table').querySelector('tbody');
        table.innerHTML = '';

        // Parse CSV data and update table rows
        data.trim().split('\n').forEach(row => {
            const cells = row.split(',');
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${cells[0]}</td>
                <td>${cells[1]}</td>
                <td>${cells[2]}</td>
                <td>${cells[3]}</td>
                <td>${cells[4]}</td>
                <td>${cells[5]}</td>
                <td><span class="action-btn" onclick="deleteRow(this)">Delete</span></td>
            `;
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Function to delete a row from table and CSV file
function deleteRow(element) {
    const row = element.parentElement.parentElement;
    const index = row.rowIndex - 1; // Adjust for header row

    // Fetch current CSV data
    fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        let lines = data.trim().split('\n');
        lines.splice(index, 1); // Remove the selected row from array
        const updatedData = lines.join('\n');

        // Update CSV file with modified data
        fetch('data.csv', {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/csv'
            },
            body: updatedData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Row deleted successfully.');
            updateTable(); // Update table after deletion
        })
        .catch(error => console.error('Error deleting row:', error));
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.getElementById('data-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const petrol = parseFloat(document.getElementById('petrol').value) || 0;
    const diesel = parseFloat(document.getElementById('diesel').value) || 0;
    const charcoal = parseFloat(document.getElementById('charcoal').value) || 0;

    const petrolCO2 = petrol * 2.31; // Example emission factor: 2.31 kg CO2 per litre of petrol
    const dieselCO2 = diesel * 2.68; // Example emission factor: 2.68 kg CO2 per litre of diesel
    const charcoalCO2 = charcoal * 3.67; // Example emission factor: 3.67 kg CO2 per kilo of charcoal

    const totalCO2 = petrolCO2 + dieselCO2 + charcoalCO2;

    // Prepare data to append to CSV
    const newData = `${date},${location},${petrol.toFixed(2)},${diesel.toFixed(2)},${charcoal.toFixed(2)},${totalCO2.toFixed(2)}\n`;

    // Append data to CSV file in repository
    fetch('data.csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/csv'
        },
        body: newData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Data saved successfully.');
        updateTable(); // Update table with current data
        document.getElementById('data-form').reset();
    })
    .catch(error => console.error('Error saving data:', error));
});

// Initial table update on page load
updateTable();
