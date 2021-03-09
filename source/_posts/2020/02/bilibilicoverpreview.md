---
title: B站投稿封面效果预览工具【不再更新】
date: 2020-02-12 09:27:54
tags: [我的软件,视频创作]
---

# 本工具自从2020年11月之后已经不再提供更新。因为根本没人用。您可以离开了！

原脚本是typescript写的，我已经删了，你想看可以自己F12看js版本，不带混淆的。  


本工具提供主要几种情况下B站投稿封面以及标题展示的效果预览。  
本工具适合在电脑浏览器上使用，预览效果仅供参考，以B站实际展示为准。  
B站视频封面必须是 jpg 或 png 格式的图片，文件不大于 5MB，封面比例是 16:10 ，建议尺寸是 1146x717，最低尺寸是 960x600，恕不提供裁剪的功能，比例错误的图片会拉伸。  

<div>
    选择你的封面文件：<input type="file" accept="image/jpeg, image/jpg, image/png" id="uploadimg">
    <br>
    你也可以在本页面 ctrl+V 使用剪贴板图片。
    <br>
    视频标题：<input type="text" maxlength="250" id="videotitle" value="你的视频 就在这里" style="width: 400px;">
    <br>
    <input type="radio" name="bgtype" value="app" checked="checked">APP首页推荐
    <input type="radio" name="bgtype" value="appsub">APP订阅页面
    <br>
    <input type="radio" name="bgtype" value="websub">网页动态
    <input type="radio" name="bgtype" value="websub2">网页动态2
    <input type="radio" name="bgtype" value="webspace">网页个人空间
    <br><br>
    <canvas id="drawing" width="600" height="576"></canvas>
    <script src="/js/bilibilicoverpreview.js"></script>
</div>
