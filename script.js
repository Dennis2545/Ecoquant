const webAppUrl = 'https://script.google.com/macros/s/AKfycbwddCo_fbJIiWi8lpu6Ti-kR6LTAGOo9nedai-ASpeaOrDSHA4alK_fxoVcjAXH2b7QTg/exec';

let ecoquantData = []; // Array to store collected data

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

    // Add data to the array
    const newData = {
        date: date,
        location: location,
        petrol: petrol.toFixed(2),
        diesel: diesel.toFixed(2),
        charcoal: charcoal.toFixed(2),
        totalCO2: totalCO2.toFixed(2)
    };
    ecoquantData.push(newData);

    // Update table with current data
    updateTable();

    // Save data to Google Sheets
    saveDataToGoogleSheets(newData);
});

function updateTable() {
    const tableBody = document.getElementById('data-table').querySelector('tbody');
    tableBody.innerHTML = '';

    ecoquantData.forEach(data => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${data.date}</td>
            <td>${data.location}</td>
            <td>${data.petrol}</td>
            <td>${data.diesel}</td>
            <td>${data.charcoal}</td>
            <td>${data.totalCO2}</td>
            <td><span class="action-btn" onclick="deleteRow(this)">Delete</span></td>
        `;
        tableBody.appendChild(newRow);
    });
}

function deleteRow(element) {
    const row = element.parentElement.parentElement;
    const index = row.rowIndex - 1;
    ecoquantData.splice(index, 1); // Remove data from array
    row.remove(); // Remove row from table
}

function saveDataToGoogleSheets(data) {
    fetch(webAppUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to save data. Status code: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Data saved successfully:', result);
    })
    .catch(error => console.error('Error saving data:', error));
}

document.getElementById('view-data-btn').addEventListener('click', function () {
    fetch(webAppUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status code: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            ecoquantData = data;
            updateTable();
        })
        .catch(error => console.error('Error fetching data:', error));
});
