import {initializeApp} from 'https://cdn.skypack.dev/firebase@10.7.0/app';
import {getFirestore, doc, getDoc, getDocs, collection, addDoc, onSnapshot} from 'https://cdn.skypack.dev/firebase@10.7.0/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyB6g1ohM2KKXt_is8Nn4VaxvYXecKEhrD0",
    authDomain: "invoicing-app-e92b0.firebaseapp.com",
    databaseURL: "https://invoicing-app-e92b0-default-rtdb.firebaseio.com",
    projectId: "invoicing-app-e92b0",
    storageBucket: "invoicing-app-e92b0.appspot.com",
    messagingSenderId: "234765308158",
    appId: "1:234765308158:web:ad0f2deb9c5745548795af",
    measurementId: "G-PD0261LXLT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const clientsDataRef = collection(db, "clientsData");

let addWebsiteDetails = document.getElementById("submit");
addWebsiteDetails.addEventListener("click", async (e) => {
    e.preventDefault();
    let website = document.getElementById("website").value;
    let attn = document.getElementById("attn").value;
    let designation = document.getElementById("designation").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;

    if (!website || !attn || !designation || !mobile || !email) {
        alert("Please fill in all the fields!");
        return;
    }

    try {
        const docRef = await addDoc(clientsDataRef, {
            Website: website,
            Attn: attn,
            Designation: designation,
            Mobile: mobile,
            Email: email
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Data added successfully!");

        // Clear form fields
        document.getElementById("website").value = "";
        document.getElementById("attn").value = "";
        document.getElementById("designation").value = "";
        document.getElementById("mobile").value = "";
        document.getElementById("email").value = "";
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding data!");
    }
});


const servicesDataRef = collection(db, "services");

let addServiceBtn = document.getElementById("submitService");
addServiceBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let service = document.getElementById("service").value;
    let price = document.getElementById("price").value;

    if (!service || !price) {
        alert("Please fill in all the fields!");
        return;
    }

    try {
        const docRef = await addDoc(servicesDataRef, {
            Service: service,
            Price: price,
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Service added successfully!");

        // Clear form fields
        document.getElementById("service").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        document.getElementById("total").value = "";
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding service!");
    }
});


var stdNo = 0;
var tbody = document.getElementById("tbody1");
function addItemToTable(websiteName, attn, designation, mobile, email) {
    let trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");

    td1.innerHTML = ++stdNo;
    td2.innerHTML = websiteName;
    td3.innerHTML = attn;
    td4.innerHTML = designation;
    td5.innerHTML = mobile;
    td6.innerHTML = email;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);

    tbody.appendChild(trow);
}
function addAllItemToTable(theWebsite) {
    stdNo = 0;
    tbody.innerHTML = "";
    theWebsite.forEach(element => {
        addItemToTable(element.Website, element.Attn, element.Designation, element.Mobile, element.Email)
    })
}

async function getAllDataRealTime() {
    const dbRef =  collection(db, "clientsData");
    onSnapshot(dbRef, (querySnapshot) => {
        var website = [];
        querySnapshot.forEach(doc => {
            website.push(doc.data());
        })
        addAllItemToTable(website);
    })
}
window.onload = getAllDataRealTime();

//code for second table to fetch data from firestore and display in table
var serviceNo = 0;
var serviceTbody = document.getElementById("tbody2");
function addServiceItemToTable(service, price) {
    let serviceTrow = document.createElement("tr");
    let serviceTd1 = document.createElement("td");
    let serviceTd2 = document.createElement("td");
    let serviceTd3 = document.createElement("td");

    serviceTd1.innerHTML = ++serviceNo;
    serviceTd2.innerHTML = service;
    serviceTd3.innerHTML = price;

    serviceTrow.appendChild(serviceTd1);
    serviceTrow.appendChild(serviceTd2);
    serviceTrow.appendChild(serviceTd3);

    serviceTbody.appendChild(serviceTrow);
}
function addAllServiceItemsToTable(services) {
    serviceNo = 0;
    serviceTbody.innerHTML = "";
    services.forEach(element => {
        addServiceItemToTable(element.Service, element.Price)
    })
}

async function getAllServiceDataRealTime() {
    const dbRef = collection(db, "services");
    onSnapshot(dbRef, (querySnapshot) => {
        var services = [];
        querySnapshot.forEach(doc => {
            services.push(doc.data());
        })
        addAllServiceItemsToTable(services);
    })
}

window.onload = getAllServiceDataRealTime();


let selectedClient = null;
let selectedService = null;

// Search functionality for Website table
const websiteInput = document.getElementById("website");
websiteInput.addEventListener("input", async (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const dbRef = collection(db, "clientsData");
    const querySnapshot = await getDocs(dbRef);
    const filteredData = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.Website.toLowerCase().includes(searchQuery) || data.Attn.toLowerCase().includes(searchQuery) || data.Designation.toLowerCase().includes(searchQuery) || data.Mobile.toLowerCase().includes(searchQuery) || data.Email.toLowerCase().includes(searchQuery);
    }).map((doc) => doc.data());

    const searchResultsWebsite = document.getElementById("search-results-website");
    searchResultsWebsite.innerHTML = "";
    filteredData.forEach((result) => {
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.textContent = `${result.Website}, ${result.Attn}, ${result.Designation}, ${result.Mobile}, ${result.Email}`;
        listItem.dataset.value = JSON.stringify(result); // store the selected value as JSON string
        searchResultsWebsite.appendChild(listItem);
    });
});

