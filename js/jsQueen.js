"Use strict";
document.addEventListener('DOMContentLoaded', function(){
  /*precarga();
  precarga2();
  precarga3();
  precarga4();*/
  agregarDatos();
});
let img = document.getElementById('galeriaImg');
let contadorImg2 = 0;
let contadorFila = 0;
let btnAgregarDato = document.getElementById('btnEnviarFormTabla');
let btnItems = document.getElementById('btnItems');
let btnVaciar = document.getElementById('btnVaciarTabla');
let container = document.getElementById('contenedorParaAjax');
let inicioNav = document.getElementById('js-navInicio');
let suscripcionNav = document.getElementById('js-navSuscripcion');
let biografiaNav = document.getElementById('js-navBiografias');
let tiendaNav = document.getElementById('js-navTienda');
let albumesNav = document.getElementById('js-navAlbums');


/*PRECARGA de DATOS*/
let datosPreCargadosUno = {
   "thing":[
           
            {   "lugar": "Mar del Plata",
               "fecha": 21 +" de Abril",
           },
        ]
}

let datosPreCargadosDos ={
    "thing": [
        {
            "lugar": "La Plata",
            "fecha": 26 + " de Abril",
        },
    ]
}

let datosPreCargadosTres = {
    "thing" : [
        {
            "lugar": "Rosario",
            "fecha": 28 + " de Mayo",
        },
    ]
}
   
let datosPreCargadosCuatro = {
    "thing" : [
        {
            "lugar": "Cordoba",
            "fecha": 30 + " de Mayo",
        },
    ]
}        
function precarga(){
   fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
       method : "POST",
       headers : {
           'Content-Type' : 'application/json'
       },
       body : JSON.stringify(datosPreCargadosUno)
   })
}

function precarga2(){
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(datosPreCargadosDos)
    })
}

function precarga3(){
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(datosPreCargadosTres)
    })
}

function precarga4(){
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(datosPreCargadosCuatro)
    })
}



/*FORM SUMA DATOS TABLA */
let datosNuevos = {
    "thing" : [
    ]
}
btnAgregarDato.addEventListener('click', sumarDatos);
function sumarDatos(){
    let lugarUsu = document.getElementById('inputFormGiraTablePais').value;
    let fechaUsu = document.getElementById('inputFormGiraTableFecha').value;
    if((lugarUsu != "")&&(fechaUsu != "")){
        datosNuevos.thing.push({"lugar": lugarUsu, "fecha": fechaUsu });
        fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(datosNuevos)
        }).then(
            function(){
                agregarDatos()
            }
        ).then(
            function(){
                datosNuevos.thing.splice(0, datosNuevos.thing.length)
            }   
        )
    }else{
        agregarDatos();
    }
}


/*AGREGAMOS DATOS A LA TABLA*/
async function agregarDatos(){
   let tbodyTabla = document.getElementById('tablaTBody');
   while (tbodyTabla.hasChildNodes()) {  
   tbodyTabla.removeChild(tbodyTabla.firstChild);
   contadorFila = 0;
   }
   try{
       let response = await fetch('http://web-unicen.herokuapp.com/api/groups/09/gira');
       if(response.ok){
           let datos = await response.json();
                for(let i = 0; i < datos.gira.length; i++){
                    contadorFila++;

                    let tr = document.createElement("TR");
                    let td1 = document.createElement("TD");
                    let td2 = document.createElement("TD");
                    let td3 = document.createElement("TD");

                    let btnDeleteFila = document.createElement("BUTTON");
                    let valueBtnFila = document.createAttribute("value");
                    valueBtnFila.value = datos.gira[i]._id;
                    btnDeleteFila.setAttributeNode(valueBtnFila);

                    let text1 = document.createTextNode(datos.gira[i].thing[0].lugar);
                    let text2 = document.createTextNode(datos.gira[i].thing[0].fecha);
                    let textBtn = document.createTextNode("Eliminar");   
                    let valueTdFecha = document.createAttribute("value");
                    valueTdFecha.value = datos.gira[i].thing[0].fecha;
                    btnDeleteFila.appendChild(textBtn);
                    td1.appendChild(text1);
                    td2.appendChild(text2);
                    td2.setAttributeNode(valueTdFecha);
                    td3.appendChild(btnDeleteFila);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tbodyTabla.appendChild(tr);
                    btnDeleteFila.addEventListener('click', eliminarDatoEspecifico);
                   
                }      
        }else{
            tbodyTabla.innerHTML = '<h1> URL no encontrada </h1>'
        }
    }catch(response){
       tbodyTabla.innerHTML = '<h1> ERROR - Falló conexión </h1>';
    }
} 


