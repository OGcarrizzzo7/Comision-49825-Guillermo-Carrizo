
document.addEventListener('DOMContentLoaded', () => {

    const baseDeDatos = [ 
        { id: 1, nombre: "TV SAMSUNG 4K", precio: 500000, imagen: './img/tele.jpg' },
        { id: 2, nombre: "NVIDIA RTX 4090", precio: 2500000, imagen: './img/rtx.jpg' },
        { id: 3, nombre: "Intel I9 14900K", precio: 1500000, imagen: './img/intel.jpg' },
        { id: 4, nombre: "AMD RYZEN 9 5950X", precio: 1500000, imagen: './img/ryzen.jpeg' },
        { id: 5, nombre: "LOGITECH G502 HERO", precio: 87000, imagen: './img/mouse.jpg' },
        { id: 6, nombre: "LOGITECH G635", precio: 157000, imagen: './img/auriculares.png' }
    ];


    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const Storage = window.localStorage;

    

    function armarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;


            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', agregarCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    function agregarCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        armarCarrito();
        guardarStorage();

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Producto agregado",
            showConfirmButton: false,
            timer: 1500
        });
    }

    function armarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} = ${divisa}${miItem[0].precio}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        
        DOMtotal.textContent = calcularTotal();
    }

    function borrarCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        armarCarrito();
        
        guardarStorage();

        Swal.fire({
            position: "center",
            icon: "error",
            title: "Producto eliminado",
            showConfirmButton: false,
            timer: 1500
        });
    }

    function calcularTotal() {
        
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        armarCarrito();
        localStorage.clear(); 

        Swal.fire({
            position: "center",
            icon: "error",
            title: "Carrito Vaciado",
            showConfirmButton: false,
            timer: 1500
        });
    }

    function guardarStorage() {
        Storage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoStorage() {
        if (Storage.getItem('carrito') != null) {
            carrito = JSON.parse(Storage.getItem('carrito'));
        }
    }

    
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    cargarCarritoStorage();
    
    armarProductos();
    armarCarrito();
});
