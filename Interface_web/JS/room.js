
// *******************************************************
// Declaracoes de variaveis globais
// *******************************************************


// Variaveis para os Rooms
const li_rooms = document.querySelector("#li_rooms");
const rooms_container = document.querySelector(".rooms_container");
const new_room_form_close_button = document.querySelector("#new_room_form_close_button");
const roomsTableBody = document.getElementById("rooms_table_body");
const add_edit_room_form  = document.querySelector(".new_room_form");
const add_new_room_button = document.querySelector("#add_new_room_button");
add_new_room_button.addEventListener("click", add_or_edit_room);



// ****************************************************************************************************
// Event Listeners
// ****************************************************************************************************
document.addEventListener("DOMContentLoaded", (e) => {
    getAllRooms() ;   
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
    roomId = add_edit_room_form.getAttribute("roomId");

    // URL for API endpoint
    const url = isEditMode ? `http://localhost:4242/api/room/${roomId}` : "http://localhost:4242/api/room/";

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
    const url = 'http://localhost:4242/api/room/';

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
         
        return response.json(); // or response.text() if the response is not JSON
    })
    .then(rooms => {
        console.log(rooms);
        rooms.forEach(room => {
            add_room_to_table(room["id"],room["roomName"], room["access_level_required"]);
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}




function open_new_room_form ()  {
    console.log("click");
const new_room_form = document.querySelector(".new_room_form");    
        
        new_room_form.style.display = "block";
    console.log("click");

}


function add_new_room ()  {

    const room_name = document.querySelector("#new_room_name").value;
    const room_security_level = document.querySelector("#new_room_security_level").value;

    
    
    if (!room_name) {
        console.log("Sem roomname");
    } else if (!room_security_level) {
        console.log("Sem email para o utilizador");
    } else {
        const url = 'http://localhost:4242/api/room/';

        // Dados que você deseja enviar no corpo da solicitação
        const data = {
            roomName: room_name,
            access_level_required: room_security_level,
            description: "exemplo"
        };

        console.log(data);

        // Configuração da solicitação
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Tipo de conteúdo do corpo da solicitação
        },
            body: JSON.stringify(data) // Converte os dados em JSON
        };

        // Faz a solicitação usando o fetch
        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    return response.json(); // Se a resposta for bem-sucedida, analise a resposta JSON
                } else {
                    throw new Error('Falha na solicitação POST');
                }
        })
        .then(data => {
            console.log(data); // Faça algo com os dados de resposta
        })
        .catch(error => {
            console.error(error); // Trate erros de solicitação
        });
        console.log(room_name,room_security_level)
        add_room_to_table(0,room_name,room_security_level)
        
        toggleNewRoomForm();

        // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
    }  
}


function toggleNewRoomForm() {
    const isFormVisible = window.getComputedStyle(add_edit_room_form ).display !== "none";
    add_edit_room_form .style.display = isFormVisible ? "none" : "block";
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
    } else {
        window.location.href = `../HTML/room_details.html?id=${id}`;
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
const apiUrl = `http://localhost:4242/api/room/${roomId}`;

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

  })
  .catch(error => {
    console.error('Error during room deletion:', error);
  });

    })
}


function setEditRoomFormData(id) {
    document.querySelector("#add_new_room_button").textContent= "Update Room";
    document.querySelector("#title_add_edit_room_form").textContent= "Edit Room";
    
    const url = `http://localhost:4242/api/room/${id}`;
    
  
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