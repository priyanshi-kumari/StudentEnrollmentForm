// Example project using JsonPowerDB API for student enrollment form

const connToken = "your-connection-token";  // Replace with your actual connection token
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";

const rollNoInput = document.getElementById("rollNo");
const fullNameInput = document.getElementById("fullName");
const classInput = document.getElementById("className");
const birthDateInput = document.getElementById("birthDate");
const addressInput = document.getElementById("address");
const enrollDateInput = document.getElementById("enrollDate");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const resetBtn = document.getElementById("resetBtn");

// On page load or reset, clear form and set initial states
function resetForm() {
  rollNoInput.value = "";
  fullNameInput.value = "";
  classInput.value = "";
  birthDateInput.value = "";
  addressInput.value = "";
  enrollDateInput.value = "";

  rollNoInput.disabled = false;
  fullNameInput.disabled = true;
  classInput.disabled = true;
  birthDateInput.disabled = true;
  addressInput.disabled = true;
  enrollDateInput.disabled = true;

  saveBtn.disabled = true;
  updateBtn.disabled = true;
  resetBtn.disabled = true;

  rollNoInput.focus();
}

// Enable inputs except primary key
function enableInputs() {
  fullNameInput.disabled = false;
  classInput.disabled = false;
  birthDateInput.disabled = false;
  addressInput.disabled = false;
  enrollDateInput.disabled = false;
}

// Validate that all fields except roll no are filled
function validateForm() {
  return (
    fullNameInput.value.trim() !== "" &&
    classInput.value.trim() !== "" &&
    birthDateInput.value.trim() !== "" &&
    addressInput.value.trim() !== "" &&
    enrollDateInput.value.trim() !== ""
  );
}

// Fetch record from JPDB by Roll No
async function fetchStudent(rollNo) {
  const url = "https://api.jsonpowerdb.com/api/relational/read";
  const data = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "GET_BY_KEY",
    key: rollNo,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Save new record
async function saveStudent(studentData) {
  const url = "https://api.jsonpowerdb.com/api/relational/create";
  const data = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "PUT",
    jsonStr: JSON.stringify(studentData),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

// Update existing record
async function updateStudent(studentData) {
  const url = "https://api.jsonpowerdb.com/api/relational/update";
  const data = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "UPDATE",
    jsonStr: JSON.stringify(studentData),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}

// On rollNo input blur, check if record exists
rollNoInput.addEventListener("blur", async () => {
  const rollNo = rollNoInput.value.trim();
  if (rollNo === "") {
    resetForm();
    return;
  }

  const result = await fetchStudent(rollNo);
  if (result.status === "success" && result.data.length > 0) {
    // Record exists - fill form and enable update/reset
    const student = result.data[0];
    fullNameInput.value = student["Full-Name"] || "";
    classInput.value = student["Class"] || "";
    birthDateInput.value = student["Birth-Date"] || "";
    addressInput.value = student["Address"] || "";
    enrollDateInput.value = student["Enrollment-Date"] || "";

    rollNoInput.disabled = true;
    enableInputs();

    saveBtn.disabled = true;
    updateBtn.disabled = false;
    resetBtn.disabled = false;

    fullNameInput.focus();
  } else {
    // No record found - enable save/reset
    enableInputs();
    saveBtn.disabled = false;
    updateBtn.disabled = true;
    resetBtn.disabled = false;

    fullNameInput.value = "";
    classInput.value = "";
    birthDateInput.value = "";
    addressInput.value = "";
    enrollDateInput.value = "";

    fullNameInput.focus();
  }
});

// Save button click handler
saveBtn.addEventListener("click", async () => {
  if (!validateForm()) {
    alert("Please fill in all fields.");
    return;
  }
  const studentData = {
    "Roll-No": rollNoInput.value.trim(),
    "Full-Name": fullNameInput.value.trim(),
    "Class": classInput.value.trim(),
    "Birth-Date": birthDateInput.value,
    "Address": addressInput.value.trim(),
    "Enrollment-Date": enrollDateInput.value,
  };

  const result = await saveStudent(studentData);
  if (result.status === "success") {
    alert("Student data saved successfully!");
    resetForm();
  } else {
    alert("Error saving data: " + JSON.stringify(result));
  }
});

// Update button click handler
updateBtn.addEventListener("click", async () => {
  if (!validateForm()) {
    alert("Please fill in all fields.");
    return;
  }
  const studentData = {
    "Roll-No": rollNoInput.value.trim(),
    "Full-Name": fullNameInput.value.trim(),
    "Class": classInput.value.trim(),
    "Birth-Date": birthDateInput.value,
    "Address": addressInput.value.trim(),
    "Enrollment-Date": enrollDateInput.value,
  };

  const result = await updateStudent(studentData);
  if (result.status === "success") {
    alert("Student data updated successfully!");
    resetForm();
  } else {
    alert("Error updating data: " + JSON.stringify(result));
  }
});

// Reset button click handler
resetBtn.addEventListener("click", resetForm);

// Initialize form on page load
resetForm();
