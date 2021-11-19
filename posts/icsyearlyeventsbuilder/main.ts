/// <reference path="interfaces.ts" />
/// <reference path="calendar.d.ts" />

const editor = document.getElementById("editor") as HTMLTextAreaElement
const txtTail = document.getElementById("txtTail") as HTMLInputElement
const checkUseLunar = document.getElementById("checkUseLunar") as HTMLInputElement
const LunarOptions = document.getElementById("LunarOptions") as HTMLDivElement
const checkLunarTail = document.getElementById("checkLunarTail") as HTMLInputElement
const txtLunarYears = document.getElementById("txtLunarYears") as HTMLInputElement
const butDownload = document.getElementById("butDownload") as HTMLButtonElement
const txtCustomProperty = document.getElementById("txtCustomProperty") as HTMLTextAreaElement

checkUseLunar.addEventListener("change", function (this, ev) {
    LunarOptions.style.display = this.checked ? "block" : "none"
})

function ParseICSEventData(txt: string): Array<ICSYearlyEventData> {
    if (txt.length < 4) { return [] }
    txt += "\n"
    const regp = /([0-9]{1,2})-([0-9]{1,2}) +(.+?)\n/gim
    const ms = txt.matchAll(regp)
    const tail = txtTail.value.trimEnd()
    const useChineseCalendar = checkUseLunar.checked
    const useChineseCalendarTail = useChineseCalendar && checkLunarTail.checked
    const out: Array<ICSYearlyEventData> = []
    const maxDaysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const tokens: Array<string> = []
    for (const match of ms) {
        let month = parseInt(match[1])
        if (month < 1 || month > 12) {
            continue
        }
        let day = parseInt(match[2])
        if (day < 1) {
            continue
        }
        if (useChineseCalendar) {
            if (day > 30) { continue }
        } else {
            if (day > maxDaysInMonth[month]) { continue }
        }
        let title = match[3].trim()
        title += tail
        if (useChineseCalendarTail) {
            title += "（" + calendar.toChinaMonth(month) + calendar.toChinaDay(day) + "）"
        }
        const token = month.toString() + "_" + day.toString() + "_" + title
        if (tokens.includes(token)) {
            continue
        }
        const r: ICSYearlyEventData = {
            Month: month, Day: day, Title: title
        }
        out.push(r)
        tokens.push(token)
    }
    return out
}

function GetYYYYMMDDStr(y: number, m: number, d: number): string {
    const z = "0"
    return y.toString().padStart(4, z) + m.toString().padStart(2, z) + d.toString().padStart(2, z)
}

function BuildVEVENT(dt: Date, title: string, customProperties: string): string {
    let out = "BEGIN:VEVENT"
    out += "\nSUMMARY:" + title
    out += "\nDTSTART;VALUE=DATE:" + GetYYYYMMDDStr(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    dt.setDate(dt.getDate() + 1)
    out += "\nDTEND;VALUE=DATE:" + GetYYYYMMDDStr(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    if (customProperties.length > 0) {
        out += "\n" + customProperties
    }
    out += "\nEND:VEVENT"
    return out
}

butDownload.addEventListener("click", function () {
    const input = editor.value
    const evs = ParseICSEventData(input)
    if (evs.length < 1) {
        alert("一个可以识别的事件都没有")
        return
    }
    let out = "请先确认这些事件是否正确："
    const useChineseCalendar = checkUseLunar.checked
    let ChineseContinueYears = Math.round(txtLunarYears.valueAsNumber)
    const today = new Date()
    const thisYear = today.getFullYear()
    if (thisYear > 2099 || thisYear < 2000) {
        alert("你电脑时间有问题，请先校准。我只能在21世纪工作。")
        return
    }
    let finalYear = thisYear
    if (useChineseCalendar) {
        ChineseContinueYears = Math.min(Math.max(ChineseContinueYears, 1), 99)
        finalYear += ChineseContinueYears
        finalYear = Math.min(2099, finalYear)
        out += "\n农历，生成独立事件到：" + finalYear.toString() + "年"
    }
    const MaxPreviewLines = 6
    evs.forEach(function (ev, index) {
        if (index >= MaxPreviewLines) { return }
        out += "\n"
        if (useChineseCalendar) {
            out += "农历"
        }
        out += ev.Month.toString() + "月" + ev.Day.toString() + "日 " + ev.Title
    })
    if (evs.length > MaxPreviewLines) {
        out += "\n......"
    }
    out += "\n一共有 " + evs.length.toString() + " 条事件。\n点击确认即可下载"
    if (!confirm(out)) {
        return
    }
    out = "BEGIN:VCALENDAR"
    const customProperties = txtCustomProperty.value.trim()
    if (useChineseCalendar) {
        evs.forEach(function (ev) {
            let year = thisYear
            while (year <= finalYear) {
                let offsetDay = 0
                let data = calendar.lunar2solar(year, ev.Month, ev.Day, false)
                if (data == -1) {
                    offsetDay = -1
                    data = calendar.lunar2solar(year, ev.Month, ev.Day - 1, false)
                    if (data == -1) {
                        alert("出错：无法获取农历对应的公历\n农历：" + year + "年 " + ev.Month.toString() + " 月" + ev.Day.toString() + "日")
                        return
                    }
                }
                let dt = new Date(data.cYear, data.cMonth - 1, data.cDay - offsetDay)
                out += "\n" + BuildVEVENT(dt, ev.Title, customProperties)
                year += 1
            }
        })
    } else {
        evs.forEach(function (ev) {
            let dt = new Date(thisYear, ev.Month, ev.Day)
            out += "\n" + BuildVEVENT(dt, ev.Title, "RRULE:FREQ=YEARLY\n" + customProperties)
        })
    }
    out += "\nEND:VCALENDAR"
    const blob = new Blob([out])
    const anchor = document.createElement("a")
    anchor.download = "a.ics"
    anchor.href = URL.createObjectURL(blob)
    anchor.click()
})