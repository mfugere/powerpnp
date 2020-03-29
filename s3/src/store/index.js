import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import Config from "aws-sdk"
import CognitoConfig from "../config.js"
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js"

Vue.use(Vuex, axios)

export const store = new Vuex.Store({
  state: {
    userPool: null,
    currentUser: {}
  },
  mutations: {
    setUserPool: function (state, userPool) {
      state.userPool = userPool
    },
    setCurrentUser: function (state, currentUser) {
      state.currentUser = currentUser
    },
    setCognitoUser: function (state, cognitoUser) {
      state.currentUser.cognitoUser = cognitoUser
    },
    setAuthToken: function (state, authToken) {
      state.currentUser.authToken = authToken
    },
    setUserAccount: function (state, account) {
      state.currentUser.account = account
    }
  },
  actions: {
    async createAccount(context, payload) {
      await axios.post(CognitoConfig.api.invokeUrl + "/account", {
        data: payload.username
      }).catch(function (error) {
        console.error(error)
      })
    },
    async login({ dispatch, state }, payload) {
      var authenticationDetails = new AuthenticationDetails({
        Username: payload.username,
        Password: payload.password
      })
      var cognitoUser = new CognitoUser({ Username: payload.username, Pool: state.userPool })
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (session) {
          dispatch("initUser", { sessionToken: session.getIdToken().getJwtToken() })
        },
        onFailure: function (err) {
          console.error(err)
        }
      })
    },
    async signout({ commit, state }) {
      state.currentUser.cognitoUser.signOut()
      commit("setCurrentUser", {})
    },
    async initUserPool({ commit }) {
      var poolData = {
        UserPoolId: CognitoConfig.cognito.userPoolId,
        ClientId: CognitoConfig.cognito.userPoolClientId
      }
      var userPool = new CognitoUserPool(poolData)
      if (typeof Config !== "undefined") {
        Config.region = CognitoConfig.cognito.region
      }
      commit("setUserPool", userPool)
      return userPool
    },
    async initUser({ dispatch, commit, state }, payload) {
      var cognitoUser = state.userPool.getCurrentUser()
      if (cognitoUser) {
        commit("setCognitoUser", cognitoUser)
        if (!payload) {
          return dispatch("getSession", { cuser: cognitoUser }).then((authToken) => {
            commit("setAuthToken", authToken)
            return dispatch("getAccount", { cuser: cognitoUser, token: authToken }).then((account) => {
              commit("setUserAccount", account)
              return state.currentUser
            })
          })
        } else {
          commit("setAuthToken", payload.sessionToken)
          return dispatch("getAccount", { cuser: cognitoUser, token: payload.sessionToken }).then((account) => {
            commit("setUserAccount", account)
            return state.currentUser
          })
        }
      } else return {}
    },
    async getSession(context, payload) {
      return payload.cuser.getSession(function (err, session) {
        if (err) {
          console.error(err)
          return null
        } else if (!session.isValid()) return null
        else {
          return session.getIdToken().getJwtToken()
        }
      })
    },
    async getAccount(context, payload) {
      return await axios.get(CognitoConfig.api.invokeUrl + "/account?username=" + payload.cuser.username,
        { headers: { "Authorization": payload.token }}).then((result) => {
          return result.data.Item
        }).catch((error) => {
          console.error(error)
          return null
        })
    }
  }
})
