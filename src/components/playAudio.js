

const playAudio = (audioUrl)=>{
    const audioElement = new Audio();

    // Set the audio source and play it
    audioElement.src = `https://media.merriam-webster.com/soundc11/${audioUrl[0]}/${audioUrl}.wav`;

    audioElement.play();
}

export default playAudio;