---
title: 我的 Ubuntu 笔记
date: 2021-10-02
tags: [杂]
---
# apt
apt-get 和 apt 是等效的。   
国内：[清华大学镜像](https://mirror.tuna.tsinghua.edu.cn/help/ubuntu/)   
包源列表文件在 /etc/apt/sources.list     
```bash
#更新：包的列表
sudo apt update
#更新全部已经安装的包，照理说这一步就会把显卡驱动自动安装上
sudo apt full-upgrade
#列出全部已经安装的包的列表
sudo apt list --installed
```

# fcitx
```bash
#需要在 /etc/environment 的最后面加上： 
GTK_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
QT_IM_MODULE=fcitx
```

# npm
```bash
sudo apt install nodejs npm
#使用阿里巴巴的NPM镜像
sudo npm config set registry https://registry.npm.taobao.org   
#安装 Typescript 编译器
sudo npm install -g typescript
```

# git ssh key 导入  
```bash
sudo apt install git
#首先把 id_rsa 文件设置为自己只读，其他用户不能访问
chmod 400 ~/.ssh/id_rsa   
#把默认的ssh key 加入到agent里
ssh-add  
```

# KVM 虚拟机
```bash
sudo apt install virt-manager qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
sudo systemctl enable libvirtd.service
sudo systemctl restart libvirtd.service
```

# 不能或者最好别从apt下载的软件
- [ThunderBird](https://www.thunderbird.net/en-US/)
- [LibreOffice](https://www.libreoffice.org/download/download/)
- [搜狗拼音](https://pinyin.sogou.com/linux/?r=pinyin)
- [Mega](https://mega.nz/sync)
- [CFW](https://github.com/Fndroid/clash_for_windows_pkg/releases)
- [Microsoft Powershell](https://github.com/PowerShell/PowerShell/releases)
- [Telegram Desktop](https://desktop.telegram.org/)
- [Hello Minecraft Launcher](https://ci.huangyuhui.net/job/HMCL/)
- [Joplin](https://joplinapp.org/download/)
- [Visual Studio Code](https://code.visualstudio.com/)

# 杂
```bash
#截图工具
sudo apt install flameshot

# Windows RDP 连接工具
sudo apt install remmina

# OPENGL 跑分工具，如果1080p跑分有2000多，说明显卡驱动安装成功了
sudo apt install glmark2
glmark2 -s 1920x1080

# AppImage 文件是可以被解压的，将文件设置为可执行之后添加这个参数即可
./xx.AppImage --appimage-extract
```
如果硬要安装官网版本的 amd gpu 驱动，需要参考两个网址： 
- [RX 5500 XT 驱动下载](https://www.amd.com/zh-hans/support/graphics/amd-radeon-5500-series/amd-radeon-rx-5500-series/amd-radeon-rx-5500-xt) 
- [Linux 21.30 驱动下载](https://www.amd.com/zh-hant/support/kb/release-notes/rn-amdgpu-unified-linux-21-30)     
