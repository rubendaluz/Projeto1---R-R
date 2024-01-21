
// ****************************************************************************************************
// Declaracoes de variaveis globais
// ****************************************************************************************************
const adminsTableBody = document.getElementById("admins_table_body");
const admins_container = document.querySelector(".admins_container");
const open_new_admin_form_button = document.querySelector("#create_admin_button");
const add_edit_admin_form = document.querySelector(".new_admin_form");
const new_admin_form_close_button = document.querySelector("#new_admin_form_close_button");
const add_new_admin_button = document.querySelector("#add_new_admin_button");
const ip = "192.168.170.94"




// ****************************************************************************************************
// Event Listeners
// ****************************************************************************************************
document.addEventListener("DOMContentLoaded", (e) => {
    getAllAdmins()    

    var currentPage = window.location.pathname.split('/').pop();

    document.querySelectorAll('.menu_buttons').forEach(function(button) {
        var buttonHref = button.querySelector('a').getAttribute('href');
        
        if (currentPage === buttonHref) {
            button.classList.add('active');
        }
    });
})
adminsTableBody.addEventListener("click", handleAdminClick);
open_new_admin_form_button.addEventListener("click", toggleNewAdminForm);
new_admin_form_close_button.addEventListener("click", toggleNewAdminForm);
add_new_admin_button.addEventListener("click", add_or_edit_admin);








// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Funcoes 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function add_or_edit_admin() {
  
    const admin_username = document.querySelector("#new_admin_username").value;
    const admin_type = document.querySelector("#new_admin_type").value;
    const password = gerarSenhaForte();
 
    // Check if you are in edit mode or add mode
    const isEditMode = add_edit_admin_form.getAttribute("data-edit-mode") === "true";
    adminId = add_edit_admin_form.getAttribute("adminId");
    // Build data object
    const data = {
        username: admin_username,
        type: admin_type,
        active: true,
        password: password
    };

    // URL for API endpoint
    const url = isEditMode ? `http://${ip}:4242/api/admin/${adminId}` : `http://${ip}:4242/api/admin/register/`;

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
            toggleNewAdminForm();
           
        })
        .catch(error => {
            console.error(error);
        });

    // Additional code for updating the table, closing the form, etc.
}


function handleAdminClick(event) {
    const target = event.target;
    
    const clickedRow = event.target.closest('tr');

    const id = clickedRow.querySelector('td:nth-child(1)').textContent;
    
    // Verifica se o clique ocorreu em um ícone de ação
    if (target.classList.contains("delete_admin_btn")) {
        deleteAdmin(id);
    } else if (target.classList.contains("edit_admin_btn")) {
      
        add_edit_admin_form.setAttribute("data-edit-mode", "true");
        add_edit_admin_form.setAttribute("adminId", id);
        setEditAdminFormData(id);
        toggleNewAdminForm();
    } else {
        window.location.href = `../HTML/admin_details.html?id=${id}`;
    }
}

let add_admin_to_table = (id,username,type) => {
    const table_body = document.querySelector("#admins_table_body");
    

    table_body.innerHTML += `
        <tr>
           
            <td>${id}</td>
            
            <td>${username}</td>
            <td>${type}</td>
            
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit edit_admin_btn"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt delete_admin_btn"></i></a>
            </td>
        </tr>
    `
}

let getAllAdmins = () => {


    const url = `http://${ip}:4242/api/admin/`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(admins => {
        console.log(admins);
        admins.forEach(admin => {
            add_admin_to_table(admin["id"], admin["username"], admin["type"]);
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}

function deleteAdmin (adminId) {
    const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector(".delete_admin_form")
    confirmation_form.style.display = "flex";

   
    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";

    })
        
    confirm_btn.addEventListener("click", (e) => {
const apiUrl = `http://${ip}:4242/api/admin/${adminId}`;

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
    console.log('Admin deleted successfully');
  confirmation_form.style.display = "none";

  })
  .catch(error => {
    console.error('Error during admin deletion:', error);
  });

    })
}

function setEditAdminFormData(id) {
    document.querySelector("#add_new_admin_button").textContent= "Update Admin";
    document.querySelector("#title_add_edit_admin_form").textContent= "Edit Admin";
    
    const url = `http://${ip}:4242/api/admin/${id}`;
    
  
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            return response.json();
        })
        .then(admin => {
            console.log(admin);
            document.querySelector("#new_admin_username").value = admin.username;
            document.querySelector("#new_admin_type").value = admin.type;           
          
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });

     
  }



  let generatePassword = () => {
    return Math.random().toString(36).slice(-8);
}


function toggleNewAdminForm  () {
        
        if (add_edit_admin_form.style.display == "none" ) {
            add_edit_admin_form.style.display = "block";
        } else {
            add_edit_admin_form.style.display = "none";
            clear_new_admin_form();
            add_edit_admin_form.setAttribute("data-edit-mode", "false");
        }
    }
    
    let clear_new_admin_form = () => { 
        document.getElementById('new_admin_username').value = '';
        document.getElementById('new_admin_type').value = '';
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
