let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

// Store the last visited page
function saveLastPage(page){
    sessionStorage.setItem("Ultima Pagina", page)
}

// Get the last page from session storage
function getLastPage(){
    return sessionStorage.getItem("Ultima Pagina")
}

btnSiguiente.addEventListener('click', () => {
	if(pagina < 1000){
		pagina += 1;
		cargarPeliculas();
	}
    saveLastPage(pagina)
});

btnAnterior.addEventListener('click', () => {
	if(pagina > 1){
		pagina -= 1;
		cargarPeliculas();
        saveLastPage(pagina)
	}
});

const cargarPeliculas = async() => {
	try {
        const key = "66bb0deca6fdc22860dc8e63eaac4c87"
		const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=es-MX&page=${pagina}`);
	
		console.log(respuesta);

		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
			
			let peliculas = '';
			datos.results.forEach(pelicula => {
				peliculas += `
					<div class="pelicula">
						<img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
						<h3 class="titulo">${pelicula.title}</h3>
					</div>
				`;
			});

			document.getElementById('contenedor').innerHTML = peliculas;

		} else if(respuesta.status === 401){
			console.log('Pusiste la llave mal');
		} else if(respuesta.status === 404){
			console.log('La pelicula que buscas no existe');
		} else {
			console.log('Hubo un error y no sabemos que paso');
		}

	} catch(error){
		console.log(error);
	}

}

cargarPeliculas();


// Open the data base connection
const request = window.indexedDB.open("UserDB", 1)

// Set the data base structure
request.onupgradeneeded = (e) => {
    const db = e.target.result;

    // Create a storage of objects named "users"
    const usersStore = db.createObjectStore("Users", { keyPath: "id", autoIncrement: true});

    // Create index to search email
    usersStore.createIndex("email", "email", { unique: true});
}

// Manage open connection exit
request.onsucces = (e) => {
    const db = e.target.result;

    // Function to add the user to the data base
    function addUser(name, email){
        const trans = db.transaction(["Users"], "readwrite");
        const usuariosStore = transaction.objectStore("Users")

        // Add new user
        const newUser = {name: name, email: email};
        const addRequest = usersStore.add(newUser)
        
        addRequest.onsucces = () => {
            console.log("Usuario agregado correctamente")
        }
    }

    // Function to get all the users from the data base
    function getAllUsers(){
        const trans = db.transaction(["Users"], "readonly");
        const usersStore = transaction.objectStore("Users");

        // Get alla the users
        const getRequest = usersStore.getAll();

        getRequest.onsucces = () => {
            console.log("Todos los usuarios: " + getRequest.result)
        };
    }

    // Examples
    addUser("Nicolas", "Nicolas@gmail.com")
    addUser("Maria", "Maria@gmail.com")
    getAllUsers();
}
