function successHandler() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/students",
        success: function (data) {
            let content = '<table id="display-list"  border="1"><tr>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>Age</th>' +
                '<th>Phone Number</th>' +
                '<th>Date of Birth</th>' +
                '<th>Address</th>' +
                '<th>Mark</th>' +
                '<th>Class</th>' +
                '<th>Image</th>' +
                '<th>Edit</th>' +
                '<th>Delete</th>' +
                '</tr>';
            for (let i = 0; i < data.content.length; i++) {
                content += getStudent(data.content[i]);
            }
            content += "</table>";

            // Hiển thị nút phân trang
            content += `<div id="pagination" style="margin-top: 10px;">`;
            if (!data.first) {
                content += `<button onclick="loadPage(${data.number - 1})">Previous</button>`;
            }
            for (let i = 0; i < data.totalPages; i++) {
                content += `<button onclick="loadPage(${i})">${i + 1}</button>`;
            }
            if (!data.last) {
                content += `<button onclick="loadPage(${data.number + 1})">Next</button>`;
            }
            content += `</div>`;

            document.getElementById('studentList').innerHTML = content;
            document.getElementById('studentList').style.display = "block";
            document.getElementById('add-student').style.display = "none";
            document.getElementById('edit-student').style.display = "none";
            document.getElementById('display-create').style.display = "block";
            document.getElementById('title').style.display = "block";
        }
    });
}

function displayFormCreate() {
    document.getElementById('studentList').style.display = "none";
    document.getElementById('add-student').style.display = "block";
    document.getElementById('edit-student').style.display = "none";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

function getStudent(student) {
    return `<tr><td>${student.firstName}</td>` +
        `<td>${student.lastName}</td>` +
        `<td>${student.age}</td>` +
        `<td>${student.phoneNumber}</td>` +
        `<td>${student.dob}</td>` +
        `<td>${student.address}</td>` +
        `<td>${student.mark}</td>` +
        `<td>${student.classes.name}</td>` +
        `<td><img src="/uploads/${student.img}" width="50" height="50"/></td>` +
        `<td class="btn"><button class="editStudent" onclick="editStudent(${student.id})">Edit</button></td>` +
        `<td class="btn"><button class="deleteStudent" onclick="deleteStudent(${student.id})">Delete</button></td></tr>`;
}

function deleteStudent(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/api/students/${id}`,
        success: successHandler
    });
}

function addNewStudent(event) {
    event.preventDefault();
    let formData = new FormData(document.getElementById('form-add-student'));

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/students/create",
        data: formData,
        processData: false,
        contentType: false,
        success: successHandler
    });
}

function editStudent(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/students/${id}`,
        success: function(data) {
            $('#firstNameEdit').val(data.firstName);
            $('#lastNameEdit').val(data.lastName);
            $('#ageEdit').val(data.age);
            $('#phoneNumberEdit').val(data.phoneNumber);
            $('#dobEdit').val(data.dob);
            $('#addressEdit').val(data.address);
            $('#markEdit').val(data.mark);
            $('#classEdit').val(data.classes.id);
            document.getElementById('studentList').style.display = "none";
            document.getElementById('add-student').style.display = "none";
            document.getElementById('edit-student').style.display = "block";
            document.getElementById('display-create').style.display = "none";
            document.getElementById('title').style.display = "none";
            $('#edit-student').data('id', id);
        }
    });
}

function updateStudent(event) {
    event.preventDefault();
    let id = $('#edit-student').data('id');
    let formData = new FormData(document.getElementById('form-edit-student'));

    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/api/students/${id}`,
        data: formData,
        processData: false,
        contentType: false,
        success: successHandler
    });
}

function loadPage(page) {
    successHandler(page);
}

$(document).ready(function() {
    successHandler();
    $('#form-add-student').on('submit', addNewStudent);
    $('#form-edit-student').on('submit', updateStudent);
});