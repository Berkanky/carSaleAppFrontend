
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',name:'home', component: () => import('pages/IndexPage.vue') },
      { path:'/login',name:'login',component:()=>import('pages/login.vue')},
      { path:'/profile',name:'profile',component:()=>import('pages/profile.vue')},
      { path:'/updateSalePost/:id',props:true,name:'updateSalePost',component:()=>import('pages/updateSalePost.vue')},
      { path:'/cars',name:'cars',component:()=>import('pages/cars.vue')},
      { path:'/savedCarPosts',name:'savedCarPosts',component:()=>import('pages/savedCarPosts.vue')},
      { path:'/detailCarSalePost/:id',props:true,name:'detailCarSalePost',component:()=>import('pages/detailCarSalePost.vue')},
      { path:'/myMails/:id',props:true,name:'myMails',component:()=>import('pages/myMails.vue')}
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
