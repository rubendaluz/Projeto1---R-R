
document.addEventListener("DOMContentLoaded", (e) => {

    getAllUsers() 
    getAllRooms()


 const usersTableBody = document.querySelector("#users_table_body");
usersTableBody.addEventListener('click', handleUserClick);
usersTableBody.innerHTML = "";

const li_admins = document.querySelector("#li_admins");
const li_users = document.querySelector("#li_users");
const li_rooms = document.querySelector("#li_rooms");
const li_accesses = document.querySelector("#li_accesses");
const admins_container = document.querySelector(".admins_container");
const users_container = document.querySelector(".users_container");
const rooms_container = document.querySelector(".rooms_container");
const accesses_container = document.querySelector(".accesses_container");
const open_new_user_form_button = document.querySelector("#create_user_button");
const new_user_form = document.querySelector(".new_user_form");
const open_new_room_form_button = document.querySelector("#create_room_button");
const new_room_form = document.querySelector(".new_room_form");    

    
li_admins.addEventListener("click", (e) => {
    li_admins.classList.add("btnClicado")
    li_users.classList.remove("btnClicado")
    li_rooms.classList.remove("btnClicado")
    li_accesses.classList.remove("btnClicado")
    admins_container.style.display = "block"
    users_container.style.display = "none";
    accesses_container.style.display = "none";
    rooms_container.style.display = "none"
    new_room_form.style.display = "none"
});

li_users.addEventListener("click", (e) => {
    li_admins.classList.remove("btnClicado")
    li_users.classList.add("btnClicado")
    li_rooms.classList.remove("btnClicado")
    li_accesses.classList.remove("btnClicado")
    users_container.style.display = "block";
    accesses_container.style.display = "none";
    rooms_container.style.display = "none"
    admins_container.style.display = "none"
    new_room_form.style.display = "none"
});

li_rooms.addEventListener("click", (e) => {
    
    li_admins.classList.remove("btnClicado") 
    li_users.classList.remove("btnClicado")
    li_rooms.classList.add("btnClicado")
    li_accesses.classList.remove("btnClicado")
    users_container.style.display = "none"
    accesses_container.style.display = "none";
    rooms_container.style.display = "block"
    new_user_form.style.display = "none"
    admins_container.style.display = "none"
});

    li_accesses.addEventListener("click", (e) => {
    li_admins.classList.remove("btnClicado")
    li_users.classList.remove("btnClicado") 
    li_rooms.classList.remove("btnClicado")
    li_accesses.classList.add("btnClicado")
    users_container.style.display = "none";
    accesses_container.style.display = "block";
    rooms_container.style.display = "none"
    admins_container.style.display = "none"
});

open_new_user_form_button.addEventListener("click", () => {
    new_user_form.style.display = "block";
});

const new_user_form_close_button = document.querySelector("#new_user_form_close_button");

new_user_form_close_button.addEventListener("click", (e) => {      
    close_new_user_form();
});

let close_new_user_form = () => { 
    document.getElementById('new_user_first_name').value = '';
    document.getElementById('new_user_last_name').value = '';
    document.getElementById('new_user_email').value = '';
    document.getElementById('new_user_phone_number').value = '';
    document.getElementById('new_user_permission_level').value = '';
    new_user_form.style.display = "none";
}

const add_new_user_button = document.querySelector("#add_new_user_button");
const edit_user_form = document.querySelector(".new_user_form");

add_new_user_button.addEventListener("click", (e) => {
    e.preventDefault()
    const user_first_name = document.querySelector("#new_user_first_name").value;
    const user_last_name = document.querySelector("#new_user_last_name").value;
    const user_phone_number = document.querySelector("#new_user_phone_number").value;
    const user_email = document.querySelector("#new_user_email").value;
    const user_permission_level = document.querySelector("#new_user_permission_level").value;
    const password = gerarSenhaForte();
 
    // Check if you are in edit mode or add mode
    const isEditMode = edit_user_form.getAttribute("data-edit-mode") === "true";
    userId = edit_user_form.getAttribute("userId");
    // Build data object
    const data = {
        firstName: user_first_name,
        lastName: user_last_name,
        fingerPrint: null,
        nfcTag: null,
        email: user_email,
        phone: user_phone_number,
        accessLevel: user_permission_level,
        active: true,
        profilePic: null,
        password: password
    };

    // URL for API endpoint
    const url = isEditMode ? `http://localhost:4242/api/user/${userId}` : "http://localhost:4242/api/user/register/";

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
            close_new_user_form();
        })
        .catch(error => {
            console.error(error);
        });

    // Additional code for updating the table, closing the form, etc.
});



  


    // FunçõEs para editar os Rooms
   open_new_room_form_button.addEventListener("click", (e) => {
        e.preventDefault()
        new_room_form.style.display = "block";
    })

    const new_room_form_close_button = document.querySelector("#new_room_form_close_button");

    new_room_form_close_button.addEventListener("click", (e) => {      
        close_new_room_form();
    });

    let close_new_room_form = () => { 
        document.getElementById('new_room_name').value = '';
        document.getElementById('new_room_security_level').value = '';
        new_room_form.style.display = "none";
    }

    const add_new_room_button = document.querySelector("#add_new_room_button");

    add_new_room_button.addEventListener("click", (e) => {
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
    });

  
})

const handleUserClick = (event) => {
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
       
        window.location.href = `user_details.html?id=${id}`;
    }
    
};
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
    const table_body = document.querySelector("#rooms_table_body");

    table_body.innerHTML += `
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

    
    const url = `http://localhost:4242/api/user/${id}`;
  
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            return response.json();
        })
        .then(user => {
            // Preenche os detalhes do usuário na página

           document.querySelector("#new_user_first_name").value = user.firstName;
      document.querySelector("#new_user_last_name").value = user.lastName;
      document.querySelector("#new_user_phone_number").value = user.phone;
      document.querySelector("#new_user_email").value = user.email;
      document.querySelector("#new_user_permission_level").value = user.accessLevel;
          
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
      // Set the form data based on the user object
     
  }