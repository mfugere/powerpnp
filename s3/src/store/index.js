import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import Config from "aws-sdk"
import CognitoConfig from "../config.js"
import { CognitoUserPool } from "amazon-cognito-identity-js"

const instance = axios.create({
  baseURL: CognitoConfig.api.invokeUrl
})

Vue.use(Vuex, axios)

export const store = new Vuex.Store({
  state: {
    userPool: null,
    cognitoUser: null,
    authToken: null,
    account: {},
    characterEditMode: "create"
  },
  mutations: {
    setUserPool: function (state, userPool) {
      state.userPool = userPool
    },
    setCognitoUser: function (state, cognitoUser) {
      state.cognitoUser = cognitoUser
    },
    setAuthToken: function (state, authToken) {
      state.authToken = authToken
      instance.defaults.headers.common["Authorization"] = authToken
    },
    setUserAccount: function (state, account) {
      state.account = account
    },
    setCharacterEditMode: function (state, characterEditMode) {
      state.characterEditMode = characterEditMode
    }
  },
  actions: {
    async signout({ commit, state }) {
      state.cognitoUser.signOut()
      commit("setCognitoUser", null)
      commit("setAuthToken", null)
      commit("setUserAccount", {})
    },
    initUserPool({ commit }) {
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
        var authToken = (payload) ? payload.sessionToken : await dispatch("getSession", { cuser: cognitoUser })
        commit("setAuthToken", authToken)
        var result = await dispatch("getAccount", { cuser: cognitoUser })
        commit("setUserAccount", result.data.Item)
        return result.data.Item
      } else return {}
    },
    getSession(context, payload) {
      return payload.cuser.getSession((error, session) => {
        if (error) throw new Error(error)
        else if (!session.isValid()) return null
        else return session.getIdToken().getJwtToken()
      })
    },
    async createAccount(context, payload) {
      await instance.post("/account", {
        data: payload.username
      }).catch(function (error) {
        throw new Error(error)
      })
    },
    async getAccount(context, payload) {
      return await instance.get("/account?username=" + payload.cuser.username)
    },
    async updateCharacter(context, payload) {
      return await instance.post("/character", {
        data: payload.cname
      }).catch(function (error) {
        throw new Error(error)
      })
    }
  }
})
