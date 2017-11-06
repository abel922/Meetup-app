import * as firebase from 'firebase'

export default {
  state: {
    user: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.firebaseKeys[id] = payload.firebaseKey
    },
    unregisterUserForMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.firebaseKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, firebaseKey: data.key})
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.firebaseKeys) {
        return
      }
      const firebaseKey = user.firebaseKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(firebaseKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserForMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    signUpUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.uid,
                registeredMeetups: [],
                firebaseKeys: {}
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
    },
    signInUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            firebaseKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    logginOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: [], firebaseKeys: {}})
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
          .then(data => {
            const values = data.val()
            let registeredMeetups = []
            let swappedValues = {}
            for (let key in values) {
              registeredMeetups.push(values[key])
              swappedValues[values[key]] = key
            }
            const updatedUser = {
              id: getters.user.id,
              registeredMeetups: registeredMeetups,
              firebaseKeys: swappedValues
            }
            commit('setLoading', false)
            commit('setUser', updatedUser)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
