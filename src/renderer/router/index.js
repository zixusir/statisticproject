import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import FillPage from '@/components/FillPage'
import EditPage from '@/components/EditPage'
import SheetPage from '@/components/SheetPage'
import NetPage from '@/components/NetPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomePage
    },
    {
      path: '/fillpage/:datafile?',
      name: 'fillpage',
      component: FillPage
    },
    {
      path: '/editpage/:datafile?',
      name: 'editpage',
      component: EditPage
    },
    {
      path: '/sheetpage/:datafile?',
      name: 'sheetpage',
      component: SheetPage
    },
    {
      path: '/netpage',
      name: 'netpage',
      component: NetPage
    }
  ]
})
