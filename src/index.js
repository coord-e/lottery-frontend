'use strict'

import { h, app } from 'hyperapp'
import {fetchApi} from './api'

import loginStyles from './css/login.css'
import dashboardStyles from './css/dashboard.css'

const styles = {
  login: loginStyles,
  dashboard: dashboardStyles
}

const savedToken = localStorage.getItem('Token')
const state = {
  data: {
    classroom_list: [],
    lottery_list: []
  },
  submission: {
    credentials: {
      password: '',
      username: '',
      token: savedToken || '',
      status: {}
    },
    classroom: 1,
    lottery: 1
  }
}

const actions = {
  getState: () => state => state,
  submission: {
    credentials: {
      setPassword: text => ({ password: text }),
      clearPassword: () => ({ password: '' }),
      setUsername: text => ({ username: text }),
      setToken: text => {
        localStorage.setItem('Token', text)
        return { token: text }
      },
      login: () => (state, actions) => {
        fetchApi('auth/', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            password: state.password,
            username: state.username
          }
        }).then((response) => {
          const json = response.data
          if ('token' in json) {
            actions.setToken(json.token)
            actions.clearPassword()
            actions.fetchStatus()
          } else { throw Error('Invalid response returned') }
        }).catch(resp => {
          console.error(resp)
        })
      },
      logout: () => (state, actions) => actions.setToken(''),
      setStatus: status => ({status}),
      fetchStatus: () => (state, actions) => {
        fetchApi(`api/status`, {
          method: 'get',
          headers: {
            'Authorization': 'Bearer ' + state.token
          }
        })
          .then(response => {
            actions.setStatus(response.data.status)
          })
          .catch(console.error)
      }
    },
    setClassroom: id => ({classroom: id}),
    setLottery: id => ({lottery: id}),
    apply: () => (state, actions) => {
      fetchApi(`api/lotteries/${state.lottery}/apply`, {
        method: 'put',
        headers: {
          'Authorization': 'Bearer ' + state.credentials.token
        }
      })
        .then((/* response */) => {
          actions.credentials.fetchStatus()
        })
        .catch(console.error)
    }
  },
  data: {
    setLotteryList: list => ({ lottery_list: list }),
    fetchLotteryList: () => (state, actions) => {
      fetchApi('api/lotteries', {})
        .then(response => {
          actions.setLotteryList(response.data.lotteries)
        })
        .catch(console.error)
    },
    setClassroomList: list => ({ classroom_list: list }),
    fetchClassroomList: () => (state, actions) => {
      fetchApi('api/classrooms', {})
        .then(response => {
          actions.setClassroomList(response.data.classrooms)
        })
        .catch(console.error)
    }
  }
}

const LotterySelect = ({classroom}) => (state, actions) => (
  <div class={styles.dashboard.dropwrap}>
    <select name="lotteries"
      class={styles.dashboard.dropdown}
      oninput={e => actions.submission.setLottery(e.target.value)}>
      {
        state.data.lottery_list
          .filter(c => c.classroom_id === Number(classroom))
          .map(c =>
            <option value={c.id}>第{c.index + 1}公演</option>
          )
      }
    </select>
  </div>
)

const loginView = (state, actions) => (
  <div class={styles.login.container}>
    <input
      class={styles.login.text}
      autofocus
      placeholder="username"
      value={state.submission.credentials.username}
      oninput={e => actions.submission.credentials.setUsername(e.target.value)}
    />
    <input
      class={styles.login.text}
      autofocus
      autofocus
      placeholder="password"
      value={state.submission.credentials.password}
      oninput={e => actions.submission.credentials.setPassword(e.target.value)}
    />
    <div class={styles.login.buttonContainer}>
      <button class={styles.login.button} onclick={actions.submission.credentials.login}>Login</button>
    </div>
  </div>
)

const loggedinView = (state, actions) => (
  <div class={styles.dashboard.container}>
    <h1>Logged in as {state.submission.credentials.status.username}</h1>
    <button class={styles.dashboard.button} onclick={actions.submission.credentials.logout}>Logout</button>
    <h2 class={styles.dashboard.heading}>Apply</h2>
    <div class={styles.dashboard.dropwrap}>
      <select name="classrooms"
        class={styles.dashboard.dropdown}
        value={state.submission.classroom}
        oncreate={() => { actions.data.fetchClassroomList(); actions.data.fetchLotteryList(); }}
        oninput={e => actions.submission.setClassroom(e.target.value)}>
        {
          state.data.classroom_list.map(c =>
            <option value={c.id}>{c.grade} {c.name}</option>
          )
        }
      </select>
    </div>
    <LotterySelect classroom={state.submission.classroom} />
    <button class={styles.dashboard.button} onclick={actions.submission.apply}>Apply</button>
    {JSON.stringify(state.submission.credentials.status)}
  </div>
)

const view = (state /*, actions */) => (
  <div>
    {state.submission.credentials.token ? loggedinView : loginView}
  </div>
)

const main = app(state, actions, view, document.body)

const update = () => {
  const state = main.getState()
  if (state.submission.credentials.token) { main.submission.credentials.fetchStatus() }
}
update()
setInterval(update, 10000)