// Add event listener to list items
document.getElementById("search-results-website").addEventListener("click", (e) => {
    if (e.target.tagName === "DIV" && e.target.className === "list-item") {
        const selectedValue = JSON.parse(e.target.dataset.value); // parse JSON string back to object
        e.target.style.backgroundColor = "#ccc"; // change background color
        selectedClient = selectedValue;
    }
});

// Search functionality for Service table
const serviceInput = document.getElementById("service");
serviceInput.addEventListener("input", async (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const dbRef = collection(db, "services");
    const querySnapshot = await getDocs(dbRef);
    const filteredData = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.Service.toLowerCase().includes(searchQuery);
    }).map((doc) => doc.data());

    const searchResultsService = document.getElementById("search-results-service");
    searchResultsService.innerHTML = "";
    filteredData.forEach((result) => {
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.textContent = ` ${result.Service}, ${result.Price}`;
        listItem.dataset.value = JSON.stringify(result); // store the selected value as JSON string
        searchResultsService.appendChild(listItem);
    });
});

// Add event listener to list items
document.getElementById("search-results-service").addEventListener("click", (e) => {
    if (e.target.tagName === "DIV" && e.target.className === "list-item") {
        const selectedValue = JSON.parse(e.target.dataset.value); // parse JSON string back to object
        e.target.style.backgroundColor = "#ccc"; // change background color
        selectedService = selectedValue;
    }
});


// Button to select client
const selectClientButton = document.getElementById("selectClient");
selectClientButton.addEventListener("click", () => {
    if (selectedClient) {
        document.getElementById("website").value = selectedClient.Website;
        document.getElementById("attn").value = selectedClient.Attn;
        document.getElementById("designation").value = selectedClient.Designation;
        document.getElementById("mobile").value = selectedClient.Mobile;
        document.getElementById("email").value = selectedClient.Email;
        // Clear the search results
        document.getElementById("search-results-website").innerHTML = "";
        selectedClient = null; // Reset the selected client
    }
});

// Button to select service
const selectServiceButton = document.getElementById("selectService");
selectServiceButton.addEventListener("click", () => {
    if (selectedService) {
        document.getElementById("service").value = selectedService.Service;
        document.getElementById("price").value = selectedService.Price;
        // Clear the search results
        document.getElementById("search-results-service").innerHTML = "";
        selectedService = null; // Reset the selected service
    }
});

//Calculations
// Get the input fields
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const totalInput = document.getElementById('total');
const subtotalInput = document.getElementById('subtotal');
const discountInput = document.getElementById('discount');
const cgstInput = document.getElementById('cgst');
const sgstInput = document.getElementById('sgst');
const grandTotalInput = document.getElementById('grandTotal');
const calculateButton = document.getElementById('calculateButton');

// Set initial quantity to 1
quantityInput.value = 1;

// Add event listener to calculate button
calculateButton.addEventListener('click', calculateTotal);

function calculateTotal() {
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const total = quantity * price;
    totalInput.value = total.toFixed(2);

    // Calculate subtotal
    const subtotal = total;
    subtotalInput.value = subtotal.toFixed(2);

    // Calculate discount
    const discount = parseFloat(discountInput.value);
    let discountedSubtotal = subtotal;
    if (discount > 0) {
        discountedSubtotal = subtotal - discount;
    }

    // Calculate CGST and SGST
    const cgst = (discountedSubtotal * 0.09).toFixed(2);
    const sgst = (discountedSubtotal * 0.09).toFixed(2);
    cgstInput.value = cgst;
    sgstInput.value = sgst;

    // Calculate grand total
    const grandTotal = discountedSubtotal + parseFloat(cgst) + parseFloat(sgst);
    grandTotalInput.value = grandTotal.toFixed(2);
}

//download pdf
const downloadPdfButton = document.getElementById("downloadInovice");

downloadPdfButton.addEventListener("click", () => {
    // Hide buttons and tables
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.style.display = "none";
    });

    const tables = document.querySelectorAll("table");
    tables.forEach((table) => {
        table.style.display = "none";
    });

    // Clone the body element to include the data
    const pdfContent = document.body.cloneNode(true);

    // Remove the buttons and tables from the cloned body
    pdfContent.querySelectorAll("button").forEach((button) => {
        button.remove();
    });

    pdfContent.querySelectorAll("table").forEach((table) => {
        table.remove();
    });

    // Create a new PDF instance
    const opt = {
        margin: 0,
        filename: "invoice.pdf",
        image: {
            type: "jpeg",
            quality: 0.98,
        },
        html2canvas: {
            scale: 1,
            useCORS: true,
        },
        jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
            pageSize: 'A4',
        },
    };

    // html2pdf().from(pdfContent).set(opt).save();
    html2pdf().from(pdfContent).set(opt).save().then(() => {
        // Refresh the page after downloading the PDF
        window.location.reload();
    });
    // Show buttons and tables again
    buttons.forEach((button) => {
        button.style.display = "block";
    });

    tables.forEach((table) => {
        table.style.display = "table";
    });
});

