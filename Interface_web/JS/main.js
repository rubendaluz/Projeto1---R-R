
// *******************************************************
// Declaracoes de variaveis globais
// *******************************************************

// Variaveis para os Users
const usersTableBody = document.getElementById("users_table_body");
const li_users = document.querySelector("#li_users");
const users_container = document.querySelector(".users_container");
const open_new_user_form_button = document.querySelector("#create_user_button");
const new_user_form = document.querySelector(".new_user_form");
const new_user_form_close_button = document.querySelector("#new_user_form_close_button");
const add_new_user_button = document.querySelector("#add_new_user_button");
const edit_user_form = document.querySelector(".new_user_form");

// Variaveis para os Rooms
const li_rooms = document.querySelector("#li_rooms");
const rooms_container = document.querySelector(".rooms_container");
const new_room_form_close_button = document.querySelector("#new_room_form_close_button");



// Variaveis para os Admins
const admins_container = document.querySelector(".admins_container");
const li_admins = document.querySelector("#li_admins");


// Variaveis para os Accesses
const accesses_container = document.querySelector(".accesses_container");
const li_accesses = document.querySelector("#li_accesses");
const acesses_table = document.querySelector("#accesses_table_body");





// Funcoes


// FunçõEs para editar os Users


// FunçõEs para editar os Rooms




























document.addEventListener("DOMContentLoaded", (e) => {
    getAllUsers() 
    getAllRooms()
    getAllRecentAccesses()
   
})


















function handleUserClick(event) {
    const target = event.target;
    
    const clickedRow = event.target.closest('tr');

    const id = clickedRow.querySelector('td:nth-child(1)').textContent;
    
    // Verifica se o clique ocorreu em um ícone de ação
    if (target.classList.contains("delete_user_btn")) {
        deleteUser(id);
    } else if (target.classList.contains("edit_user_btn")) {
        const new_user_form = document.querySelector(".new_user_form");
        new_user_form.setAttribute("data-edit-mode", "true");
        new_user_form.setAttribute("userId", id);
        setEditFormData(id);
        new_user_form.style.display = "block";
    } else {
        window.location.href = `../HTML/user_details.html?id=${id}`;
    }
}
let generatePassword = () => {
    return Math.random().toString(36).slice(-8);
}

let add_user_to_table = (id, profilePic,firstName,lastName,email,phone,accessLevel) => {
    const table_body = document.querySelector("#users_table_body");
    const name = firstName + " " + lastName;

    table_body.innerHTML += `
        <tr>
           
            <td>${id}</td>
            <td class="profile_pic">
            <img src="${profilePic}"
                                 alt="profile_pic">
                                 </td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${accessLevel}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit edit_user_btn"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt delete_user_btn"></i></a>
            </td>
        </tr>
    `
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
                <a href="#" title="Delete"><i class="fas fa-trash-alt delete_room_button"></i></a>
            </td>
        </tr>
    `
}

let add_access_table = (id, user_id, room_id, datetime, allowed, method) => {
    let allow;
    let color;
    if (allowed) {
        allow = "Allowed";
        color = "green"
    } else {
        allow = "Not Allowed"
        color = "red"
    }
    acesses_table.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${user_id}</td>
            <td>${room_id}</td>
            <td>${datetime}</td>
            <td style="background-color: ${color}; 
                color:white;">${allow}</td>
            <td>${method}</td>
        </tr>
    `
}

let getAllUsers = () => {


    const url = 'http://localhost:4242/api/user/';

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(users => {
        console.log(users);
        users.forEach(user => {
            add_user_to_table(user["id"],"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", user["firstName"], user["lastName"], user["email"], user["phone"], user["accessLevel"]);
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
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



// Event Listeners
usersTableBody.addEventListener("click", handleUserClick);

    
let getAllRecentAccesses = () => {
    const url = 'http://localhost:4242/api/acesses/';

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(accesses => {
        console.log(accesses);
        accesses.forEach(access => {
            add_access_table(access["id"],access["id_user"],access["id_area"],formatarData(access["data_hora_entrada"]), access["acesso_permitido"], access["metodo_auth"])
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}

function gerarSenhaForte() {
  // Definir os caracteres permitidos na senha
  const caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let senha = "";
    let comprimento = 12;
  
  // Gerar a senha com base no comprimento fornecido
  for (let i = 0; i < comprimento; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
    senha += caracteresPermitidos.charAt(indiceAleatorio);
  }

  return senha;
}


function formatarData(dataOriginal) { 

// Criar um objeto Date a partir da string original
const data = new Date(dataOriginal);

// Obter os componentes da data
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Adicionar 1 porque os meses começam do zero
    const ano = data.getFullYear();
    const horas = data.getHours();
    const minutos = data.getMinutes();

    // Formatar os componentes da data e hora como desejado
    const dataFormatada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${ano}`;
    const horaFormatada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;

    // Resultado final
    const resultadoFinal = `${dataFormatada}/${horaFormatada}`;
    return resultadoFinal
}




function deleteUser (userId) {
    const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector(".delete_user_form")
    confirmation_form.style.display = "flex";

   
    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";

    })
        
    confirm_btn.addEventListener("click", (e) => {
const apiUrl = `http://localhost:4242/api/user/${userId}`;

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
    console.log('User deleted successfully');
  confirmation_form.style.display = "none";

  })
  .catch(error => {
    console.error('Error during user deletion:', error);
  });

    })
}

function setEditFormData(id) {
    document.querySelector("#add_new_user_button").textContent= "Update User";
    document.querySelector("#title_add_edit_form").textContent= "Edit User";
    
    const url = `http://localhost:4242/api/user/${id}`;
    
  
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            return response.json();
        })
        .then(user => {
            console.log(user);
            document.querySelector("#new_user_first_name").value = user.firstName;
            document.querySelector("#new_user_last_name").value = user.lastName;
            document.querySelector("#new_user_phone_number").value = user.phone;
            document.querySelector("#new_user_email").value = user.email;
            document.querySelector("#new_user_permission_level").value = user.accessLevel;
            
          
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

function toggleNewRoomForm() {
    const newRoomForm = document.querySelector(".new_room_form");
    const isFormVisible = window.getComputedStyle(newRoomForm).display !== "none";
    newRoomForm.style.display = isFormVisible ? "none" : "block";
}


function add_new_room ()  {

    const room_name = document.querySelector("#new_room_name").value;
    const room_security_level = document.querySelector("#new_room_security_level").value;
    
    if (!room_name) {
        console.log("Sem username");
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
        
        close_new_room_form();

        // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
    }  
}


