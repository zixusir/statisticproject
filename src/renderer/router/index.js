import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import FillPage from '@/components/FillPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainpage',
      component: MainPage
    },
    {
      path: '/fillpage',
      name: 'fillpage',
      component: FillPage
    }
  ]
})
