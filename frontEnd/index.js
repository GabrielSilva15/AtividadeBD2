async function getEstados(){
   return await fetch('http://servicodados.ibge.gov.br/api/v1/localidades/estados').then(
        data => data.json());
}

async function getCidades(idEstado){
    return await fetch(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`).then(
         data => data.json());
 }

let selectEstados =document.querySelector('#estados');
let selectCidades = document.querySelector('#cidades');

estados();


selectEstados.addEventListener('change',async ()=>{
    selectCidades.innerHTML='';
    let optionDisabled = document.createElement('option');
    optionDisabled.innerHTML='Escolha uma cidade';
    optionDisabled.setAttribute('disabled','disabled');
    optionDisabled.setAttribute('selected','selected');
    selectCidades.appendChild(optionDisabled);
    let citys= await cidades();

    citys.forEach(cidade =>{
        
        let opt = document.createElement('option');
        opt.value = cidade.id;
        opt.innerHTML = cidade.nome;
        selectCidades.appendChild(opt)
        
    })
})

selectCidades.addEventListener('change',async ()=>{
    let estadoSelecionado = selectEstados.options[selectEstados.selectedIndex].text;
    let cidadeSelecionada = selectCidades.options[selectCidades.selectedIndex].text;

    let svgJson = await fetch(`http://localhost:3000/svg/${estadoSelecionado}/${cidadeSelecionada}`).then(data=>data.json());
    console.log(selectCidades.options[selectCidades.selectedIndex].value);

    let svg =document.querySelector('#svgGeral');
    let pathEstado = document.querySelector('#pathEstado');
    let pathCidade = document.querySelector('#pathCidade');
    
    svg.setAttribute('viewBox', svgJson.viewBox);
    pathCidade.setAttribute('d',svgJson.pathmunicipio);
    pathEstado.setAttribute('d',svgJson.pathestado);
    
})

async function estados(){
    let estados = await getEstados();

    estados.forEach(estado =>{
        let opt = document.createElement('option');
        opt.value = estado.id;
        opt.innerHTML = estado.nome;
        selectEstados.appendChild(opt)
    })
    
}


async function cidades(){
    let estadoSelecionado = selectEstados.options[selectEstados.selectedIndex].value;
    
    let cidades = await getCidades(estadoSelecionado);
    return cidades;
}



