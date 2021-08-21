const note = document.getElementById("note");
const coin = document.getElementById("coin");
const div = document.getElementsByClassName("selectbtn");
const display = document.getElementById("display")
const gear = document.getElementById("gear")
const pro_price = []
Array.from(div).forEach((item) => {
    pro_price.push(item.firstChild.getElementsByTagName("input")[0].value);
})
const coins = new Array("10", "50", "100", "500");


// Function for clear active class from all button
const clearcolorFun = () => {
    for (var i = 0; i < div.length; i++) {
        div[i].getElementsByTagName("span")[0].removeAttribute("class");
        // div[i].getElementsByTagName("span")[0].classList.remove("active");
        div[i].firstChild.classList.remove("active");
        // div[i].getElementsByTagName("span")[0].classList.remove("elagiable");
    }
}

// Function for add active class on selected button
const colorFun = (event) => {
    if (event.target.tagName == "SPAN") {
        event.target.parentElement.classList.add("active")
    } else { event.target.classList.add("active"); }
}

// Function for insert Note money
const notefun = (m, pp, pn) => {
    if (m >= pp) {
        var retn = m - pp;
        sessionStorage.clear()
        if (retn != 0) {
            getCoin()
        }
        setTimeout(function () {
            alert(`あなたの商品は「${pn}」とお釣りは「${retn}円」です。`);
            clearcolorFun();
            location.reload();
            display.textContent = "";
        }, 800)
    } else {
        alert("お金が足らない。");
    }
}

// Function for check money on SessionStorage
const checkMoney = () => {
    var money;
    var checkCoin = sessionStorage.getItem("coinMoney");
    var checkNote = sessionStorage.getItem("noteMoney");
    if (checkCoin) {
        display.textContent = checkCoin + "円";
        money = checkCoin;
        // setTimeout(() => {
        //     alert(`${checkCoin}円のコインが入ってます。`)
        // }, 500);
    } else if (checkNote) {
        display.textContent = checkNote + "円";
        money = checkNote;
        // setTimeout(() => {
        //     alert(`${checkNote}円札が入ってます。`)
        // }, 500);

    }
    return parseInt(money);
}

// Function for find Highest price
const highestPrice = (arry) => {
    var max = 0;
    for (var i = 0; i < arry.length; i++) {
        if (max < arry[i]) {
            max = arry[i];
        }
    }
    return parseInt(max);
}

// Process for product light on when money is sufficient
const eligableLight = (m) => {
    for (var i = 0; i < pro_price.length; i++) {
        if (parseInt(m) >= pro_price[i]) {
            div[i].getElementsByTagName("span")[0].classList.add("elagiable")
        }
    }
}
//Process for when Product button pressed
for (var i = 0; i < div.length; i++) {
    var button = div[i].firstChild;
    button.addEventListener("click", (e) => {
        e.preventDefault()
        clearcolorFun();
        clearInterval(myinter);
        checkMoney();
        var money;
        var product_name = e.target.getElementsByTagName('input')[0].getAttribute("name");
        var product_price = parseInt(e.target.getElementsByTagName('input')[0].value);
        if (sessionStorage.getItem("noteMoney")) {
            money = parseInt(sessionStorage.getItem("noteMoney"));
            clearcolorFun();
            colorFun(e);
            notefun(money, product_price, product_name);
            getItem(product_name);
        } else if (sessionStorage.getItem("coinMoney")) {
            money = parseInt(sessionStorage.getItem("coinMoney"));
            if (money < product_price) {
                eligableLight(money)
                setTimeout(() => {
                    while (true) {
                        var addMoney = prompt(`${money}円のコインが入ってます。\nお金が足らないのでまたお金を足しますか。\n10円、50円、100円、500円玉や　1000円札を入れてください。`);
                        if (addMoney == null) break;
                        if (coins.includes(addMoney)) {
                            sessionStorage.clear();
                            money += parseInt(addMoney);
                            sessionStorage.setItem("coinMoney", money);
                            eligableLight(parseInt(money));
                            display.textContent = money + "円";
                            break
                        } else if (addMoney == "1000") {
                            sessionStorage.clear();
                            money += parseInt(addMoney);
                            sessionStorage.setItem("noteMoney", money);
                            eligableLight(parseInt(money));
                            display.textContent = money + "円";
                            break
                        }
                    }
                }, 500)

            } else {
                clearcolorFun();
                colorFun(e);
                notefun(money, product_price, product_name);
                getItem(product_name)
            }
        } else {
            alert("まずお金を入れてください。")
            location.reload();
        }
    })
}
//Process for when insert note money pressed
note.onclick = () => {
    clearInterval(myinter);
    clearcolorFun();
    if (!sessionStorage.getItem("noteMoney") && !sessionStorage.getItem("coinMoney")) {
        setTimeout(() => {
            while (true) {
                var money = prompt('1000円札を入れてください。');
                if (money == null) { location.reload(); break };
                if (money == 1000) {
                    eligableLight(parseInt(money));
                    if (typeof (Storage) !== "undefined") {
                        sessionStorage.setItem("noteMoney", money);
                        display.textContent = money + "円";
                    };
                    break
                };
            }
        }, 500)

    } else {
        var money = checkMoney();
        if (money < highestPrice(pro_price)) {
            setTimeout(() => {
                while (true) {
                    var addmoney = prompt(`${money}円のコインが入ってます。\nお金が足らないのでまたお金を足しますか。\n1000円札を入れてください。`);
                    if (addmoney == null) break;
                    if (addmoney == "1000") {
                        if (typeof (Storage) !== "undefined") {
                            money += parseInt(addmoney);
                            eligableLight(money)
                            sessionStorage.clear();
                            sessionStorage.setItem("noteMoney", money);
                            display.textContent = money + "円";
                        }
                        break;
                    }
                }
            }, 500)

        }
        eligableLight(money);
    }
}

