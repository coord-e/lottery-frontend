import React from 'react'
import { observer } from 'mobx-react'

const LotterySelect = ({list, value, classroom, onChange}) => (
  <div className='select'>
    <select name='lotteries' value={value} onChange={e => onChange(e.target.value)}>
      {
        list
          .filter(c => c.classroom_id === Number(classroom))
          .map(c =>
            <option value={c.id}>第{c.index + 1}公演</option>
          )
      }
    </select>
  </div>
)

export default observer(LotterySelect)
