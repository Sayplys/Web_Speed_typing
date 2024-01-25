const startTime = 30
const timeVariation = 100
const texts = ['test <>. text', "text text² 123"]

var timer = startTime
var isGameRunning = false
var words = 1
var wpm = 0
var textMap = []

const targetTextElement = $("#target-text")
const textInputElement = $("#text-input")

function start(){
    targetTextElement.text(texts[0])
    textInputElement.val('')
    timer = startTime
    isGameRunning = true
    words = 1
    wpm = 0
    textMap = []
    update()
}

function update(){
    setTimeout(() => {
        countdown()
        calcWPM()
        if(isGameRunning){
            update()
        }
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
                styledText += '<span style="color: green;">' +  target.substring(last + 1, current + 1) + "</span>"
                targetTextElement.html(styledText)
            }else{
                styledText += '<span style="color: red;">' +  target.substring(last + 1, current + 1) + "</span>" 
            }

            last = current
        }
        
        styledText += target.substring(current)
        targetTextElement.html(styledText)
    }

    if(target.length - 1 <= currentIndex){
        isGameRunning = false
    }
}

function calcWPM(){
    wpm = (words * 60) / (startTime - timer)
    $("#wpm-count").text(wpm.toFixed(2))
}

textInputElement.on("keydown", (value)=>{
    if(value.key == "Backspace") {
        textMap.pop()
        setTimeout(()=>{compare()},1)
    }else if(value.key == " "){
        words++
    }

    setTimeout(()=>{compare()},1)
})

