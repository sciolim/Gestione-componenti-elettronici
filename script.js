document.addEventListener("DOMContentLoaded", function () {
    init();
});

let records = []; // Array per memorizzare i record
let currentRecord = null; // Record attualmente selezionato

function init() {
    console.log("Applicazione inizializzata");

    // Carica i dati da localStorage se presenti
    const savedRecords = localStorage.getItem("records");
    if (savedRecords) {
        records = JSON.parse(savedRecords);
        aggiornaLista();
    }

    // Aggiungi event listener ai pulsanti
    document.getElementById("newRecord").addEventListener("click", nuovoRecord);
    document.getElementById("editRecord").addEventListener("click", modificaRecord);
    document.getElementById("saveRecord").addEventListener("click", salvaRecord);
    document.getElementById("delRecord").addEventListener("click", eliminaRecord);
    document.getElementById("cancelOP").addEventListener("click", annullaOperazione);
    document.getElementById("import").addEventListener("click", importaRecord);
    document.getElementById("export").addEventListener("click", esportaRecord);
    document.getElementById("print").addEventListener("click", stampaRecord);
    document.getElementById("trova").addEventListener("click", cercaRecord);

    // Popola i dropdown con più opzioni
    popolaDropdown("cmbMarca", [
        "Maxim", "Texas Instruments", "STMicroelectronics", "Analog Devices", 
        "Infineon", "ON Semiconductor", "Nxp Semiconductors", "Microchip", 
        "Intel", "Amd", "Broadcom", "Qualcomm", "Renesas", "Vishay", "ROHM"
    ]);
    popolaDropdown("cmbTipo", [
        "Amp Op", "Diodo", "Transistor", "Resistore", 
        "Condensatore", "Induttore", "Microcontrollore", "Reg, V", 
        "Conv. DC-DC", "LED", "Fotodiodo", "Optoisolatore", "Relè", 
        "Trasformatore", "Fusibile", "Interruttore", "Connettore", "Quarzo", 
        "Sensore T°", "Sensore P.", "Sensore Mov.", 
        "M. Flash", "M. RAM", "M. EEPROM", "ADC", 
        "DAC", "Timer", "Comparatore V", 
        "MOSFET", "LED", "Dip logici", "Dip potenza", 
        "Dip segnale", "Dip interfaccia", "Dip comunicazione"
    ]);
    popolaDropdown("cmbPackage", [
        "DIP", "SMD", "TO-220", "QFN", "BGA", "SOT-23", "TQFP", "SOIC", 
        "LQFP", "PLCC", "SSOP", "TSOP", "DFN", "QFP", "CSP", "PDIP", "VQFN"
    ]);
}

function nuovoRecord() {
    // Resetta i campi per un nuovo record
    document.getElementById("codice").value = "";
    document.getElementById("qta").value = "";
    document.getElementById("cmbMarca").selectedIndex = 0;
    document.getElementById("cmbTipo").selectedIndex = 0;
    document.getElementById("cmbPackage").selectedIndex = 0;
    document.getElementById("pins").value = "";
    document.getElementById("descrizione").value = "";
    document.getElementById("note").value = "";
    document.getElementById("pozione").value = "";

    currentRecord = null; // Nessun record selezionato
}

function modificaRecord() {
    if (currentRecord) {
        // Popola i campi con i dati del record selezionato
        document.getElementById("codice").value = currentRecord.codice;
        document.getElementById("qta").value = currentRecord.qta;
        document.getElementById("cmbMarca").value = currentRecord.marca;
        document.getElementById("cmbTipo").value = currentRecord.tipo;
        document.getElementById("cmbPackage").value = currentRecord.package;
        document.getElementById("pins").value = currentRecord.pins;
        document.getElementById("descrizione").value = currentRecord.descrizione;
        document.getElementById("note").value = currentRecord.note;
        document.getElementById("pozione").value = currentRecord.pozione;
    } else {
        alert("Nessun record selezionato.");
    }
}