/*ELIMINAR DATO MEDIANTE BOTON */
function eliminarDatoEspecifico(){
    let btnClikeado = this.value;
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira').then(
        function(response){
            if(response.ok){
                response.json().then(
                    function(e){
                        for(let r = 0; r < e.gira.length; r++){
                            if((e.gira[r]._id) == (btnClikeado)){
                                fetch('http://web-unicen.herokuapp.com/api/groups/09/gira/'+e.gira[r]._id , {
                                    method : "DELETE"
                                }).then(
                                    function(){
                                        agregarDatos();
                                    }
                                )
                            }
                        }
                    }
                )
            }
        }
    )

}

/*FILTRO*/
let btnBusca = document.getElementById('buscar');
btnBusca.addEventListener('click', buscar);
function buscar(){
    let tbodyTabla = document.getElementById('tablaTBody').childNodes;
    let opSeleccionada = document.getElementById('selectOpciones').value;
    for(let g = 0; g < tbodyTabla.length; g++){
       let cadenaAComparar = tbodyTabla[g].childNodes[1];
       //let cadenaAComparar = tbodyTabla[g].childNodes[1].value;
       if((cadenaAComparar.endsWith(opSeleccionada))){
            console.log("Si");
       }
    }
}
/*FILTRO DE JOR*/
/*
let busqueda= document.getElementById('buscar')
busqueda.addEventListener('click',hacerBusqueda);
function IniciarBusqueda() {
    
    for (let i =0 ; i <= 12; i++) {
        celdas = registroTabla.rows[i].getElementsByTagName('td');
        encontrado = false;
  
           
            if (buscarMes.length == 0 || (comparaCon.indexOf(buscarMes) > -1)) {
                encontrado = true;
            }
        }
        if (encontrado) {
          registroTabla.rows[i].classList.remove('js-ocultar');
           registroTabla.rows[i].classList.add('js-mostrar');
        } else{
          registroTabla.rows[i].classList.remove('js-mostrar');
          registroTabla.rows[i].classList.add('js-ocultar');
        }
    }
  }
 */

/*ITEMS*/
btnItems.addEventListener('click', cargarItems);
function cargarItems(){
    let item = {
        "thing" : [
            {
                "lugar" : "PROXIMAMENTE",
                "fecha" : "PROXIMAMENTE",
            }
        ]
    }
    let item2 = {
        "thing" : [
            {
                "lugar" : "PROXIMAMENTE",
                "fecha" : "PROXIMAMENTE",
            }
        ]
    }
    let item3 = {
        "thing" : [
            {
                "lugar" : "PROXIMAMENTE",
                "fecha" : "PROXIMAMENTE",
            }
        ]
    }
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(item)
    })
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(item2)
    })
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira', {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(item3)
    }).then(
        function(){
            agregarDatos()
        }
    )
    
}

/*VACIAR TABLA */
btnVaciar.addEventListener('click', vaciarTabla);
function vaciarTabla(){
    fetch('http://web-unicen.herokuapp.com/api/groups/09/gira/5d156e32c9c94a000497cdea', {
        method : "DELETE"
    }).then(
       function(){
            let tbodyTabla = document.getElementById('tablaTBody')
            while(tbodyTabla.hasChildNodes()){  
                tbodyTabla.removeChild(tbodyTabla.firstChild);
            }
            while(contadorFila >= 0){
                console.log(contadorFila);
                let tr = document.createElement("TR");
                let td1 = document.createElement("TD");
                let td2 = document.createElement("TD");
                let td3 = document.createElement("TD");
                let text1 = document.createTextNode("");
                let text2 = document.createTextNode("");
                let text3 = document.createTextNode("");
                td1.appendChild(text1);
                td2.appendChild(text2);
                td3.appendChild(text3);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tbodyTabla.appendChild(tr);    
                contadorFila--;   
        }    
      }
    )
}

