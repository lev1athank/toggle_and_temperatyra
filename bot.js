const light = document.querySelector("#light")
const battery = document.querySelector(".box-verticle")
const batteryBtn = document.querySelector(".toggleBatter")
const btn_togl = document.querySelector(".toggleLight")
const valTemperatura = document.querySelector(".temperatura")
countTemp = 1
var IsLight = false;
var Isbattery = false;

minTemp = 24
maxTemp = 36


btn_togl.addEventListener('click', ()=>{
    IsLight = !IsLight
    toggle(light, IsLight, "light");
    check(light, 3, "light")
    
})

batteryBtn.addEventListener('click', ()=>{
    Isbattery = !Isbattery
    toggle(battery, Isbattery, "active")
    check(battery, 1, "active")
    if(!Isbattery) {
        StopTerperatyra()
    }else{
        StartTemperatyra()
    }
})
var x = new XMLHttpRequest();
const time = 5
var id;


function check(obj, id, className) {
    if(obj.classList[id] == className) {
        send_user("Предмет включен")
    }else {
        send_user("Предмет выключен")
    }
}


function send_request(id = null) {
    var url = "https://api.telegram.org/bot5104688774:AAFZr02MVqTE3shadMVbxQ9c-t9JIWOo_BE/getUpdates"
    if(id) {
        url += '?offset=' +id
    }
    x.open("GET", url, false);
    x.send(null)
    return JSON.parse(x.responseText)
}

function toggle(obj, state, className) {
    if(state) 
        obj.classList.add(className)
    else
        obj.classList.remove(className)
}


function send_user(text, er) {

    fetch("https://api.telegram.org/bot5104688774:AAFZr02MVqTE3shadMVbxQ9c-t9JIWOo_BE/sendMessage?chat_id=804206736&text="+text)
    // if(er)
    //     fetch("https://api.telegram.org/bot5104688774:AAFZr02MVqTE3shadMVbxQ9c-t9JIWOo_BE/sendMessage?chat_id=804206736&text="+ "доступны команды: 'вкл', 'включить', 'выкл', 'выключить' + что имено")
    

    
}



function readMessage() {
    if(!id) {
        list_message = send_request()
        if(list_message['result'].length != 0) {
            id = list_message['result'][list_message['result'].length-1]['update_id']
        }
        else 
            return
    }
    var text = send_request(id)['result']

    if(text.length != 0) {
        id+=1;
        switch (text[0]['message']['text'].toLowerCase()) {
            case "вкл лампу":
                toggle(light, true, "light")
                check(light, 3, "light")
                IsLight = true
                break;
        
            case "включить лампу":
                toggle(light, true, "light")
                check(light, 3, "light")
                IsLight = true
                break;

            case "выкл лампу":
                toggle(light, false, "light")
                check(light, 3, "light")
                IsLight = false
                break;
        
            case "выключить лампу":
                IsLight = false
                toggle(light, false, "light")
                check(light, 3, "light")
                break;

            case "вкл печь":
                toggle(battery, true, "active")
                Isbattery = true
                StartTemperatyra()
                check(battery, 2, "active")
                break;
        
            case "включить печь":
                toggle(battery, true, "active")
                Isbattery = true
                StartTemperatyra()
                check(battery, 2, "active")
                break;

            case "выкл печь":
                toggle(battery, false, "active")
                Isbattery = false
                StopTerperatyra()
                check(battery, 2, "active")
                break;
        
            case "выключить печь":
                toggle(battery, false, "active")
                Isbattery = false
                StartTemperatyra()
                check(battery, 2, "active")
                break;
            
            case "температура":
                sendTemperatur()
                break;
            case "текст":
                getText()
                break;
                
            default:
                if(!set_max_temperatura())
                    send_user("я тебя не понял", true)
                break;
        }
    }
}


setInterval(()=>readMessage(), 1000 * time)

var temperatyraInterval;

var temperatyra = 24
function TemperatyraChack(temp = countTemp) {
    if((!Isbattery && temperatyra <= minTemp) || (Isbattery && temperatyra == maxTemp)) {temp = 0; console.log(false);}
    if(temperatyra > maxTemp) temp = countTemp * -1
    temperatyra += temp
    valTemperatura.innerText = temperatyra
    
}

function StartTemperatyra() {
    countTemp = Math.abs(countTemp)
    clearInterval(temperatyraInterval)
    temperatyraInterval = setInterval(() => {
        TemperatyraChack()
    }, 1000  * 2);
}
function StopTerperatyra() {
    countTemp *= -1
    toggle(battery, false, 'active')
}

function sendTemperatur() {
    fetch("https://api.telegram.org/bot5104688774:AAFZr02MVqTE3shadMVbxQ9c-t9JIWOo_BE/sendMessage?chat_id=804206736&text=текущая температура: "+temperatyra)
}

function set_max_temperatura() {
    const text = send_request()['result'][0]['message']['text'].toLowerCase().split(" ")
    if(text[0] == "температура" && !isNaN(text[1])) {
        maxTemp = parseInt(text[1])
    }
    console.log(text);
    return true

}
