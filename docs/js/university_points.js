"use strict";
var Question = (function() {
    function Question(title, max) {
        this.Choices = [];
        this.Title = title;
        this.MaxScore = max;
    }
    Question.prototype.AddChoice = function(title, score) {
        var a = {
            Index: this.Choices.length,
            Title: title,
            Score: score,
            Input: null
        };
        this.Choices.push(a);
        return this;
    };
    Question.prototype.GetAnswer = function() {
        var i = 0;
        for (i = 0; i < this.Choices.length; i++) {
            var c = this.Choices[i];
            if (c.Input != null) {
                if (c.Input.checked) {
                    return c;
                }
            }
        }
        return null;
    };
    Question.prototype.GetScore = function() {
        var c = this.GetAnswer();
        if (c == null) {
            return -1;
        }
        return c.Score * this.MaxScore;
    };
    return Question;
}());
var AllQuestions = [];

function AddQuestion(title, max) {
    var q = new Question(title, max);
    AllQuestions.push(q);
    return q;
}

function GetMaxScore() {
    var s = 0;
    var i = 0;
    for (i = 0; i < AllQuestions.length; i++) {
        var q = AllQuestions[i];
        s += q.MaxScore;
    }
    return s;
}

function CalcScores() {
    var s = 0;
    var i = 0;
    for (i = 0; i < AllQuestions.length; i++) {
        var q = AllQuestions[i];
        var c = q.GetScore();
        if (c < 0) {
            return -i - 1;
        }
        s += c;
    }
    s = Math.floor(s / GetMaxScore() * 100);
    return s;
}
AddQuestion("你的大学要求全部或部分学生上晚自习（晚上上课）吗？", 60)
    .AddChoice("上晚自习，且只能学习指定科目", 0).AddChoice("上晚自习，不能看课外内容", 0.3).AddChoice("上晚自习，可完全自由选择学习内容", 0.7).AddChoice("不用上晚自习", 1);
AddQuestion("你的大学允许学生携带或使用自己的电脑或笔记本吗？", 60)
    .AddChoice("所有学生不能带电脑", 0).AddChoice("少数学生可以带电脑", 0.2).AddChoice("多数学生可以带电脑", 0.6).AddChoice("所有学生可以带电脑", 1);
AddQuestion("你的大学允许学生在校内的课余时间玩电子游戏吗？", 60)
    .AddChoice("学生不准课后玩游戏", 0).AddChoice("学生课后可以玩游戏", 1);
AddQuestion("你的大学允许学生上课使用手机吗？", 20)
    .AddChoice("上课可以合理使用手机", 1).AddChoice("上课不准碰手机", 0);
AddQuestion("你的大学需要学生积攒足够的素拓分才能毕业吗？", 90)
    .AddChoice("需要素拓分", 0).AddChoice("不需要素拓分", 1);
AddQuestion("你的大学毕业需要特别要求吗？（如学会游泳，学会开车，学会太极拳，背下校本，创新学分）", 90)
    .AddChoice("毕业需要附加条件", 0).AddChoice("简单毕业", 1);
AddQuestion("你的大学体育是否需要学生经常跑步打卡？", 30)
    .AddChoice("每次跑步打卡需要跑1.5km及以上", 0).AddChoice("每次跑步打卡需要跑1.5km以下", 0.2).AddChoice("不需要跑步打卡", 1);
AddQuestion("你的大学军训多少天？", 90)
    .AddChoice("不军训", 1).AddChoice("军训1-8天", 0.8).AddChoice("军训16天左右", 0.5).AddChoice("军训25天左右", 0.2).AddChoice("军训30天及以上", 0);
AddQuestion("你的大学需要学生办理“校门一张卡，食堂一张卡，图书馆一张卡，宿舍一张卡”吗？", 20)
    .AddChoice("需要办卡0-2张", 1).AddChoice("需要办卡3张或者更多", 0);
AddQuestion("你的大学各层级需要学生关注很多微信公众号吗？", 20)
    .AddChoice("需要关注3个以上公众号", 0).AddChoice("需要关注1-3个公众号", 0.6).AddChoice("不需要关注公众号", 1);
AddQuestion("你的大学各层级需要学生安装各种APP吗？", 20)
    .AddChoice("需要安装3个以上APP", 0).AddChoice("需要安装1-3个APP", 0.6).AddChoice("不需要安装APP", 1);
AddQuestion("你的大学需要学生上报自己的网络账号吗？（如微博、推特账号）", 60)
    .AddChoice("需要上报社交账号", 0).AddChoice("不需要上报社交账号", 1);
AddQuestion("你的大学要穿校服吗？", 60)
    .AddChoice("要穿校服", 0).AddChoice("不用穿校服", 1);
AddQuestion("你的大学限制头发的发型吗？", 60)
    .AddChoice("头发不能太长，不准染发", 0).AddChoice("不限制发型", 1);
AddQuestion("你的大学有安排全部或部分学生进行早晨集体广播体操式锻炼吗？", 30)
    .AddChoice("没有晨练", 1).AddChoice("每周一次晨练", 0.2).AddChoice("每天一次晨练", 0);
