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

    const table = document.getElementById('data-table').querySelector('tbody');
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${date}</td>
        <td>${location}</td>
        <td>${petrol.toFixed(2)}</td>
        <td>${diesel.toFixed(2)}</td>
        <td>${charcoal.toFixed(2)}</td>
        <td>${totalCO2.toFixed(2)}</td>
    `;

    document.getElementById('data-form').reset();
});

document.getElementById('download-csv').addEventListener('click', function () {
    const table = document.getElementById('data-table');
    let csv = [];
    for (let i = 0, row; row = table.rows[i]; i++) {
        let cols = [];
        for (let j = 0, col; col = row.cells[j]; j++) {
            cols.push(col.innerText);
        }
        csv.push(cols.join(","));
    }
    const csvFile = new Blob([csv.join("\n")], { type: 'text/csv' });
    saveAs(csvFile, 'ecoquant_data.csv');
});
