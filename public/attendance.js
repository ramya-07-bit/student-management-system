const studentSelect = document.getElementById("student");
const table = document.getElementById("attendanceTable");

// Load students
async function loadStudents(){

const res = await fetch("/students");

const students = await res.json();

students.forEach(student=>{

studentSelect.innerHTML += `
<option value="${student._id}">
${student.name}
</option>
`;

});

}

// Save attendance
async function saveAttendance(){

const attendance={

studentId:studentSelect.value,

date:document.getElementById("date").value,

status:document.getElementById("status").value

};

await fetch("/attendance",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(attendance)

});

loadAttendance();

}

// Load attendance
async function loadAttendance(){

const res=await fetch("/attendance");

const data=await res.json();

table.innerHTML="";

data.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.studentId.name}</td>

<td>${item.date.substring(0,10)}</td>

<td>${item.status}</td>

</tr>

`;

});

}

loadStudents();

loadAttendance();