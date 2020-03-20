import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import CognitoConfig from "../config.js"

Vue.use(Vuex, axios)

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
    },
    setUserAccount: function (state, account) {
      state.currentUser.account = account
    },
    signout: function(state, currentUser) {
      state.currentUser = currentUser
      state.authToken = ""
    }
  },
  actions: {
    async createAccount(context, data) {
      await axios.post(CognitoConfig.api.invokeUrl + "/account", {
        data: data.username
      }).catch(function (error) {
        console.error(error)
      })
    },
    async getAccount({ commit, state }) {
      var currentUser = state.currentUser
      await axios.get(CognitoConfig.api.invokeUrl + "/account?username=" + currentUser.username,
        { headers: { "Authorization": state.authToken }}).then(function (result) {
          commit("setUserAccount", result.data.Item)
        }).catch(function (error) {
          console.error(error)
        })
    }
  }
})
