import { ApplicationObject } from '../application'
import { Store } from '../../store'

describe('events', () => {
  describe('ApplicationObject', () => {
    let event

    beforeEach(() => {
      event = new ApplicationObject(new Store())
    })

    it('fetches lists in constructor', () => {
      expect(event.store.application.classroomList.length).not.toBe(0)
      expect(event.store.application.lotteryList.length).not.toBe(0)
    })

    it('changes classroom', () => {
      event.onChangeClassroom(2)
      expect(event.store.application.classroom).toBe(2)
    })

    it('changes lottery', () => {
      event.onChangeLottery(2)
      expect(event.store.application.lottery).toBe(2)
    })

    it('adds a group member', async () => {
      await event.onAddGroupMember('secret_id')
      expect(event.store.application.groupMemberList).toEqual([['secret_id', 'ABCD']])
    })

    it('can\'t add group member when there is already 3', async () => {
      await event.onAddGroupMember('secret_id1')
      await event.onAddGroupMember('secret_id2')
      await event.onAddGroupMember('secret_id3')

      await event.onAddGroupMember('secret_id4')
      expect(event.store.error.errorList).toHaveLength(1)
      expect(event.store.application.groupMemberList).toHaveLength(3)
    })

    it('removes a group member', async () => {
      await event.onAddGroupMember('secret_id', 'public_id')
      event.onRemoveGroupMember(0)
      expect(event.store.application.groupMemberList).toEqual([])
    })

    it('applies to lottery', async () => {
      await event.onApply()
      const applications = event.store.credential.status.get('application_history')
      expect(applications).toBeDefined()
    })

    it('cancels lottery', async () => {
      await event.onCancel()
      const applications = event.store.credential.status.get('application_history')
      expect(applications).toBeDefined()
    })

    it('logouts on apply when used by staff', async () => {
      Object.defineProperty(event.store.credential, 'isUsedByStaff', {
        get: () => true
      })
      await event.onApply()
      expect(event.store.credential.isLoggedIn).toBe(false)
    })

    it('logouts on cancel when used by staff', async () => {
      Object.defineProperty(event.store.credential, 'isUsedByStaff', {
        get: () => true
      })
      await event.onCancel()
      expect(event.store.credential.isLoggedIn).toBe(false)
    })
  })
})
