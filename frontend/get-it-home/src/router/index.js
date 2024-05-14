import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import 'bootstrap/dist/css/bootstrap.css';
// import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/pages/LoginPage';
import RegisterPage from '../components/pages/RegisterPage';
import DashboardPage from '../components/pages/DashboardPage';
import Bot from '../components/pages/Bot';
import Products from '../components/pages/Products';
import ProductsPreview from '../components/pages/PreviewProducts';
import ClientPage from '../components/pages/Client';
import OrderPage from '../components/pages/DisplayOrder'
import ClientOrder from '../components/pages/ClientOrder'

const routes = [
  { 
    path: '/', 
    component: LoginPage },
  { 
    path: '/register', 
    component: RegisterPage },
  { 
    path: '/main', 
    component: DashboardPage },
  { 
    path: '/bot', 
    component: Bot },
  { 
    path: '/products', 
    component: Products },
  { 
    path: '/productsPreview', 
    component: ProductsPreview 
  },
  { 
    path: '/client', 
    component: ClientPage 
  },
  { 
    path: '/order', 
    component: OrderPage 
  },
  { 
    path: '/clientOrder', 
    component: ClientOrder 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
