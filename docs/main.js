"use strict";
function RandomInt(a, b) {
    if (a == b) {
        return Math.floor(a);
    }
    let min = Math.round(Math.min(a, b)) - 0.49;
    let max = Math.round(Math.max(a, b)) + 0.49;
    let rnd = Math.random();
    return Math.round(rnd * (max - min) + min);
}
function RandomChoose(array) {
    let l = array.length;
    if (l < 2) {
        return array[0];
    }
    let index = RandomInt(0, l - 1);
    return array[index];
}
function RandomHSLColor(s = 100, b = 85) {
    let str = "hsl(";
    str += RandomInt(0, 359).toFixed() + ",";
    str += s.toFixed() + "%,";
    str += b.toFixed() + "%)";
    return str;
}
(function () {
    let SectionTitles = document.getElementsByClassName("sectionTitle");
    let titleWidth = Math.min(400, window.innerWidth * 0.7);
    for (let i = 0; i < SectionTitles.length; i++) {
        let t = SectionTitles[i];
        let str = t.innerText;
        for (let j = 0; j < 50; j++) {
            str = "+" + str + "+";
            t.innerText = str;
            if (t.offsetWidth > titleWidth) {
                break;
            }
        }
    }
})();
function AddFriendsLink(title, url) {
    let div = document.getElementById("friendLinksBox");
    let a = document.createElement("a");
    a.href = url;
    a.title = title;
    a.target = "_blank";
    a.className = "friendslink";
    a.innerText = title;
    let bg = "linear-gradient(to " + RandomChoose(["bottom", "right"]) + "," + RandomHSLColor() + "0%," + RandomHSLColor() + "50%," + RandomHSLColor() + "52%," + RandomHSLColor() + "100%)";
    a.style.background = bg;
    a.style.color = RandomHSLColor(100, 11);
    div.appendChild(a);
}
(function () {
    let links = [];
    links.push({
        k: "技术宅的结界",
        v: "https://www.0xaa55.com/"
    });
    links.push({
        k: "AceSheep",
        v: "https://blog.acesheep.com/"
    });
    links.push({
        k: "Sonic853",
        v: "https://blog.853lab.com/"
    });
    let len = links.length;
    for (let i = 0; i < len; i++) {
        let index = RandomInt(0, links.length - 1);
        let item = links[index];
        links.splice(index, 1);
        AddFriendsLink(item.k, item.v);
    }
})();