//Process for when insert coin money pressed
coin.onclick = () => {
    clearcolorFun();
    clearInterval(myinter);
    if (!sessionStorage.getItem("noteMoney")) {
        if (sessionStorage.getItem("coinMoney")) {
            var sessionMoney = checkMoney();
            eligableLight(sessionMoney);
            if (sessionMoney < highestPrice(pro_price)) {
                setTimeout(() => {
                    while (true) {
                        var addmoney = prompt(`${sessionMoney}円のコインが入ってます。\nお金が足らないのでまたお金を足しますか。\n10円、50円、100円や500円玉を入れてください。`);
                        if (addmoney == null) break;
                        if (coins.includes(addmoney)) {
                            sessionMoney += parseInt(addmoney)
                            eligableLight(sessionMoney);
                            display.textContent = sessionMoney + "円";
                            if (typeof (Storage) !== "undefined") {
                                sessionStorage.setItem("coinMoney", sessionMoney);
                            }
                            break;
                        }
                    }
                }, 500);
            }
        } else {
            var demoMoney = 0;
            setTimeout(() => {
                while (true) {
                    var money = prompt('10円、50円、100円や500円玉を入れてください。');
                    if (money == null) { location.reload(); break };
                    if (coins.includes(money)) {
                        demoMoney += parseInt(money)
                        eligableLight(demoMoney);
                        display.textContent = demoMoney + "円";
                        if (typeof (Storage) !== "undefined") {
                            sessionStorage.setItem("coinMoney", demoMoney);
                        }
                        break
                    } else {
                        continue
                    }
                }
            }, 100);
        }
    } else {
        var money = checkMoney();
        eligableLight(money);
    }
}

//Process for when insert coin money pressed
gear.onclick = () => {
    var money = checkMoney();
    if (money) {
        clearInterval(myinter);
        clearcolorFun();
        setTimeout(() => {
            if (confirm("購入をやめますか？")) {
                checkMoney();
                // var money = checkMoney();
                sessionStorage.clear();
                setTimeout(() => {
                    alert(`あなたへお返しは${money}円です。`);
                    display.textContent = "";
                    location.reload();
                }, 750);
                getCoin()
            }
        }, 100)

    }

}

// for getting product
function getItem(proname) {
    var item = document.getElementById('proGet').firstChild;
    var img_title = document.getElementsByClassName("pro");
    var obj;
    for (var i = 0; i < img_title.length; i++) {
        var titles = img_title[i].firstChild.getAttribute("title");
        if (proname == titles) {
            var src = img_title[i].firstChild.getAttribute("src");
            obj = {
                "src": src,
                "class": "p_disp"
            };
            for (var key in obj) {
                item.setAttribute(key, obj[key])
            }
        }
    }
}

// For getting change
function getCoin() {
    var item = document.getElementById('chngGet').firstElementChild;
    item.setAttribute('class', 'c_disp');
}

var num = 0;
var myinter = setInterval(() => {
    var val1 = num - 1;
    var val2 = num - 2;
    clearcolorFun();
    if (val1 >= 0) {
        div[val1].getElementsByTagName("span")[0].classList.add("color2");
    } else if (val2 >= 0) {
        div[val2].getElementsByTagName("span")[0].classList.add("color3");
    }
    div[num].getElementsByTagName("span")[0].classList.add("color1");
    num++;
    if (num == div.length) {
        num = 0;
    }
}, 100)