function salvaRecord() {
    const codice = document.getElementById("codice").value;
    const qta = document.getElementById("qta").value;
    const marca = document.getElementById("cmbMarca").value;
    const tipo = document.getElementById("cmbTipo").value;
    const package = document.getElementById("cmbPackage").value;
    const pins = document.getElementById("pins").value;
    const descrizione = document.getElementById("descrizione").value;
    const note = document.getElementById("note").value;
    const pozione = document.getElementById("pozione").value;

    if (codice && qta && marca && tipo) {
        const record = {
            codice,
            qta,
            marca,
            tipo,
            package,
            pins,
            descrizione,
            note,
            pozione
        };

        if (currentRecord) {
            // Aggiorna il record esistente
            const index = records.findIndex(r => r.codice === currentRecord.codice);
            records[index] = record;
        } else {
            // Aggiungi un nuovo record
            records.push(record);
        }

        salvaDati(); // Salva i dati in localStorage
        aggiornaLista();
        nuovoRecord(); // Resetta i campi
    } else {
        alert("Compila tutti i campi obbligatori.");
    }
}

function eliminaRecord() {
    if (currentRecord) {
        records = records.filter(r => r.codice !== currentRecord.codice);
        salvaDati(); // Salva i dati in localStorage
        aggiornaLista();
        nuovoRecord(); // Resetta i campi
    } else {
        alert("Nessun record selezionato.");
    }
}

function annullaOperazione() {
    nuovoRecord(); // Resetta i campi
}

function cercaRecord() {
    const searchTerm = document.getElementById("srch").value.toLowerCase();
    const risultati = records.filter(r => r.codice.toLowerCase().includes(searchTerm));
    aggiornaLista(risultati);
}

function aggiornaLista(recordsDaMostrare = records) {
    const listaRecords = document.getElementById("listaRecords");
    listaRecords.innerHTML = ""; // Svuota la lista

    recordsDaMostrare.forEach(record => {
        const ul = document.createElement("ul");
        ul.innerHTML = `
            <li>${record.codice}</li>
            <li>${record.tipo}</li>
            <li>${record.marca}</li>
            <li>${record.qta}</li>
            <li>${record.pins}</li>
        `;
        ul.addEventListener("click", () => selezionaRecord(record));
        listaRecords.appendChild(ul);
    });
}

function selezionaRecord(record) {
    currentRecord = record;
    modificaRecord(); // Popola i campi con il record selezionato
}

function popolaDropdown(id, opzioni) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = opzioni.map(opzione => `<option value="${opzione}">${opzione}</option>`).join("");
}

function importaRecord() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            records = JSON.parse(e.target.result);
            salvaDati(); // Salva i dati in localStorage
            aggiornaLista();
        };
        reader.readAsText(file);
    };
    input.click();
}

function esportaRecord() {
    const dataStr = JSON.stringify(records, null, 2);
    
    // Creiamo un popup con il contenuto del file .json
    const popup = window.open("", "Export JSON", "width=600,height=400");
    popup.document.write(`
        <html>
            <head>
                <title>Esporta JSON</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background: #f4f4f9; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
                    button { margin-top: 10px; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
                    button:hover { background-color: #0056b3; }
                </style>
            </head>
            <body>
                <h1>Contenuto Esportato</h1>
                <pre id="jsonContent">${dataStr}</pre>
                <button onclick="copyContent()">Copia contenuto</button>
                <script>
                    function copyContent() {
                        const content = document.getElementById('jsonContent').innerText;
                        navigator.clipboard.writeText(content).then(() => {
                            alert('Contenuto copiato negli appunti!');
                        }).catch(err => {
                            console.error('Errore durante la copia: ', err);
                        });
                    }
                </script>
            </body>
        </html>
    `);
    popup.document.close();
}

function stampaRecord() {
    window.print();
}

// Funzione per salvare i dati in localStorage
function salvaDati() {
    localStorage.setItem("records", JSON.stringify(records));
}