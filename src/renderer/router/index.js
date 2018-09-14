import Vue from 'vue'
import Router from 'vue-router'
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
      component: EditPage
    },
    {
      path: '/fillpage',
      name: 'fillpage',
      component: FillPage
    },
    {
      path: '/editpage',
      name: 'editpage',
      component: EditPage
    },
    {
      path: '/sheetpage',
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
