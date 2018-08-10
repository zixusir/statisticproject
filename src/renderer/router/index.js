import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      // component: require('@/components/LandingPage').default
      component: MainPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
