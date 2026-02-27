const styles = [
        {name: "Swing", audioFile: "songs/Sing, Sing, Sing.mp3"},
        {name: "Bebop", audioFile: "songs/Hot House.mp3"},
        {name: "Cool Jazz", audioFile: "songs/Moon Dreams.mp3"},
        {name: "Modal Jazz", audioFile: "songs/So What.mp3"},
        {name: "Hard Bop", audioFile: "songs/Moanin'.mp3"},
        {name: "Free Jazz", audioFile: "songs/Lonely Woman.mp3"},
        {name: "Asian American Jazz", audioFile: "songs/Butterfly Lovers Song.mp3"},
        {name: "Latin Jazz", audioFile: "songs/Oye Como Va.mp3"},
        {name: "Fusion Jazz", audioFile: "songs/Chameleon.mp3"}
    ]


    const slots = {
        1: {currentSource: null, isPlaying: false, analyser: null, dataArray: null, animationID: null, canvasID: "canvas1"},
        2: {currentSource: null, isPlaying: false, analyser: null, dataArray: null, animationID: null, canvasID: "canvas2"}
    }

    let activeSlot = 1
    const audioCtx = new AudioContext()
    let isComparing = false
    const canvas1 = document.getElementById("canvas1")
    const canvas2 = document.getElementById("canvas2")

    window.onload = function(){
        canvas1.width = window.innerWidth
        canvas2.width = window.innerWidth
    }




    function getColor(freq){
        if (freq < 60)   return "#e05c5c"   // sub bass
        if (freq < 250)  return "#e08a3c"   // bass / double bass
        if (freq < 500)  return "#e0c84c"   // low mid / trombone
        if (freq < 2000) return "#5ce07a"   // mid / trumpet / sax
        if (freq < 6000) return "#5cbde0"   // high mid / harmonics
        return "#a07de0"            
    }

    function loadStyle(style, slotNum) {
        const slot = slots[slotNum]
        const canvas = document.getElementById(slot.canvasID)
        const ctx = canvas.getContext("2d")

        if (slot.isPlaying) {
            slot.currentSource.stop()
            slot.currentSource = null
            slot.isPlaying = false
            cancelAnimationFrame(slot.animationID)
            slot.animationID = null
        }

        fetch(style.audioFile)
        .then(function(response) {
            return response.arrayBuffer()
        })
        .then(function(buffer) {
            audioCtx.decodeAudioData(buffer, function(decoded) {
                slot.currentSource = audioCtx.createBufferSource()
                slot.isPlaying = true
                slot.currentSource.buffer = decoded

                const gain = audioCtx.createGain()
                const samples = decoded.getChannelData(0)
                let peak = 0

                for (let i = 0; i < samples.length; i+=100){
                    const abs = Math.abs(samples[i])
                    if (abs>peak) peak = abs
                }

                gain.gain.value = 1/peak


                slot.analyser = audioCtx.createAnalyser()
                slot.analyser.fftSize = 32768

                slot.currentSource.connect(gain)
                gain.connect(slot.analyser)
                slot.analyser.connect(audioCtx.destination)
                slot.currentSource.start()
                document.getElementById("label" + slotNum).textContent = style.name
                slot.currentSource.onended = function(){
                    slot.isPlaying = false
                }

                slot.dataArray = new Uint8Array(slot.analyser.frequencyBinCount)

                function draw() {
                    if (!slot.isPlaying) return

                    slot.animationID = requestAnimationFrame(draw)
                    slot.analyser.getByteFrequencyData(slot.dataArray)

                    ctx.fillStyle = "#0a0a0f"
                    ctx.fillRect(0,0,canvas.width,canvas.height)

                    const nyq = 22050
                    const logMin = Math.log10(20)
                    const logMax = Math.log10(nyq)
                    const numBars = 256

                    for (let i = 0; i < numBars; i++) {
                    const logFreq = logMin + (i/numBars) * (logMax - logMin)
                    const freq = Math.pow(10,logFreq)
                    const index = Math.floor(freq / nyq * slot.dataArray.length)
                    const value = slot.dataArray[index]

                    const barWidth = canvas.width / numBars
                    const barHeight = (value / 255) * canvas.height
                    const x = i * barWidth
                    const y = canvas.height - barHeight
                    ctx.fillStyle = getColor(freq)
                    ctx.fillRect(x,y,barWidth - 1, barHeight)
                    }
                }
                draw()
            })
        })
    }




    styles.forEach(function(style) {
        // console.log(style.name)
        // console.log(style.audioFile)
        
        const button = document.createElement("button")
        button.textContent = style.name
        
        button.addEventListener("click", function() {
            loadStyle(style,activeSlot)
        })

        document.getElementById("styleTab").appendChild(button)
    })


    document.getElementById("comparisonBtn").addEventListener("click", function() {


        document.getElementById("slot2Container").style.display = "flex"
        activeSlot = 2
        canvas1.width = canvas1.offsetWidth
        canvas2.width = canvas2.offsetWidth

        document.getElementById("comparisonBtn").style.display = "none"
        document.getElementById("closeComparison").style.display = "inline-block"
    })


    document.getElementById("closeComparison").addEventListener("click", function() {
        const slot = slots[activeSlot]
        if (slot.currentSource) {
            slot.currentSource.stop()
            slot.currentSource = null
            slot.isPlaying = false
            cancelAnimationFrame(slot.animationID)
            slot.animationID = null
        }
        canvas1.width = canvas1.offsetWidth
        const canvas = document.getElementById("canvas2")
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "#f5f0e8"
        ctx.fillRect(0,0,canvas.width,canvas.height)
        document.getElementById("slot2Container").style.display = "none"
        activeSlot = 1
        document.getElementById("closeComparison").style.display = "none"
        document.getElementById("comparisonBtn").style.display = "inline-block"
    })





    document.getElementById("stopBtn").addEventListener("click", function() {
        
        for (let i = 1; i <= activeSlot; i++){
            const slot = slots[i]
            if(slot.currentSource) {
                slot.currentSource.stop()
                slot.currentSource = null
                slot.isPlaying = false
                cancelAnimationFrame(slot.animationID)
                slot.animationID = null
            }
        }
    })