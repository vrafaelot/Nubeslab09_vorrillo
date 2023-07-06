// Configurar las credenciales de AWS SDK
AWS.config.update({
  accessKeyId: 'AKIAVCYQDEOVEEAXGR5G',
  secretAccessKey: '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',
  region: 'us-east-2'
});

// Crear una instancia del servicio S3
const s3 = new AWS.S3();

// Arreglo para almacenar los registros
let registros = [];

// Referencias a los elementos HTML
const formulario = document.getElementById('formulario');
const tabla = document.getElementById('tabla');

// Función para subir una imagen al bucket de S3
async function subirImagen(file) {
  const params = {
    Bucket: 'lab09-nubes',
    Key: file.name,
    Body: file,
    ACL: 'public-read'
  };
  
  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

// Función para agregar un nuevo registro
formulario.addEventListener('submit', async function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const imagen = document.getElementById('imagen').files[0];
  
  const imagenURL = await subirImagen(imagen);
  
  const nuevoRegistro = {
    nombre: nombre,
    imagen: imagenURL
  };
  
  registros.push(nuevoRegistro);
  mostrarRegistros();
  
  formulario.reset();
});

// Función para eliminar un registro
function eliminarRegistro(index) {
  registros.splice(index, 1);
  mostrarRegistros();
}

// Función para mostrar los registros en la tabla
function mostrarRegistros() {
  // Limpiar la tabla
  tabla.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>Imagen</th>
      <th>Acciones</th>
    </tr>
  `;
  
  // Agregar cada registro a la tabla
  registros.forEach(function(registro, index) {
    const row = tabla.insertRow();
    
    const cellNombre = row.insertCell();
    cellNombre.innerHTML = registro.nombre;
    
    const cellImagen = row.insertCell();
    const imagen = document.createElement('img');
    imagen.src = registro.imagen;
    imagen.width = 100;
    cellImagen.appendChild(imagen);
    const cellAcciones = row.insertCell();
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn');
    btnEliminar.addEventListener('click', function() {
      eliminarRegistro(index);
    });
    cellAcciones.appendChild(btnEliminar);
  });
}
// Mostrar los registros al cargar la página
mostrarRegistros();