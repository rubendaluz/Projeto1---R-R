
// *******************************************************
// Declaracoes de variaveis globais
// *******************************************************
import {ip} from './config/config.js';

// Variaveis para os Rooms

const new_room_form_close_button = document.querySelector("#new_room_form_close_button");
const roomsTableBody = document.getElementById("rooms_table_body");
const add_edit_room_form  = document.querySelector(".new_room_form");
const add_new_room_button = document.querySelector("#add_new_room_button");
add_new_room_button.addEventListener("click", add_or_edit_room);


new_room_form_close_button.addEventListener("click", toggleNewRoomForm);
const create_room_button = document.querySelector("#create_room_button");
create_room_button.addEventListener("click", toggleNewRoomForm);


// ****************************************************************************************************
// Event Listeners
// ****************************************************************************************************
document.addEventListener("DOMContentLoaded", (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../HTML/login.html";
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userNameElement = document.querySelector(".user-name");
    userNameElement.textContent = user.username || "Admin";



    getAllRooms() ;   
    var currentPage = window.location.pathname.split('/').pop();

    document.querySelectorAll('.menu_buttons').forEach(function(button) {
        var buttonHref = button.querySelector('a').getAttribute('href');
        
        if (currentPage === buttonHref) {
            button.classList.add('active');
        }
    });
})
roomsTableBody.addEventListener("click", handleRoomClick);



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// funcoes 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
function add_or_edit_room() {
  
    const room_name = document.querySelector("#new_room_name").value;
    const room_security_level = document.querySelector("#new_room_security_level").value;

       // Dados que você deseja enviar no corpo da solicitação
       const data = {
        roomName: room_name,
        access_level_required: room_security_level,
        description: "exemplo"
    };


    
    // Check if you are in edit mode or add mode
    const isEditMode = add_edit_room_form.getAttribute("data-edit-mode") === "true";
    let roomId = add_edit_room_form.getAttribute("roomId");

    // URL for API endpoint
    const url = isEditMode ? `http://${ip}:4242/api/room/${roomId}` : `http://${ip}:4242/api/room/`;

    // HTTP method for API request
    const method = isEditMode ? "PUT" : "POST";

    // Configuration for the fetch request
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Make the API request
    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to make the API request');
            }
        })
        .then(data => {
            console.log(data); // Handle the response data
            toggleNewRoomForm();
            getAllRooms ();
           
        })
        .catch(error => {
            console.error(error);
        });

    // Additional code for updating the table, closing the form, etc.
}

























let add_room_to_table = (id, roomname, roomseclevel) => {
    const room_table_body = document.querySelector("#rooms_table_body");

    room_table_body.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${roomname}</td>
            <td>${roomseclevel}</td>
            <td class="action-icons">
            <a href="#" title="Edit"><i class="fas fa-edit edit_room_btn"></i></a>
            <a href="#" title="Delete"><i class="fas fa-trash-alt delete_room_btn"></i></a>
        </td>
        </tr>
    `
}


let getAllRooms = () => {
    const url = `http://${ip}:4242/api/room/`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
         
        return response.json(); // or response.text() if the response is not JSON
    })
    .then(rooms => {
        console.log(rooms);
        const tableBody = document.getElementById("rooms_table_body");
            tableBody.innerHTML = ""; // Limpa o conteúdo atual da tabela
        rooms.forEach(room => {
            add_room_to_table(room["id"],room["roomName"], room["access_level_required"]);
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}









let clear_new_room_form = () => {
    document.querySelector("#new_room_name").value = "";
    document.querySelector("#new_room_security_level").value = "";
    document.querySelector("#add_new_room_button").textContent = "Create Room";

}

function toggleNewRoomForm() {
    if (add_edit_room_form.style.display == "none") {
        clear_new_room_form();
        add_edit_room_form.style.display = "block";
    } else {
        add_edit_room_form.style.display = "none";
        clear_new_room_form();
        add_edit_room_form.setAttribute("data-edit-mode", "false");
    }

}


function handleRoomClick(event) {
    const target = event.target;
    
    const clickedRow = event.target.closest('tr');

    const id = clickedRow.querySelector('td:nth-child(1)').textContent;
    
    // Verifica se o clique ocorreu em um ícone de ação
    if (target.classList.contains("delete_room_btn")) {
        deleteRoom(id);
    } else if (target.classList.contains("edit_room_btn")) {
      
        add_edit_room_form.setAttribute("data-edit-mode", "true");
        add_edit_room_form.setAttribute("roomId", id);
        setEditRoomFormData(id);
        toggleNewRoomForm();
    } 
}


function deleteRoom (roomId) {
    const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector(".delete_room_form")
    confirmation_form.style.display = "flex";

   
    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";

    })
        
    confirm_btn.addEventListener("click", (e) => {
const apiUrl = `http://${ip}:4242/api/room/${roomId}`;

fetch(apiUrl, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log('Room deleted successfully');
  confirmation_form.style.display = "none";
  getAllRooms ();


  })
  .catch(error => {
    console.error('Error during room deletion:', error);
  });

    })
}


function setEditRoomFormData(id) {
    document.querySelector("#add_new_room_button").textContent= "Update Room";
    document.querySelector("#title_add_edit_room_form").textContent= "Edit Room";
    
    const url = `http://${ip}:4242/api/room/${id}`;
    
  
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            return response.json();
        })
        .then(room => {
            console.log(room);
            document.querySelector("#new_room_name").value = room.roomName;
     
            document.querySelector("#new_room_security_level").value = room.access_level_required;
            
          
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });

     
  }



  const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    //limpar user
    localStorage.removeItem("user");
    window.location.href = "../HTML/login.html";

});