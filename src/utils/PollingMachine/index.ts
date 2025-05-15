import dayjs from "dayjs"

type TimerType = 'TimeOut' | 'Interval'

/**
 * @step 定时器间隔时间(单位：毫秒)
 * @timerType 定时器类型（"TimeOut"、"Interval"）
 */
export class Timer {
  timerObj: any = null
  step: number
  timerType: TimerType
  functionList: Array<Function>
  currDate: string
  startDate: string
  endDate: string

  constructor(step: number, timerType: TimerType) {
    this.step = step
    this.timerType = timerType
    this.functionList = []
    this.currDate = dayjs(new Date()).format('YYYY-MM-DD')
    this.startDate = '09:30'
    this.endDate = '15:00'
  }

  // 定时器回调执行函数
  private callBackFun() {
    // 设置指定时间区间内刷新数据
    let currDate = dayjs(new Date()).format('HH:mm')
    console.log(currDate)
    if (this.startDate <= currDate && currDate <= this.endDate) {
      this.functionList.forEach((fun: Function) => {
        if (fun) fun()
      })
    }
  }

  // 创建定时器
  setTimer() {
    if (this.timerType == 'Interval') {
      clearInterval(this.timerObj)
      this.timerObj = setInterval(() => this.callBackFun(), this.step)
      console.log('已开启Interval定时器')
    }
    if (this.timerType == 'TimeOut') {
      clearTimeout(this.timerObj)
      this.timerObj = setTimeout(() => this.callBackFun(), this.step)
      console.log('已开启TimeOut定时器')
    }
  }

  // 添加运行的函数
  addFun(newFun: Function) {
    const findIdx = this.functionList.findIndex((i: Function) => i === newFun)
    if (findIdx == -1) {
      console.log('已加入轮询')
      this.functionList.push(newFun)
    }
  }

  // 删除运行的函数
  delFun(oldFun: Function) {
    const findIdx = this.functionList.findIndex((i: Function) => i === oldFun)
    if (findIdx != -1) {
      console.log('已退出轮询')
      this.functionList.splice(findIdx, 1)
    }
  }

  // 清除定时器
  clearTimer() {
    if (this.timerType == 'Interval') clearInterval(this.timerObj)
    if (this.timerType == 'TimeOut') clearTimeout(this.timerObj)
    console.log('定时器已清除！')
  }
}

const timer = new Timer(60000, 'Interval')

export default timer
