const startTime = 60
const timeVariation = 100
const shortTexts = ["Bananas are berries, but strawberries aren't. Botanical classifications can surprise;",
                    "Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
                    "The shortest war in history lasted just 38 to 45 minutes between Britain and Zanzibar on August 27, 1896."    
                    ]

const longTexts = ['Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. The long shelf life is due to its low moisture content and acidic pH, creating an inhospitable environment for bacteria and microorganisms.', 
                    "In space, there's a giant diamond star named BPM 37093, located 50 light-years away from Earth. Dubbed 'Lucy' after the Beatles song 'Lucy in the Sky with Diamonds,' it's a crystallized white dwarf with a core of carbon and oxygen, estimated to be ten billion trillion trillion carats, making it the largest diamond ever discovered.",
                    "Quantum computers can perform complex calculations at unimaginable speeds due to the principles of superposition and entanglement. Unlike classical bits, which can only exist in states of 0 or 1, quantum bits (qubits) can exist in both states simultaneously, exponentially increasing computational power. This enables quantum computers to solve certain problems much faster than traditional computers."
                    ]

var choicedTexts = longTexts
var timer = startTime
var isGameRunning = false
var words = 1
var wpm = 0
var accurancy = 100
var points = 0
var textMap = []

const targetTextElement = $("#target-text")
const textInputElement = $("#text-input")

function start(){
    choicedTexts = choiceTexts()
    targetTextElement.text(choicedTexts[Math.floor(Math.random() * choicedTexts.length)])
    textInputElement.val('')
    timer = startTime
    isGameRunning = true
    words = 1
    wpm = 0
    textMap = []
    targetTextElement.css({
        "transform": "translateX(" + -(textMap.length) * 15 + "px)",
    })
    update()
}

function update(){
    setTimeout(() => {
        countdown()
        calcWPM()
        if(isGameRunning){
            update()
            return
        }
        calcPoints()
    }, timeVariation)
}

function countdown(){
    timer -= timeVariation / 1000
    $("#timer").text(timer.toFixed(1) + "s")
    if(timer <= 0){
        isGameRunning = false
    }
}

function compare(){
    var currentIndex = textInputElement.val().length - 1
    var input = textInputElement.val()
    var target = targetTextElement.text()

    if(input.length > textMap.length){
        textMap.push(input[currentIndex] == target[currentIndex])
    }

    if(textMap.length == input.length){
        var last = -1
        var styledText = ""
        for(var current = 0; current < textMap.length; current++){
            if(textMap[current] == textMap[current + 1] && current + 1 != textMap.length) continue

            if(textMap[current] == true){
                styledText += '<span style="color: #4fb;">' +  target.substring(last + 1, current + 1) + "</span>"
                targetTextElement.html(styledText)
            }else{
                styledText += '<span style="color: #a77; text-decoration-line: underline;">' +  target.substring(last + 1, current + 1) + "</span>" 
            }

            last = current
        }
        
        styledText += target.substring(current)
        targetTextElement.html(styledText)
        calcAcurrancy()
    }

    if(target.length - 1 <= currentIndex){
        isGameRunning = false
    }
}

function calcWPM(){
    wpm = (words * 60) / (startTime - timer)
    $("#wpm-count").text(wpm.toFixed(2))
}

function calcAcurrancy(){
    var correctQtd = 0
    textMap.forEach((value)=>{if(value==true)correctQtd++})
    accurancy = (correctQtd * 100) / textMap.length
    $("#accurancy-count").text(accurancy.toFixed(2))
}

function calcPoints(){
    points = wpm * accurancy**3
    $("#points-count").text((points/1000).toFixed())
}

function choiceTexts(){
    console.log($("#length-choices").val())
    switch($("#length-choices").val()){
        case"short":
            return shortTexts
        default:
            return longTexts
    }
}

textInputElement.on("keydown", (value)=>{
    if(isGameRunning){
        if(value.key == "Backspace") {
            if(textInputElement.val()[textMap.length - 1] == " "){
                words--
            }
            textMap.pop()
            setTimeout(()=>{compare()},1)
        }else if(value.key == " "){
            words++
        }

        setTimeout(()=>{compare()},1)

        targetTextElement.css({
            "transform": "translateX(" + -(textMap.length) * 10 + "px)",
        })

    }  
})

