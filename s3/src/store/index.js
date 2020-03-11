import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userPool: null,
    currentUser: null
  },
  getters: {
    loggedIn: function (state) {
      if (state.currentUser) {
        return state.currentUser.getSession(function (err, session) {
          if (err) {
            console.error(err)
            return false
          } else if (!session.isValid()) return false
          else return true
        })
      } else {
        return false
      }
    }
  },
  mutations: {
    setUserPool: function (state, userPool) {
      state.userPool = userPool
    },
    setCurrentUser: function (state, currentUser) {
      state.currentUser = currentUser
    }
  }
})
