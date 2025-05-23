// Variable to keep track of the currently editing table row (if any)
let currentEditingRow = null;

// Load saved students from localStorage once the DOM content is loaded
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

// Function to add new student data when "Add" button is clicked
function StudentDataAdded() {
    // Get form input values
    const studentName = document.getElementById("sname").value;
    const idInput = document.getElementById("Id").value;
    const emailName = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Validate that none of the inputs are empty
    if (studentName === "" || idInput === "" || emailName === "" || phone === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Add student info to the table
    addStudentToTable(studentName, idInput, emailName, phone);

    // Save the updated student list to localStorage
    saveToLocalStorage();

    // Reset the form fields
    document.querySelector(".form").reset();
}

// Helper function to create and append a student row to the table
function addStudentToTable(name, id, email, phone) {
    // Create a new table row element
    const studentRow = document.createElement("tr");

    // Set the inner HTML for the row including Edit and Delete buttons
    studentRow.innerHTML = `
        <td>${name}</td>
        <td>${id}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>
            <button onclick="EditStudentsDetail(event)">Edit</button>
            <button class="delet-button" onclick="deletButtonClicked(event)">Delete</button>
        </td>
    `;


    // Append the new row to the student details table
    document.getElementById("StudentDetails").appendChild(studentRow);
}

// Function called when Edit button is clicked
function EditStudentsDetail(e) {
    // Find the row of the clicked Edit button
    const row = e.target.closest("tr");

    // Set the global variable to this row (for later updating)
    currentEditingRow = row;

    // Populate form inputs with the current data of the student
    document.getElementById("sname").value = row.children[0].innerText;
    document.getElementById("Id").value = row.children[1].innerText;
    document.getElementById("email").value = row.children[2].innerText;
    document.getElementById("phone").value = row.children[3].innerText;

    // Hide the Add button and show the Update button during edit mode
    document.getElementById("addBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
}

// Function to update the student data after editing
function updateStudent() {
    // If no row is currently being edited, do nothing
    if (!currentEditingRow) return;

    // Get the updated values from the form
    const name = document.getElementById("sname").value;
    const id = document.getElementById("Id").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Update the table row cells with new values
    currentEditingRow.children[0].innerText = name;
    currentEditingRow.children[1].innerText = id;
    currentEditingRow.children[2].innerText = email;
    currentEditingRow.children[3].innerText = phone;


    // Clear the currentEditingRow variable, ending edit mode
    currentEditingRow = null;

    // Reset the form fields
    document.querySelector(".form").reset();

    // Show the Add button again and hide the Update button
    document.getElementById("addBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";

    // Save the updated student list to localStorage
    saveToLocalStorage();
}

// Function to delete a student row when Delete button is clicked
function deletButtonClicked(e) {
    const item = e.target;

    // Only delete if the clicked button has the 'delet-button' class
    if (item.classList.contains("delet-button")) {
        // Find the parent row of the button and remove it from the table
        const row = item.closest("tr");
        row.remove();

        // Save changes to localStorage
        saveToLocalStorage();
    }
}

// Save the current student table data into localStorage
function saveToLocalStorage() {
    // Select all student rows except the table header
    const rows = document.querySelectorAll("#StudentDetails tr:not(:first-child)");
    const students = [];

    // Loop through each row and collect student data
    rows.forEach(row => {
        const student = {
            name: row.children[0].innerText,
            id: row.children[1].innerText,
            email: row.children[2].innerText,
            phone: row.children[3].innerText
        };
        students.push(student);
    });

    // Store the array as a JSON string in localStorage under key 'students'
    localStorage.setItem("students", JSON.stringify(students));
}

// Load student data from localStorage and populate the table on page load
function loadFromLocalStorage() {
    // Parse the stored student list or initialize as empty array if none found
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Add each student back into the table
    students.forEach(student => {
        addStudentToTable(student.name, student.id, student.email, student.phone);
    });
}

