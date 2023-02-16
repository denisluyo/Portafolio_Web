  // Función para alternar entre los tabs
  function switchTab(index) {
    // Obtener los botones de los tabs y el contenido de los tabs
    var tabButtons = document.querySelectorAll(".tab");
    var tabContents = document.querySelectorAll(".tab-content");
    
    // Remover la clase "active" de todos los botones y contenidos de los tabs
    for (var i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active");
      tabContents[i].classList.remove("activo");
    }
    
    // Agregar la clase "active" al botón y al contenido del tab seleccionado
    tabButtons[index].classList.add("active");
    tabContents[index].classList.add("activo");
  }


  // window.addEventListener("load", function() {
  //   var container = document.querySelector('#container');
  //   var leftButton = document.querySelector('#left-button');
  //   var rightButton = document.querySelector('#right-button');

  //   leftButton.addEventListener('click', function() {
  //     container.scrollLeft -= 200;
  //   });

  //   rightButton.addEventListener('click', function() {
  //     container.scrollLeft += 200;
  //   });
  // });