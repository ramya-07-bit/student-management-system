
// =========================
// Login Protection
// =========================
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

let editId = null;
let departmentChart = null;
let semesterChart = null;

// =========================
// Add / Update Student
// =========================
document.getElementById("studentForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        usn: document.getElementById("usn").value,
        department: document.getElementById("department").value,
        semester: Number(document.getElementById("semester").value)
    };

    const url = editId ? `/students/${editId}` : "/students/add";
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    const data = await response.json();

    alert(data.message);

    editId = null;

    document.getElementById("studentForm").reset();

    loadStudents();

});

// =========================
// Load Students
// =========================
async function loadStudents() {

    const response = await fetch("/students");
    const students = await response.json();

    // Dashboard
    document.getElementById("totalStudents").innerText = students.length;

    const departments = [...new Set(students.map(s => s.department))];
    document.getElementById("totalDepartments").innerText = departments.length;

    const totalSemester = students.reduce((sum, s) => sum + Number(s.semester), 0);

    const average = students.length
        ? (totalSemester / students.length).toFixed(1)
        : 0;

    document.getElementById("averageSemester").innerText = average;

    // Table
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.usn}</td>
            <td>${student.department}</td>
            <td>${student.semester}</td>

            <td>

                <button
                    class="btn btn-info btn-sm"
                    onclick="viewStudent(
                    '${student.name}',
                    '${student.usn}',
                    '${student.department}',
                    '${student.semester}')">
                    View
                </button>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editStudent(
                    '${student._id}',
                    '${student.name}',
                    '${student.usn}',
                    '${student.department}',
                    '${student.semester}')">
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteStudent('${student._id}')">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    createDepartmentChart(students);
    createSemesterChart(students);

}

// =========================
// Edit Student
// =========================
function editStudent(id, name, usn, department, semester) {

    editId = id;

    document.getElementById("name").value = name;
    document.getElementById("usn").value = usn;
    document.getElementById("department").value = department;
    document.getElementById("semester").value = semester;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// =========================
// Delete Student
// =========================
async function deleteStudent(id) {

    if (!confirm("Delete this student?")) return;

    const response = await fetch(`/students/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    loadStudents();

}

// =========================
// Search Student
// =========================
function searchStudent() {

    const input = document.getElementById("search").value.toLowerCase();

    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(input)
            ? ""
            : "none";

    });

}

// =========================
// View Student
// =========================
function viewStudent(name, usn, department, semester) {

    alert(
`Student Details

Name : ${name}

USN : ${usn}

Department : ${department}

Semester : ${semester}`
    );

}

// =========================
// Logout
// =========================
function logout() {

    localStorage.removeItem("loggedIn");

    alert("Logged Out Successfully");

    window.location.href = "login.html";

}

// =========================
// Department Chart
// =========================
function createDepartmentChart(students) {

    const count = {};

    students.forEach(s => {
        count[s.department] = (count[s.department] || 0) + 1;
    });

    if (departmentChart) {
        departmentChart.destroy();
    }

    departmentChart = new Chart(
        document.getElementById("departmentChart"),
        {
            type: "pie",
            data: {
                labels: Object.keys(count),
                datasets: [{
                    data: Object.values(count)
                }]
            }
        }
    );

}

// =========================
// Semester Chart
// =========================
function createSemesterChart(students) {

    const count = {};

    students.forEach(s => {
        count[s.semester] = (count[s.semester] || 0) + 1;
    });

    if (semesterChart) {
        semesterChart.destroy();
    }

    semesterChart = new Chart(
        document.getElementById("semesterChart"),
        {
            type: "bar",
            data: {
                labels: Object.keys(count),
                datasets: [{
                    label: "Students",
                    data: Object.values(count)
                }]
            },
            options: {
                responsive: true
            }
        }
    );

}

loadStudents();

// =========================
// Export PDF
// =========================

async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const response = await fetch("/students");

    const students = await response.json();

    doc.setFontSize(18);
    doc.text("Student Management System", 20, 20);

    doc.setFontSize(12);

    let y = 40;

    students.forEach((student, index) => {

        doc.text(
            `${index + 1}. ${student.name} | ${student.usn} | ${student.department} | Semester ${student.semester}`,
            20,
            y
        );

        y += 10;

    });

    doc.save("Student_Report.pdf");

}