/*GALERIA*/
//esto si puede ir con jquery porque no pertenece a la tabla rest
$('body').on('click', '#btnGaleriaSiguiente', function(){
    if( contadorImg2 <= 3){
        contadorImg2++;
        let img = document.getElementById('galeriaImg');
        img.src = "CSS/Img/galeria"+contadorImg2+".jpg";
    }
});

$('body').on('click', '#btnGaleriaAtras', function(){
    if(contadorImg2 >= 2){
        contadorImg2--;
        let img = document.getElementById('galeriaImg');
        img.src = "CSS/Img/galeria"+contadorImg2+".jpg";
    }
});


/*PARTIAL RENDER*/
inicioNav.addEventListener('click', loadInicio);
function loadInicio(event){
    event.preventDefault();   
    fetch('../09-Sofia Marzari-Jorgelina Aparicio/inicio.html').then(
        function(response){
            if(response.ok){
                response.text().then(
                    function(text){
                        container.innerHTML = text
                        document.getElementById('btnEnviarFormTabla').addEventListener('click', sumarDatos)
                        document.getElementById('btnItems').addEventListener('click', cargarItems);
                        document.getElementById('btnVaciarTabla').addEventListener('click', vaciarTabla);
                        agregarDatos()
                    })                 
            }else{
                container.innerHTML = '<h1>Error- URL no encontrada!</h1>';
            }
        }
    ).catch(function(response){
        container.innerHTML = '<h1>Error- Conexión fallida</h1>';
    })
  
}


suscripcionNav.addEventListener('click', loadSuscripcion);
function loadSuscripcion(event2){
   event2.preventDefault();
   fetch('../09-Sofia Marzari-Jorgelina Aparicio/suscripcion.html').then(
       function(response){
           if(response.ok){
               response.text().then(
                   function(u){
                       container.innerHTML = u;
                   }
               )
            }else{
               container.innerHTML = '<h1>Error- URL no encontrada!</h1>';
            } 
       }).catch(function(response){
           container.innerHTML = '<h1>Error- Conexión fallida</h1>';
       })
}


biografiaNav.addEventListener('click', loadBiografias);
function loadBiografias(event3){
    event3.preventDefault();
    fetch('../09-Sofia Marzari-Jorgelina Aparicio/biografia.html').then(
        function(response){
            if(response.ok){
                response.text().then(
                    function(h){
                        container.innerHTML = h;
                    }
                )
            }else{
                container.innerHTML = '<h1>Error- URL no encontrada!</h1>';
            }
        }
    ).catch(function(response){
        container.innerHTML = '<h1>Error- Conexión fallida</h1>';
    })
}

tiendaNav.addEventListener('click', loadTienda);
function loadTienda(event4){
    event4.preventDefault();
    fetch('../09-Sofia Marzari-Jorgelina Aparicio/tienda.html').then(
        function(response){
            if(response.ok){
                response.text().then(
                    function(i){
                        container.innerHTML = i;
                    }
                )
            }else{
                container.innerHTML = '<h1>Error- URL no encontrada!</h1>';
            }
        }
    ).catch(function(response){
        container.innerHTML = '<h1>Error- Conexión fallida</h1>';
    })
}

albumesNav.addEventListener('click', loadAlbumes);
function loadAlbumes(event5){
    event5.preventDefault();
    fetch('../09-Sofia Marzari-Jorgelina Aparicio/albumes.html').then(
        function(response){
            if(response.ok){
                response.text().then(
                    function(j){
                        container.innerHTML = j;
                    }
                )
            }else{
                container.innerHTML = '<h1>Error- URL no encontrada!</h1>';
            }
        }
    ).catch(function(response){
        container.innerHTML = '<h1>Error- Conexión fallida</h1>';
    })
}
