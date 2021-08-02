"use strict";
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const divbuttons = document.getElementById("buttons");
const inputHashRepeatTimes = document.getElementById("inputHashRepeatTimes");
const inputKey = document.getElementById("inputKey");
function AddLine() {
    divbuttons.appendChild(document.createElement("br"));
}
function GetHashRepeatTimes() {
    let num = parseInt(inputHashRepeatTimes.value);
    if (isNaN(num)) {
        num = 1;
    }
    else {
        num = Math.min(Math.max(Math.round(num), 1), 9999);
    }
    console.log("fix", num.toFixed());
    inputHashRepeatTimes.value = num.toFixed();
    return num;
}
function GetKey() {
    return inputKey.value;
}
function AddButton(text, func) {
    const but = document.createElement("button");
    but.innerText = text;
    but.addEventListener("click", func);
    but.style.padding = "5px";
    but.style.margin = "5px";
    but.style.fontSize = "large";
    divbuttons.appendChild(but);
}
function AddCalcButton(text, func, allowEmptyInput = false) {
    AddButton(text, function () {
        outputArea.value = "";
        let output = "";
        const input = inputArea.value;
        if (allowEmptyInput || (input != null && input.length > 0)) {
            try {
                output = func(input);
            }
            catch (error) {
                output = "Javascript 出错：" + String(error);
            }
        }
        else {
            output = "输入为空，无法计算。";
        }
        if (output == null || output.length < 1) {
            output = "没有可见的返回内容。";
        }
        outputArea.value = output;
    });
}
function AddSimpleRepeat(text, func) {
    AddCalcButton(text, function (input) {
        for (let i = 0; i < GetHashRepeatTimes(); i++) {
            input = func(input).toString();
        }
        return input;
    });
}
AddSimpleRepeat("MD5", CryptoJS.MD5);
AddSimpleRepeat("RIPEMD160", CryptoJS.RIPEMD160);
AddSimpleRepeat("SHA1", CryptoJS.SHA1);
AddSimpleRepeat("SHA224", CryptoJS.SHA224);
AddSimpleRepeat("SHA256", CryptoJS.SHA256);
AddSimpleRepeat("SHA3", CryptoJS.SHA3);
AddSimpleRepeat("SHA384", CryptoJS.SHA384);
AddSimpleRepeat("SHA512", CryptoJS.SHA512);
AddLine();
function AddHmacRepeat(text, func) {
    AddCalcButton(text, function (input) {
        let key = GetKey();
        if (key == null || key.length < 1) {
            return "没有key";
        }
        for (let i = 0; i < GetHashRepeatTimes(); i++) {
            input = func(input, key).toString();
        }
        return input;
    });
}
AddHmacRepeat("HmacMD5", CryptoJS.HmacMD5);
AddHmacRepeat("HmacRIPEMD160", CryptoJS.HmacRIPEMD160);
AddHmacRepeat("HmacSHA1", CryptoJS.HmacSHA1);
AddHmacRepeat("HmacSHA224", CryptoJS.HmacSHA224);
AddHmacRepeat("HmacSHA256", CryptoJS.HmacSHA256);
AddHmacRepeat("HmacSHA3", CryptoJS.HmacSHA3);
AddHmacRepeat("HmacSHA384", CryptoJS.HmacSHA384);
AddHmacRepeat("HmacSHA512", CryptoJS.HmacSHA512);
AddLine();
AddCalcButton("AES加密", function (input) {
    let key = GetKey();
    if (key == null || key.length < 1) {
        return "没有key";
    }
    return CryptoJS.AES.encrypt(input, key).toString();
});
AddCalcButton("AES解密", function (input) {
    let key = GetKey();
    if (key == null || key.length < 1) {
        return "没有key";
    }
    return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
});
AddLine();
AddButton("上下互换", function () {
    const t = inputArea.value;
    inputArea.value = outputArea.value;
    outputArea.value = t;
});
AddButton("复制输入", function () {
    const t = inputArea.value;
    navigator.clipboard.writeText(t);
});
AddButton("复制输出", function () {
    const t = outputArea.value;
    navigator.clipboard.writeText(t);
});
