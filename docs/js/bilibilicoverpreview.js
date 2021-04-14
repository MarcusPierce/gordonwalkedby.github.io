"use strict";
var appbg = new Image();
appbg.src = "/images/bilibili_cover_preview_images/app.png";
var appsubbg = new Image();
appsubbg.src = "/images/bilibili_cover_preview_images/appsub.png";
var websubbg = new Image();
websubbg.src = "/images/bilibili_cover_preview_images/websub.png";
var websub2bg = new Image();
websub2bg.src = "/images/bilibili_cover_preview_images/websub2.png";
var webspacebg = new Image();
webspacebg.src = "/images/bilibili_cover_preview_images/webspace.png";
var uploadCover = new Image();
uploadCover.onload = RefreshPreview;
uploadCover.src = "/images/bilibili_cover_preview_images/cover.jpg";
(function() { var h = document.getElementById("uploadimg"); if (h == null) { throw "uploadimg is null" }

    function loadimgfile(f) { var reader = new FileReader;
        reader.readAsDataURL(f);
        reader.onload = function(ev) { if (this.result) { uploadCover.src = this.result.toString() } } } var input = h;
    input.onchange = function() { if (input.files != null) { var uploadimg = input.files.item(0); if (uploadimg == null) { return }
            loadimgfile(uploadimg) } };
    document.getElementsByName("bgtype").forEach(function(e) { e.onclick = RefreshPreview });
    h = document.getElementById("videotitle"); if (h == null) { throw "#videotitle is null" }
    h.onchange = RefreshPreview;
    document.addEventListener("paste", function(ev) { if (ev.clipboardData == null || ev.clipboardData.files == null) { return } var f = ev.clipboardData.files.item(0); if (f == null || f.type.indexOf("image") < 0) { return }
        loadimgfile(f) }) })();

function DrawTextInBlock(ctx, text, x, y, lineheight, maxwidth, maxlines) { var line = 0;
    y += lineheight - 2; while (text.length > 0) { line += 1; if (line > maxlines) { break } var i = 0; for (i = 0; i < text.length; i++) { var m = ctx.measureText(text.substring(0, i + 1)); if (m.width > maxwidth) { break } }
        ctx.fillText(text.substring(0, i), x, y);
        y += lineheight;
        text = text.substring(i) } }

function RefreshPreview() { if (uploadCover.src.length < 1) { return } var h;
    h = document.getElementById("videotitle"); if (h == null) { throw "#videotitle is null" } var input = h; var title = input.value;
    h = document.getElementById("drawing"); if (h == null) { throw "canvas #drawing is null" } var canvas = h; var ctx = canvas.getContext("2d"); if (ctx == null) { throw "canvas 2d context is null" }
    canvas.height = canvas.height; var bgtype = "app";
    document.getElementsByName("bgtype").forEach(function(e) { var ie = e; if (ie.checked) { bgtype = ie.value } }); var font = "'Microsoft YaHei'"; switch (bgtype) {
        case "app":
            ctx.drawImage(uploadCover, 10, 90, 183, 115);
            ctx.drawImage(appbg, 0, 0);
            ctx.font = "16px " + font;
            DrawTextInBlock(ctx, title, 22, 213, 17, 155, 2); break;
        case "appsub":
            ctx.drawImage(uploadCover, 14, 183, 370, 231);
            ctx.drawImage(appsubbg, 0, 0);
            ctx.font = "17px " + font;
            DrawTextInBlock(ctx, title, 17, 418, 18, 368, 1); break;
        case "websub":
            ctx.drawImage(uploadCover, 247, 201, 64, 40);
            ctx.drawImage(websubbg, 0, 0);
            ctx.font = "13px " + font;
            DrawTextInBlock(ctx, title, 63, 224, 14, 175, 2); break;
        case "websub2":
            ctx.drawImage(uploadCover, 98, 115, 207, 130);
            ctx.drawImage(websub2bg, 0, 0);
            ctx.font = "14px " + font;
            DrawTextInBlock(ctx, title, 318, 127, 15, 286, 1); break;
        case "webspace":
            ctx.drawImage(uploadCover, 229, 123, 190, 120);
            ctx.drawImage(webspacebg, 0, 0);
            ctx.font = "12px " + font;
            DrawTextInBlock(ctx, title, 230, 252, 13, 193, 2); break;
        default:
            throw "no such bgtype:" + bgtype; break } };