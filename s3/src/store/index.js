import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userPool: null,
    currentUser: null,
    authToken: ""
  },
  getters: {
    loggedIn: function (state) {
      if (state.currentUser) {
        return state.currentUser.getSession(function (err, session) {
          if (err) {
            console.error(err)
            return null
          } else if (!session.isValid()) return false
          else return session.getIdToken().getJwtToken()
        })
      } else {
        return null
      }
    }
  },
  mutations: {
    setUserPool: function (state, userPool) {
      state.userPool = userPool
    },
    setCurrentUser: function (state, currentUser) {
      state.currentUser = currentUser
    },
    setAuthToken: function (state, authToken) {
      state.authToken = authToken
    }
  }
})
