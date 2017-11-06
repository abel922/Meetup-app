import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import * as firebase from 'firebase'
import { store } from './store'
import DateFilter from './filters/date'
import AlertComponent from './components/Shared/Alert.vue'
import EditMeetupDate from './components/Meetup/Edit/EditMeetupDate.vue'
import EditMeetupTime from './components/Meetup/Edit/EditMeetupTime.vue'
import EditMeetup from './components/Meetup/Edit/EditMeetup.vue'
import Register from './components/Meetup/Registration/Register.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertComponent)
Vue.component('app-edit-meetup', EditMeetup)
Vue.component('app-edit-meetup-date', EditMeetupDate)
Vue.component('app-edit-meetup-time', EditMeetupTime)
Vue.component('app-meetup-register', Register)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCCIqmkSAEsh_7Mnu6IuLuygdcheXn_IUc',
      authDomain: 'appmeetup-eb082.firebaseapp.com',
      databaseURL: 'https://appmeetup-eb082.firebaseio.com',
      projectId: 'appmeetup-eb082',
      storageBucket: 'gs://appmeetup-eb082.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
