
window.addEventListener("load", GET_Request);
window.addEventListener("load", cargar);

function cargar() {
  

    document.getElementById("modificar").addEventListener("click", modificarDatos);
    document.getElementById("eliminar").addEventListener("click", POST_Eliminar);
    document.getElementById("pop-up").addEventListener("mouseleave", ocultar);
    document.getElementById("day").addEventListener("click", uncheckNoche);
    document.getElementById("night").addEventListener("click", uncheckDia);
}


//#region  Modificar
function modificarDatos()
{
    var flag=0;
    if( document.getElementById("txtNombre").value.length < 6){
        alertarNombre();
        flag=1; 
    }

    if( document.getElementById("txtCuatrimestre").value.length < 1 || 
        document.getElementById("txtCuatrimestre").value.length > 4){
        alertarCuatrimestre();
        flag=1;
    }
    if(!(validarfecha())){
        alertarFecha();
        flag=1;    
    }
    if(bringRadio() == "Mañana" || bringRadio() == "Noche"){  
    }
    else{        
        alertarTurno();        
        flag=1;    
    }

    if (flag == 0)    {
        POST_Request();
    }
    else{
        console.log("Error En modificar");
    }
}

function modificarTabla(index) {
    document.getElementById("tbody").rows[index].cells[1].innerHTML = document.getElementById("txtNombre").value;
    document.getElementById("tbody").rows[index].cells[2].innerHTML = document.getElementById("txtCuatrimestre").value;
    document.getElementById("tbody").rows[index].cells[3].innerHTML = formatDateString(document.getElementById("date").value);
    document.getElementById("tbody").rows[index].cells[4].innerHTML = bringRadio();
}

function recibeJsonModificar() {
    for (let index = 0; index < document.getElementById("tbody").rows.length; index++) {
        if (document.getElementById("tbody").rows[index].cells[0].innerHTML == document.getElementById("id").value) {
            modificarTabla(index);
        }
    }
}

//#endregion

//#region Alerts

function alertarNombre(){
    document.getElementById("txtNombre").style.borderColor = "red";
}
function alertarCuatrimestre(){
    document.getElementById("txtCuatrimestre").style.borderColor = "red";
}
function alertarFecha(){
    document.getElementById("date").style.borderColor = "red";
}
function alertarTurno(){
    document.getElementById("day").style.borderColor = "red";
    document.getElementById("night").style.borderColor = "red";
}

function validarfecha(){
    var date = new Date(document.getElementById("date").value);
    var today = new Date ();
     if(date<= today)     {
         return false     }
         return true;
}

//#endregion

//#region Requests
function POST_Request() {
    document.getElementById("lockedScreen").hidden = false;
    ocultar();
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.open("POST", "http://localhost:3000/editar");
    peticionHttp.setRequestHeader("Content-Type", "application/json");
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState === 4 && peticionHttp.status === 200) {
            if(JSON.parse(peticionHttp.responseText).type == "ok")
            {

                recibeJsonModificar();
            }

            ocultarLoader();
        }
    };
    peticionHttp.send(formatJson());
}

function POST_Eliminar() {
    document.getElementById("lockedScreen").hidden = false;
    ocultar();
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.open("POST", "http://localhost:3000/eliminar");
    peticionHttp.setRequestHeader("Content-Type", "application/json");
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState === 4 && peticionHttp.status === 200) {
            console.log(JSON.parse(peticionHttp.responseText));
            eliminarPersona();
        }
        ocultarLoader();
    };
    peticionHttp.send(formatJson());
}

function GET_Request() {
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4) {
            if (peticionHttp.status == 200) {
                buildTable(JSON.parse(peticionHttp.responseText));
            }
        }
    }
    peticionHttp.open("GET", "http://localhost:3000/materias");
    peticionHttp.send();
}
//#endregion

//#region Funcionalidades1
function ocultar() {
    document.getElementById("day").checked = false;
    document.getElementById("night").checked = false;
    document.getElementById("pop-up").hidden = true;
    document.getElementById("txtNombre").style.borderColor = "black";
    document.getElementById("txtCuatrimestre").style.borderColor = "black";
    document.getElementById("date").style.borderColor = "black";
    document.getElementById("day").style.borderColor = "black";
    document.getElementById("night").style.borderColor = "black";
}

function ocultarLoader() {
    document.getElementById("lockedScreen").hidden = true;
}

function uncheckNoche(){
    document.getElementById("night").checked = false;
}
function uncheckDia(){
    document.getElementById("day").checked = false;
}

//#endregion


function buildTable(data) {
    var table = document.getElementById('tbody');
    for (var i = 0; i < data.length; i++) {
        var row = "<tr id='" + i + "' ondblclick='dblClickAction(" + i + ");'>";
        row += "<td>" + data[i].id + "</td>";
        row += "<td>" + data[i].nombre + "</td>  ";
        row += "<td>" + data[i].cuatrimestre + "</td>  ";
        row += "<td>" + data[i].fechaFinal + "</td>  ";
        row += "<td>" + data[i].turno + "</td>  ";
        row += "</tr>";
        table.innerHTML += row;
    }
}


function eliminarPersona() {
    tabla = document.getElementById("tbody");
    for (let index = 0; index < tabla.rows.length; index++) {

        if(tabla.rows[index].cells[0].innerHTML == document.getElementById("id").value)
        {
            id = tabla.rows[index].id;
            row = document.getElementById(id);
            row.parentElement.removeChild(row);
        }
    }
  
}


function dblClickAction(id) {

    document.getElementById("pop-up").hidden = false;
    cn0 = document.getElementById(id).cells[0].innerHTML;
    cn1 = document.getElementById(id).cells[1].innerHTML;
    cn2 = document.getElementById(id).cells[2].innerHTML;
    cn3 = document.getElementById(id).cells[3].innerHTML;
    cn4 = document.getElementById(id).cells[4].innerHTML;

    document.getElementById("id").value = cn0;
    document.getElementById("txtNombre").value = cn1;
    document.getElementById("txtCuatrimestre").value = cn2;
    document.getElementById("date").value = reformatDateString( cn3);
    if (cn4 == "Mañana") {
        document.getElementById("day").checked = true;
    }else {
        document.getElementById("night").checked = true;
    }
}

//#region Funcionalidades 2

function formatJson() {
    aux = new Materia(document.getElementById("id").value,
        document.getElementById("txtNombre").value,
        document.getElementById("txtCuatrimestre").value,
        formatDateString(document.getElementById("date").value),
        bringRadio());
    console.log(JSON.stringify(aux));
    return JSON.stringify(aux);
}

function bringRadio() {

    if (document.getElementById("day").checked == true){
        return "Mañana";
    }
    return"Noche";
    
}

function reformatDateString(d) {
    var r = d.split(/\D/);
    return r.reverse().join('-');
}

function formatDateString(d) {
    
    var r = d.split(/\D/);
    return r.reverse().join('/');
}
 //#endregion

//#region Clase Aux
class Materia {
    id;
    nombre;
    apellido;
    fecha;
    sexo;

    constructor(i, n, c, f, t) {
        this.id = i;
        this.nombre = n;
        this.cuatrimestre = c;
        this.fechaFinal = f;
        this.turno = t;

    }
}
//#endregion