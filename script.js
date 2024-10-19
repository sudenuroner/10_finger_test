// rastgele alıntılar API si
const quoteApiUrl = "https://api.collectapi.com/news/getNews?country=tr&tag=general";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// rastgele gelen alıntıları ekrana yazdırma
const renderNewQuote = async () => {
    // alıntı API sinden veri çek
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    // alıntıdaki karakterlerin dizisi
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "<span/>";
    });
    quoteSection.innerHTML += arr.join("");
};

// kullanıcıların girdiği alıntı ile karşılaştırma mantığı

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelector(".quote-chars");
    quoteChars = Array.from(quoteChars);

    // kullanıcının girdiği karakterler dizisi
    let userInputChars = userInput.value.split("");

    // her bir alıntı karekteri üzerinde döngü
    quoteChars.forEach((char, index) => {
        // karekterleri alıntı karakteriyle karşılaştır
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        } else if (char.innerText == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }
        else {
            // kullanıcı yanlış bir karakter girdiyse 
            if (!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            document.elementFromPoint("mistakes").innerText = mistakes;
        }

        // tüm karakterler doğru ise
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        // tüm karakterler doğruysa testi bitir
        if (check) {
            displayResult();
        }
    });
});

// zamanlayıcıyı güncelle
function updateTimer() {
    if (time == 0) {
        // süre 0 ise 
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// zamanlayıcı ayarla 
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

// testi sonlandır
const displayResult = () => {
    // sonuç bölümünü görüntüle
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;

    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }

    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(
        ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + "%";
};

// testi başlat
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

// sayfa yüklendiğinde
window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}; 