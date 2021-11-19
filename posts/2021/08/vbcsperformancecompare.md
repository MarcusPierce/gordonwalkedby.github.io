---
title: VB与C#的性能粗略对比
date: 2021-08-28
tags: [.net]
---
今天闲来无事，写了一些代码来测试 Visual Basic .NET 和 C# 之间的性能差异。   

先说一下，我水平不高，不懂高级或者说深度的分析，只会简单写点测试用的代码，然后看看运行时间。   
测试的源代码在 [github](https://github.com/gordonwalkedby/VBCSperformanceCompare)   

我以前一直认为他们两个应该实际上没有什么性能差异，直到我看了我自己亲手做出来的测试结果，我只能说微软真有你的（   

戈登一共设计了5个测试：   
第一个测试：相同的API调用，计算20000以内的ULong质数，主要是`Mod`取余（C# 是`%`符号）运算。   
运行5次，给出总用时。   

第二个测试：相同的API调用，读取同一个120MB左右的文件，Buffer 大小都是1024 Byte，不需要存储，直接读取到末尾。    
运行5次，给出总用时。   

第三个测试：相同的API调用，使用同样的种子初始化一个 Random。   
生成一个 0-255 之间的 `Int32`，然后转换到 `Byte` ，再到 `Int64`，再到 `UInt32`，再到 `Single`，再到 `Int16`，再到 `Double`。   
每一步转换都是原值的 `toString()` 被目标类型 `Parse()` 之后生成。   
重复以上运作654321次，并把每次的结果Append到同一个StringBuilder 后，输出总用时。    

第四个测试：和测试三相同的转换流程，只是每步转换的操作都是强制显示转换。   
比如，在C#里是 `(int)p1`，在VB里是 `CInt(p1)`。  

第五个测试：按从早到晚的顺序把1900年1月1日到2900年1月1日这之间的每一天的Date值格式化到字符串，目标格式为：`yyyy年MM月dd日`，并且在这个字符串的后面加对应的 DayOfWeek 个空格。   
准备一个空字符串，把每次新生成的字符串添加到这个准备好的字符串的后面。   
每当组合起来的字符串的长度大于1000的时候，就只保留字符串末尾的500个字符，删去前面的内容。    
结束后，输出总用时。    
而在这个测试中，C# 直接使用 String 数值类型，VB 要尽可能使用 [Microsoft.VisualBasic](https://docs.microsoft.com/zh-cn/dotnet/visual-basic/language-reference/runtime-library-members) 命名空间里的函数。   

下面是两次测试结果，一次是我自己的电脑，一次是 [github Actions](https://github.com/gordonwalkedby/VBCSperformanceCompare/actions) 帮我测试的：   
单位是毫秒，相比值是VB的用时除以C#的用时的百分比。   
![](https://z3.ax1x.com/2021/08/28/h3YEND.png)   
我跑了多次测试，得到的结果基本上就是图中这样。   

测试1的VB花了几乎三倍于C#的时间才完成。   
我看了一下 ILSPY 反编译出来的代码，发现 vb 的`If v Mod p = 0 Then`被翻译成了：   
`if (decimal.Compare(new decimal(v % p), 0m) == 0)`    
哇草，这么转换数字类型，能不慢吗？？？     
而且测试1速度差距的比例在 .NET 5 和 .NET Framework 4.8 上差不多，说明在语言的内部设计上，微软一直保留了VB的这种弱势或者说缺点。   

测试2、测试3和测试4，VB 和 C# 的用时基本一致。   
IO、数据类型转换应该问题不大（    

测试5主要是看看那些从 VB6 继承来的函数到二十多年后的今天跑的怎么样。   
虽然 [Microsoft.VisualBasic](https://docs.microsoft.com/zh-cn/dotnet/visual-basic/language-reference/runtime-library-members) 应该只是二次封装，但是没有想到在 .NET Framework 上性能居然还可以反超 C# 用 `System` 的代码。  
在 .NET Core 早期版本里，VB 的命名空间下几乎没有几个函数，现在丰富起来之后性能反而下落了。（那你tm就不能干脆别恢复这个命名空间吗   
![](https://z3.ax1x.com/2021/08/28/h31Ui9.png)    

从整体上来看，VB的性能和C#比只是略有损失。   
但是从代码能跑的地方来看，VB只能跑个桌面端，微软把web端和移动端的新技术好东西全部给 C# 了，VB成了一个勉强兼容的产物（   

替VB哭哭。   
