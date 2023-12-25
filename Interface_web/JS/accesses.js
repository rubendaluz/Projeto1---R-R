


document.addEventListener("DOMContentLoaded", (e) => {
    var currentPage = window.location.pathname.split('/').pop();

        document.querySelectorAll('.menu_buttons').forEach(function(button) {
            var buttonHref = button.querySelector('a').getAttribute('href');
            
            if (currentPage === buttonHref) {
                button.classList.add('active');
            }
        });
  
   
})













