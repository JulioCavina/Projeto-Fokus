const html = document.querySelector('html');

const buttonList = document.querySelectorAll('.app__card-button');

const banner = document.querySelector('.app__image');

const textBanner = document.querySelector('.app__title');

const musicaCheck = document.querySelector('#alternar-musica');

const musicaLuna = new Audio('./sons/luna-rise-part-one.mp3');

musicaLuna.loop = true;

const musicaPlay = new Audio('./sons/play.wav');

musicaPlay.volume = 0.10;

const musicaPause = new Audio('./sons/pause.mp3');

musicaPause.volume = 0.5;

const musicaEnd = new Audio('./sons/beep.mp3');

musicaEnd.volume = 0.35;

const startPauseButton = document.querySelector('#start-pause');

let tempoSegundos = 1500;

let intervaloId = null;

const playPauseImg = document.querySelector('.app__card-primary-button-icon');

const spanElement = startPauseButton.querySelector('span');

const timerBar = document.querySelector('#timer');

let intervaloAtual = 1500;

function startPause () {
    if (intervaloId){
        stop();
        return;
    }
    
    intervaloId = setInterval(temporizador, 1000);
    musicaPlay.play();
}

function stop (){
    clearInterval(intervaloId);
    intervaloId=null;
    musicaPause.play();
    spanElement.textContent = 'Começar';
    playPauseImg.src = './imagens/play_arrow.png';
}

startPauseButton.addEventListener('click', () =>{
    
 
    playPauseImg.src = './imagens/pause.png';
    spanElement.textContent = 'Pausar';
    startPause();
})


const temporizador = () => {

    if (tempoSegundos <= 0){
        musicaEnd.play();
        
        stop();
        timerBar.innerHTML = `Fim!`;
        tempoSegundos = intervaloAtual;
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';

        if (focoAtivo){
            
            const endTimerEvent = new CustomEvent('focoFinalizado');
            document.dispatchEvent(endTimerEvent);
  

        }
        return;
    }

    tempoSegundos -= 1;
    mostrarTempo();
}


musicaCheck.addEventListener('change', () => {

    if (musicaLuna.paused) {
        musicaLuna.play();
    }
    else {

        musicaLuna.pause();
    }

})


for (contador=0;contador<buttonList.length;contador++) {

    const buttonElement = buttonList[contador];

    let buttonContext = buttonElement.classList[1].substring(18);

    if(buttonContext === 'curto'||buttonContext==='longo'){
        buttonContext='descanso-'+buttonContext;
    }

    buttonElement.addEventListener('click', () => {
        alterarContexto(buttonContext);
        alterarBotao(buttonElement);
    })

}


function alterarBotao (classeDoBotao){
    for(contador2=0;contador2<buttonList.length;contador2++){
        buttonElement2 = buttonList[contador2];

        buttonElement2.classList.remove('active');
    }

    classeDoBotao.classList.add('active');
}


function alterarContexto (contexto) {
    html.setAttribute('data-contexto',contexto);
    banner.setAttribute('src',`./imagens/${contexto}.png`);

    switch(contexto){
        case "foco":
            textBanner.innerHTML=`
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            if (intervaloId){
                stop();
            }
            tempoSegundos = 1500;
            intervaloAtual = 1500;

        break;

        case "descanso-curto":
            textBanner.innerHTML=`
            Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            if (intervaloId){
                stop();
            }
            tempoSegundos = 300;
            intervaloAtual = 300;
        break;

        case "descanso-longo":
            textBanner.innerHTML=`
           Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            if (intervaloId){
                stop();
            }
            tempoSegundos = 900;
            intervaloAtual = 900;
        break;
    }
    mostrarTempo();
}

 
function mostrarTempo () {
    let quotient = Math.floor(tempoSegundos/60);

    let remainder = tempoSegundos % 60;
    if (quotient<10){
        quotient = '0'+quotient;
    }

    if (remainder<10){
        timerBar.innerHTML = `${quotient}:0${remainder}`;
    }
    else{
        timerBar.innerHTML = `${quotient}:${remainder}`;
    }
} 

mostrarTempo();