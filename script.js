console.log("Javascript");

async function getsongs() {
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as = div.getElementsByTagName("a");
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}


async function main() {
    //get the list of all songs
    let songs=await getsongs()
    console.log(songs);

    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for(const song of songs){
        songul.innerHTML=songul.innerHTML+`<li> ${song.replaceAll("%20","")} </li>`;
    }
}

main()