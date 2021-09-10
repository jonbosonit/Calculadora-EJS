// cargar express
var express = require('express');
var app = express();

// crear lo que vamos a necesitar
var tiempo = 0;
const datos = [];
const datosId = [];
const ids = new Map();
const valor = new Map();

// set the view engine to ejs
app.set('view engine', 'ejs');

//Middleware -> Metodos/funciones/operaciones que se llaman entre el procesamiento del request y mandar el response
//Estos dos solo son necesarios para POST y PUT
app.use(express.urlencoded({extended: true})) //Para que reconozca el objeto que viene como string o array
app.use(express.json()) //Para que reconozca el objeto que viene como JSON

// use res.render to load up an ejs view file

// Pagina del formulario
app.get('/', function(req, res) {
    res.render('pages/formulario',{
        id: req.query.id || "" //Cuando volvemos a la calculadora necesitamos el id. req.body para POST/PUT y para GET usar req.query
    });
});

app.post('/accion', (req,res) => {
    
    const accion=req.body.accion; //Asignamos los valores del body a nuestras variables.

    const numero=parseFloat(req.body.numero);
    const id=req.body.id;
    ids.set(id,new Date()); //Metemos en el mapa una fecha para ese id (cuando el id se ha creado)

    var valorLocal=valor.get(id) //NaN es Not-a-Number
    if(isNaN(valorLocal)){
        console.log("No existía valor local para ese id. Por defecto será 0.")
        valorLocal=0;
    }
   
    
    datos.push({id: id, accion: accion, numero: numero, fecha: new Date()})
    switch(accion){
        case "+": {
            console.log("Sumando")
            valorLocal+=numero;
            break;
        }
        case "-": {
            console.log("Restando")
            valorLocal-=numero;
            break;
        }
        case "*": {
            console.log("Multiplicando")
            valorLocal*=numero;
            break;
        }
        case "/": {
            console.log("Dividiendo")
            if(numero==0){
                res.render('pages/divide0')
                return;
            }
            valorLocal/=numero;
            break;
        }
        case "R": {
            console.log("Reseteando")
            valorLocal=0;
            
            break;
        }
    }
    valor.set(id,valorLocal) //Para un id solo permite tener un valor, por lo que reemplaza el valor anterior
    var resultado = valorLocal;
    console.log(datos)
    
    Array.prototype.findByValueOfObject = function(key, value){
        return this.filter(function(item){
            return (item[key] === value)
        })
    }
    var dato = (JSON.stringify(datos.findByValueOfObject("id",req.body.id),0,4))
    console.log(dato)
    res.render('pages/accion',{
        id,
        accion,
        numero,
        dato,
        resultado,
    })
})

// about page (sin utilidad)
app.get('/about', function(req, res) {
    res.render('pages/about');
});


app.listen(8080, () => {
    console.log('Escuchando en 8080...');
    setInterval(incrementaTiempo, 60*1000)
});

function incrementaTiempo(){
    tiempo++;
    /* console.log(tiempo) */
}

function Resetear(){
    accion = 'R'
    return;
}