AddQuestion("你的大学有安排全部或部分学生进行晨读吗？", 60)
    .AddChoice("没有晨读", 1).AddChoice("要晨读，可以自由选择学习内容", 0.5).AddChoice("要晨读，指定学习内容", 0);
AddQuestion("你的大学有强迫学生参加运动会等活动吗？", 60)
    .AddChoice("强迫参加活动", 0).AddChoice("不强迫参加活动", 1);
AddQuestion("你的大学有校园暴力出现吗？", 100)
    .AddChoice("有校园暴力还不管", 0).AddChoice("有校园暴力但是管的很严", 0.6).AddChoice("没有校园暴力", 1);
AddQuestion("你的大学老师有出现喜欢让学生当工具人吗？", 90)
    .AddChoice("不会把学生当工具人", 1).AddChoice("把学生当工具人但给钱", 0.6).AddChoice("把学生当工具人却无合理报酬", 0);
AddQuestion("你的大学老师有出现故意让学生挂科吗？", 60)
    .AddChoice("老师故意让学生挂科", 0).AddChoice("老师不会故意让学生挂科", 1);
AddQuestion("你的大学允许校内学生骑自行车、电动车、摩托车吗？", 30)
    .AddChoice("允许学生骑车", 1).AddChoice("学生不准骑车", 0);
AddQuestion("你的大学平时对学生封闭式管理吗？", 60)
    .AddChoice("包括周末没有请假条不能出校", 0).AddChoice("只有周末可以自由进出学校", 0.2).AddChoice("不上课都可以自由进出学校", 1);
AddQuestion("你的大学内的市场物价高于校外周边的物价吗？", 20)
    .AddChoice("校内物价更高", 0).AddChoice("校内物价更低", 1).AddChoice("校内外物价一样", 0.6);
AddQuestion("你大学内部供学生消费的各种设施（如KTV 健身房 理发店 超市 奶茶店）齐全吗？", 20)
    .AddChoice("校内有很多店面，每种店面有多家品牌", 1).AddChoice("校内每种店面只有一两家", 0.6).AddChoice("校内消费很单调", 0);
AddQuestion("你大学周围供学生消费的各种设施（如KTV 健身房 理发店 超市 奶茶店）齐全吗？", 20)
    .AddChoice("校外附近有很多店面，每种店面有多家品牌", 1).AddChoice("校外附近每种店面只有一两家", 0.6).AddChoice("校外店面很少", 0);
AddQuestion("你的大学学生寝室水电费高于校外周边的水电费吗？", 20)
    .AddChoice("寝室水电费高", 0).AddChoice("校内外水电费一样高", 0.2).AddChoice("寝室水电费低", 0.8).AddChoice("寝室不收水电费", 1);
AddQuestion("你的大学学生寝室单间标准人数是多少？", 60)
    .AddChoice("寝室1-2人间", 1).AddChoice("寝室3-4人间", 0.6).AddChoice("寝室5-6人间", 0.2).AddChoice("寝室一间住7个人还多", 0);
AddQuestion("你的大学强制学生在学校宿舍住宿吗？", 60)
    .AddChoice("强制住校", 0).AddChoice("不强制住校", 1);
AddQuestion("你的大学需要学生晚上在寝室里打卡吗？", 60)
    .AddChoice("每晚都需要拍照定位打卡", 0).AddChoice("每晚都需要接受点名检查", 0).AddChoice("通常不需要就寝检查", 1);
AddQuestion("你的大学的学生寝室允许学生申请换寝室吗？", 60)
    .AddChoice("可以申请换寝室", 1).AddChoice("很难申请换寝室", 0);
AddQuestion("你的大学的学生寝室学生使用的厕所是怎么样的？", 60)
    .AddChoice("好的独立卫生间", 1).AddChoice("烂的独立卫生间", 0.6).AddChoice("只有公共厕所，但是很干净", 0.6).AddChoice("只有很脏的公共厕所", 0);
AddQuestion("你的大学的寝室学生使用的浴室（可以兼独立卫生间）是怎么样的？", 60)
    .AddChoice("好的独立浴室", 1).AddChoice("烂的独立浴室", 0.6).AddChoice("只能去公共浴室洗澡，但是很干净", 0.6).AddChoice("只能去很糟的公共浴室洗澡", 0);
AddQuestion("你的大学的寝室学生使用的空调设备是怎么样的？", 75)
    .AddChoice("需要付空调租金和电费", 0.2).AddChoice("只需要付空调电费", 0.8).AddChoice("只需要付空调租金", 0.8).AddChoice("寝室没有空调", 0).AddChoice("气候好，不需要空调", 1).AddChoice("空调不用钱免费开", 1);
AddQuestion("你的大学的寝室学生使用的网络设备是怎么样的？", 75)
    .AddChoice("学生自由选择宽带和路由器", 1).AddChoice("只能使用指定宽带和指定路由器", 0.6).AddChoice("没有有线网络，有公用WIFI", 0.2).AddChoice("寝室里只能流量上网", 0);
