console.log("Javascript");

let currentsong = new Audio();

function secondstominuteseconds(seconds){
    if(isNaN(seconds) || seconds < 0 ){
        return "Invalid input";
    }
    const minutes = Math.floor(seconds/60);
    const remainingseconds=Math.floor(seconds%60);

    const formattedminutes =  String(minutes).padStart(2,'0');
    const formattedseconds = String(remainingseconds).padStart(2,'0');

    return `${formattedminutes}:${formattedseconds}`;
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track,pause=false) => {
    //let audio=new Audio("/songs/"+track)
    currentsong.src = "/songs/" + track
    if(!pause){
        currentsong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}


async function main() {

    //get the list of all songs
    let songs = await getsongs()
    playMusic(songs[0],true)

    //show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>  
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div>Vishnu</div>
                            </div>
                            <div class="playnow">
                            <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>  </li>`;
    }

    //Attach an event listener to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach an event listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="pause.svg"
        }
        else{
            currentsong.pause();
            play.src="play.svg"
        }
    })

    // Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${secondstominuteseconds(currentsong.currentTime)} / ${secondstominuteseconds(currentsong.duration)}` 
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + '%';
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentsong.currentTime=((currentsong.duration)*percent)/100;
    })
    
    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%"
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })


}
main()