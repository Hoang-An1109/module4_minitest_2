// Xử lý khi tải trang
$(document).ready(function() {
    // Load danh sách lớp học và điền vào select box
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/classes",
        success: function(classes) {
            let options = '';
            for (let i = 0; i < classes.length; i++) {
                options += `<option value="${classes[i].id}">${classes[i].name}</option>`;
            }
            $('#class').html(options); // Điền vào select box khi thêm sinh viên mới
            $('#classEdit').html(options); // Điền vào select box khi chỉnh sửa sinh viên
        }
    });

    successHandler(); // Hiển thị danh sách sinh viên khi tải trang

    $('#form-add-student').on('submit', function(event) {
        event.preventDefault();
        addNewStudent();
    });

    $('#form-edit-student').on('submit', function(event) {
        event.preventDefault();
        updateStudent();
    });
});

// Hàm hiển thị danh sách sinh viên
function successHandler(page = 0) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/students?page=${page}&size=5`,
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

            $('#studentList').html(content);
        }
    });
}

// Hàm lấy thông tin của sinh viên để hiển thị trong bảng
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

// Hàm xóa sinh viên
function deleteStudent(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/api/students/${id}`,
        success: successHandler
    });
}

// Hàm thêm sinh viên mới
function addNewStudent() {
    let formData = new FormData($('#form-add-student')[0]);

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/students/create",
        data: formData,
        processData: false,
        contentType: false,
        success: function() {
            successHandler();
            $('#form-add-student')[0].reset(); // Reset form sau khi thêm thành công
        }
    });
}

// Hàm sửa thông tin sinh viên
function editStudent(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/students/${id}`,
        success: function(data) {
            $('#editId').val(data.id);
            $('#firstNameEdit').val(data.firstName);
            $('#lastNameEdit').val(data.lastName);
            $('#ageEdit').val(data.age);
            $('#phoneNumberEdit').val(data.phoneNumber);
            $('#dobEdit').val(data.dob);
            $('#addressEdit').val(data.address);
            $('#markEdit').val(data.mark);
            $('#classEdit').val(data.classes.id);

            $('#studentList').hide();
            $('#add-student').hide();
            $('#edit-student').show();
        }
    });
}

// Hàm cập nhật thông tin sinh viên sau khi sửa
function updateStudent() {
    let formData = new FormData($('#form-edit-student')[0]);
    let id = $('#editId').val();

    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/api/students/${id}`,
        data: formData,
        processData: false,
        contentType: false,
        success: function() {
            successHandler();
            $('#form-edit-student')[0].reset(); // Reset form sau khi sửa thành công
            $('#studentList').show();
            $('#edit-student').hide();
        }
    });
}

// Hàm load trang khi chuyển đổi phân trang
function loadPage(page) {
    successHandler(page);
}

// Hàm hiển thị form thêm sinh viên
function displayFormCreate() {
    $('#studentList').hide();
    $('#add-student').show();
    $('#edit-student').hide();
}