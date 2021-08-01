// 原文 @橙雨伞微博 https://weibo.com/5939213490/K8LAJeZsa
class Question {
    constructor(text: string) {
        let me = this
        this.Text = text
        this.Li = document.createElement("li")
        this.Input = document.createElement("input")
        this.Input.type = "checkbox"
        this.Span = document.createElement("span")
        this.Span.style.fontSize = "20px"
        this.Span.style.marginBottom = "4px"
        this.Span.innerText = text
        this.Li.appendChild(this.Input)
        this.Li.appendChild(this.Span)
        this.Span.addEventListener("click", function () {
            me.Input.click()
        })
        this.Input.addEventListener("input", function () {
            if (this.checked) {
                me.Span.style.color = "red"
                me.Span.style.fontWeight = "bold"
            } else {
                me.Span.style.color = "black"
                me.Span.style.fontWeight = ""
            }
        })
    }
    Text: string
    Li: HTMLLIElement
    Input: HTMLInputElement
    Span: HTMLSpanElement
}

const tests = document.getElementById("questions") as HTMLDivElement
tests.innerText = ""

const Olist = document.createElement("ol")
tests.appendChild(Olist)

const output = document.createElement("p")
tests.appendChild(output)

const mainDiv = document.getElementsByTagName("main")[0] as HTMLDivElement
mainDiv.style.display = "block"

const AllQuestions: Question[] = []

function RefreshOutput() {
    let checks = 0
    AllQuestions.forEach(function (v) {
        if (v.Input.checked) {
            checks += 1
        }
    })
    let str = ""
    if (checks > 0) {
        str = "你已经选择了：" + checks.toFixed() + " 项。"
        if (checks > 3) {
            str += "\n你所处的关系可能存在潜在危险，或者你已经受到了一定的伤害。\n如果有需要，请积极寻求帮助。"
        } else {
            str += "\n这可能是合理范围，但请你谨慎考虑。"
        }
    } else {
        str = "你一项都没有选择。希望你真的很安全，也很幸福。"
    }
    output.innerText = str
}

function AddQuestion(t: string): Question {
    let q = new Question(t)
    AllQuestions.push(q)
    q.Input.addEventListener("input", RefreshOutput)
    Olist.appendChild(q.Li)
    return q
}

// 01-05
AddQuestion("TA令你感受到不适、害怕、不安全或恐惧")
AddQuestion("TA常常贬低取笑你，或令你感到没有价值、低自尊")
AddQuestion("TA总是记录和追踪你的一切活动。TA会时刻监控你去哪里、和谁在一起。TA会试图禁止或阻止你去见朋友、家人，甚至阻止你去上班、上学")
AddQuestion("TA要求你秒回TA的信息、邮件和来电，并且命令你与TA共享你所有社交媒体账号、邮件和其他账户的密码")
AddQuestion("TA会不断怀疑和指控你出轨")

// 06-10
AddQuestion("TA会尝试控制你所有的经济支出，或者控制你的必需药物、节育药物的服用")
AddQuestion("TA会控制你所有的决定，包括你每天吃什么或穿什么")
AddQuestion("TA总是命令你、要求你做事")
AddQuestion("TA通过羞辱你的外貌、智力或兴趣来贬低你")
AddQuestion("TA会通过在外人面前破坏你的财物、财产，或伤害你在意的人事物，以此来羞辱你")

// 11-15
AddQuestion("TA总是处于愤怒或暴躁状态的状态，所以你不知道什么时候会激怒TA")
AddQuestion("TA会责怪你，说因为你做错事情，TA才发怒和动手")
AddQuestion("TA会对你实施身体上的暴力，或威胁要伤害你，甚至是威胁伤害TA自己和其他你的家庭成员，包括小孩和宠物")
AddQuestion("TA故意让你的孩子看见、听见TA对你的威胁或施暴，甚至是伤害你的孩子")
AddQuestion("TA会以失去孩子的抚养权、或抢走孩子来威胁你")

// 16-23
AddQuestion("TA会伤害你的身体，包括但不限于殴打、掐喉、捶打、推揉、拉扯、拳击、打耳光、踢踹或咬人")
AddQuestion("TA可能会破坏其他的物品来威胁你，TA会砸坏东西、毁坏或移除残障设施、禁锢或者威胁驾驶以恐吓你")
AddQuestion("TA会威胁使用伤害性工具、武器对付你")
AddQuestion("TA可能对你实施性暴力，包括强奸或其他强迫性性行为")
AddQuestion("TA会给你压力、威迫或哄骗你去做某些你不愿意发生的与性有关的行为")
AddQuestion("TA可能错误地认为过去对性行为的同意意味着你将来必须参与相同的行为")
AddQuestion("TA还可能错误地认为同意一项活动意味着同意增加亲密感。例如，TA可能会认为每次亲吻都会导致性爱")
AddQuestion("如果你扬言要结束关系，TA会威胁、恐吓你，扬言要殴打、伤害你")