AddQuestion("你的大学的学生寝室多久面临一次检查？", 60)
    .AddChoice("每天查一次寝室", 0).AddChoice("每周1-3次查寝", 0.2).AddChoice("不经常查寝", 1);
AddQuestion("你的大学的学生寝室检查的时候会检查多仔细？", 60)
    .AddChoice("检查卫生，同时搜查柜子里和抽屉里", 0).AddChoice("检查卫生，要求地上不能有一根毛", 0.2).AddChoice("检查卫生，无异味无垃圾即可", 1).AddChoice("不检查卫生", 1);
AddQuestion("你的大学的学生寝室会定期断电吗？", 60)
    .AddChoice("寝室每天的定时断电", 0).AddChoice("寝室特定时期要定时断电", 0.2).AddChoice("寝室不会无故断电", 1);
var testDiv = document.getElementById("testcontent");
if (testDiv == null) {
    throw "testcontent div is null.";
}
var verinfo = document.createElement("span");
verinfo.innerText = "自测表版本：v1.4";
testDiv.appendChild(verinfo);
var i = 0;
var j = 0;
for (i = 0; i < AllQuestions.length; i++) {
    var q = AllQuestions[i];
    var div = document.createElement("div");
    var title = document.createElement("span");
    title.innerText = (i + 1).toString() + ". " + q.Title;
    div.appendChild(title);
    div.appendChild(document.createElement("br"));
    var _loop_1 = function() {
        var div2 = document.createElement("div");
        var c = q.Choices[j];
        var choice = document.createElement("span");
        choice.innerText = c.Title;
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "question" + (i + 1).toFixed();
        input.className = "choiceoption";
        c.Input = input;
        input.addEventListener("click", function(ev) {});
        choice.style.marginRight = "20px";
        choice.addEventListener("click", function(ev) {
            input.checked = true;
        });
        div2.appendChild(input);
        div2.appendChild(choice);
        div2.style.display = "inline-block";
        div.appendChild(div2);
    };
    for (j = 0; j < q.Choices.length; j++) {
        _loop_1();
    }
    div.style.marginTop = "20px";
    testDiv.appendChild(div);
}
testDiv.appendChild(document.createElement("br"));
var NameSpan = document.createElement("span");
NameSpan.innerText = "请输入你大学的名字（可以乱写）：";
testDiv.appendChild(NameSpan);
var NameInput = document.createElement("input");
NameInput.type = "text";
NameInput.style.width = "250px";
testDiv.appendChild(NameInput);
testDiv.appendChild(document.createElement("br"));
var button = document.createElement("button");
button.innerText = "点我计算分数";
testDiv.appendChild(button);
var scores = document.createElement("h2");
scores.innerText = "_";
scores.style.display = "block";
testDiv.appendChild(scores);
var outputs = document.createElement("div");
testDiv.appendChild(outputs);
button.addEventListener("click", function(ev) {
    if (testDiv == null) {
        throw "testdiv is null!";
    }
    outputs.remove();
    outputs = document.createElement("div");
    outputs.style.fontWeight = "bold";
    outputs.style.maxWidth = "400px";
    testDiv.appendChild(outputs);
    if (NameInput.value.length < 1) {
        scores.innerText = "请先输入你们大学的名字";
    } else {
        var s = CalcScores();
        if (s >= 0) {
            AllQuestions.sort(function(a, b) {
                var av = a.GetScore();
                var bv = b.GetScore();
                if (av > bv) {
                    return 1;
                }
                if (av < bv) {
                    return -1;
                }
                return 0;
            });
            for (i = 0; i < AllQuestions.length; i++) {
                var q = AllQuestions[i];
                var c = q.GetAnswer();
                if (c != null) {
                    var span = document.createElement("span");
                    span.innerText = c.Title;
                    span.style.marginRight = "20px";
                    span.style.display = "inline-block";
                    span.style.marginTop = "5px";
                    span.setAttribute("vv", q.GetScore().toFixed());
                    if (c.Score <= 0.1) {
                        span.style.backgroundColor = "#ffbfbf";
                    } else {
                        if (c.Score < 0.5) {
                            span.style.backgroundColor = "#fff55f";
                        } else {
                            if (c.Score < 0.9) {
                                span.style.backgroundColor = "#deffb5";
                            } else {
                                span.style.backgroundColor = "#80fb88";
                            }
                        }
                    }
                    outputs.appendChild(span);
                }
            }
            scores.innerText = "最终分数：" + s.toString();
        } else {
            s = -s;
            scores.innerText = "还有未完成的题目，请检查第 " + s.toString() + " 题！";
        }
    }
});

function RandomUniversity() {
    var i = 0;
    var options = document.getElementsByClassName("choiceoption");
    for (i = 0; i < options.length; i++) {
        var input = options[i];
        var r = Math.random();
        if (r > 0.2) {
            input.checked = true;
        }
    }
}