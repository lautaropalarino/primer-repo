const http = require("http")
const fs = require("fs")
const path = require("path")
const form = require("querystring")
const loki = require("lokijs")

let noticias = null;
const db = new loki("noticias.json",{
    autoload: true,
    autosave: true, 
    autosaveInterval: 4000,
    autoloadCallback : function(){
    	noticias = db.getCollection("noticias")//<-- Intentar leer noticias del JSON
    	console.log("Anda")
    	if( noticias === null){//<-- Si "NO" pudo leerlas, es porque no existen...
    		noticias=db.addCollection("noticias")//<--... entonces "crear" las nuevas
    }
    console.log(noticias)
	}
})






http.createServer(function(request, response){
	console.log("Servidor Node.js en marcha...")
	const dir = "public/"//<-- Definir el directorio de los archivos web
	//const url = request.url//<-- Leer la ruta/recurso solicitado en la URL
	
	/*if( request.url == "/" ){
		const file = "index.html"
	} else {
		const file = request.url
	}*/

	//const file = (CONDICION) ? VERDADER0 : FALSO //<-- Operador Ternario
	const file = (request.url =="/") ? "index.html" : request.url

	if( file == "/enviar" ){
		console.log("Este es el body de la peticion HTTP")
		request.on("data", function(body){
			let datos = body.toString()

			noticias.insert(form.parse(datos))
		})
		response.end("Mira la consola de Git Bash")
	}


	let ext = path.extname(file)
		ext = String(ext)
		ext = ext.toLowerCase() 

	let tipos = {
			".html"	: "text/html",
			".js"	: "text/javascript",
			".css"	: "text/css",
			".txt" 	: "text/plain",
			".json"	: "application/json",
			".png"	: "image/png",
			".jpg"	: "image/jpg",
			".gif"	: "image/gif",
			".ico"	: "image/x-icon",
			".wav"	: "audio/wav",
			".mp4"	: "video/mp4",
			".woff"	: "application/font-woff",
			".ttf"	: "application/font-ttf",
			".eot"	: "application/vnd.ms-fontobject",
			".otf"	: "application/font-otf",
			".svg"	: "application/image/svg+xml"
	}
	let contentType = tipos[ext] || "application/octet-stream"

	console.log("Usted ha pedido el archivo: " + file)
	console.log("La extension del archivo es: " + ext)

	fs.readFile(dir + file, function(error, content){ //<-- "Intentar" leer/cargar el archivo/recurso solicitado
			if(error == true){//<-- Si no pudo leer el archivo por x razon...
				response.end("ARCHIVO NO ENCONTRADO :(")
			} else {//<-- Si efectivamente pudo leerlo...
				response.writeHead(200, {"Content-Type": contentType}) //<-- Especificar codigo de respuesta y tipo de contenido... 
				response.end(content) //Enviar al cliente/navegador el archivo encontrado
			}
	})
}).listen(process.env.PORT||80)

/*127.0.0.1 llamado a servidor local
80 puerto default en donde hace el llamado*/