function successHandler() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/classes",
        success: function (data) {
            let content = '    <table id="display-list"  border="1"><tr>\n' +
                '        <th>Name</td>\n' +
                '        <th>Edit</td>\n' +
                '        <th>Delete</td>\n' +
                '    </tr>';
            for (let i = 0; i < data.length; i++) {
                content += getClasses(data[i]);
            }
            content += "</table>"
            document.getElementById('classesList').innerHTML = content;
            document.getElementById('classesList').style.display = "block";
            document.getElementById('add-classes').style.display = "none";
            document.getElementById('edit-classes').style.display = "none";
            document.getElementById('display-create').style.display = "block";
            document.getElementById('title').style.display = "block";
        }
    });
}

function displayFormCreate() {
    document.getElementById('classesList').style.display = "none";
    document.getElementById('add-classes').style.display = "block";
    document.getElementById('edit-classes').style.display = "none";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

function getClasses(classes) {
    return `<tr><td >${classes.name}</td>` +
        `<td class="btn"><button class="editClasses" onclick="editClasses(${classes.id})">Edit</button></td>` +
        `<td class="btn"><button class="deleteClasses" onclick="deleteClasses(${classes.id})">Delete</button></td></tr>`;
}

function deleteClasses(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/api/classes/${id}`,
        success: successHandler
    });
}

function addNewClasses() {
    let name = $('#name').val();
    let newClasses = {
        name: name
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newClasses),
        url: "http://localhost:8080/api/classes",
        success: successHandler
    });
    event.preventDefault();
}

function editClasses(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/classes/${id}`,
        success: function(data) {
            $('#nameEdit').val(data.name);
            document.getElementById('classesList').style.display = "none";
            document.getElementById('add-classes').style.display = "none";
            document.getElementById('edit-classes').style.display = "block";
            document.getElementById('display-create').style.display = "none";
            document.getElementById('title').style.display = "none";
            $('#edit-classes').data('id', id);
        }
    });
}

function updateClasses(event) {
    event.preventDefault();
    let id = $('#edit-classes').data('id');
    let name = $('#nameEdit').val();
    let updatedClasses = {
        name: name
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(updatedClasses),
        url: `http://localhost:8080/api/classes/${id}`,
        success: successHandler
    });
}