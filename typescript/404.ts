/// <reference path="init.ts" />

(function () {
    const t404 = document.getElementById("t404")
    if (t404 == null) { return }
    let url = location.href.toLowerCase()
    let str = location.search
    const se = new URLSearchParams(str)
    const po = se.get("po")
    if (po != null && po.length > 0) {
        url = location.origin + "/" + po.toLowerCase()
    }
    if (url != location.href) {
        location.href = url
    }
})();
