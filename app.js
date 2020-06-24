class DrumKit{
    constructor(){
        this.pads = document.querySelectorAll(".pad");
        this.kickAudio = document.querySelector(".kick-sound");
        this.snareAudio = document.querySelector(".snare-sound");
        this.hihatAudio = document.querySelector(".hihat-sound");
        this.index = 0;
        /*tiempo de intervalo */
        this.bpm= 200;
        /*Boton*/
        this.playBtn = document.querySelector(".play");
        /*variable para que no se mesclen los sonidos al momento de darle otra vez en btn start*/
        this.isPlaying = null;

        /*cambio de sunidos*/
        this.currentKick = './sounds/kick-classic.wav';
        this.currentSnare = './sounds/snare-acoustic01.wav';
        this.currentHihat = './sounds/hihat.acoustic01.wav';
        this.selects = document.querySelectorAll("select");
        /*MUTEO Mute */
        this.muteBtns = document.querySelectorAll(".mute");
        /*BARRA TEMPO */
        this.tempoSlider = document.querySelector(".tempo-slider");
    }
    activePad(){
        this.classList.toggle("active");
    }
    repeat(){
        /*NUMERO DE CUADROS*/
        let step = this.index % 8;
        //console.log(`step ${step} and index ${this.index}`);
        const activeBars = document.querySelectorAll(`.b${step}`);
        //console.log(activeBars);
        //LOop over the pads
        activeBars.forEach(bar =>{
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
            /*CKECK IF PADS ARE ACTIVE */
            if(bar.classList.contains('active')){
                //check each sound
                if(bar.classList.contains('kick-pad')){
                    /*para evitar la saturacion de los sonidos al momento en el que seleccionemos 2 o mas segidos 
                    se reinicia el sonido.wav*/
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if(bar.classList.contains('snare-pad')){
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if(bar.classList.contains('hihat-pad')){
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        });
        this.index++;
        
    }
    /*REPITELO EN UN CLICLO INFINITO */
    start(){
        //console.log(this);
        /*Constante de intervelo de tiempo */
        const interval = (60/this.bpm) * 1000;
        //creamos una variable isPlaying para ver y comprobar que ya se ejecuto una vez
        if(this.isPlaying){
            //remove interval
            clearInterval(this.isPlaying);
            this.isPlaying = null;
            console.log(this.isPlaying);
        }else{
            this.isPlaying = setInterval(() =>{
                this.repeat();
            }, interval);
        }
    }
    /*CAMBIO AL MOMENTO DE DARLE START */
    updateBtn(){
        if(!this.isPlaying){
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add("active");
        }else{
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove("active");
        }
    }
    changeSound(e){
        const selectionName = e.target.name;
        const selectionValue = e.target.value;
        //console.log(selectionName+ " valor "+selectionValue);
        switch(selectionName){
            case "kick-select":
                this.kickAudio.src = selectionValue;
            break;
            case "snare-select":
                this.snareAudio.src = selectionValue;
            break;
            case "hihat-select":
                this.hihatAudio.src = selectionValue;
            break;
        }
    }
    mute(e){
        /*LLAMAMOS EL NUMERO DE PISTA DATA-TRACK y añadimos la clase .mute.active */
        const muteIndex = e.target.getAttribute("data-track");
        e.target.classList.toggle("active");
        if(e.target.classList.contains('active')){
            switch(muteIndex){
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;
            }
        }else{
            switch(muteIndex){
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume= 1;
                    break;
            }
        }
    }
    changeTempo(e){
        const tempotext = document.querySelector(".tempo-nr");
        this.bpm = e.target.value;
        tempotext.innerText = e.target.value;
    }
    updateTempo(e){
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector(".play");
        if(playBtn.classList.contains("active")){
            this.start();
        }
    }
}

const drumkit = new DrumKit();
//ANIMACION DE LOS PADS
drumkit.pads.forEach(pad => {
    pad.addEventListener("click", drumkit.activePad);
    pad.addEventListener('animationend', function(){
        this.style.animation = "";
    });
});
drumkit.playBtn.addEventListener("click", ()=>{
    drumkit.updateBtn();
    drumkit.start();
});

drumkit.selects.forEach(select =>{
    select.addEventListener('change', function(e){
        drumkit.changeSound(e);
    });
});
drumkit.muteBtns.forEach(btn =>{
    btn.addEventListener("click", function(e){
        drumkit.mute(e);
    });
});

/*VALOR DE LA BARRA */
drumkit.tempoSlider.addEventListener('input', (e)=>{
    drumkit.changeTempo(e);
});

/*VALOR DE TEMPO */
drumkit.tempoSlider.addEventListener('change', (e)=>{
    drumkit.updateTempo(e);
});
