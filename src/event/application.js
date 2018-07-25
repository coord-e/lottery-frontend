import {applyLottery, cancelLottery} from '../api/operation'

export class ApplicationObject {
  constructor (store) {
    this.store = store
    this.onUpdate()
  }

  onUpdate = async () => {
    await Promise.all([
      this.store.application.fetchClassroomList(),
      this.store.application.fetchLotteryList()
    ])
  }

  onChangeClassroom = (classroom) => {
    this.store.application.setClassroom(classroom)
  }

  onChangeLottery = (lottery) => {
    this.store.application.setLottery(lottery)
  }

  onApply = async () => {
    await applyLottery(this.store.application.lottery, this.store.credential.token)
    await this.store.fetchStatus()
  }

  onCancel = async (id) => {
    await cancelLottery(id, this.store.credential.token)
    await this.store.fetchStatus()
  }
}
