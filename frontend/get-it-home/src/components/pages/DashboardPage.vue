<template>
    <layout-div>
       <div class="row justify-content-md-center">
         <div class="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Get It Home</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <a class="nav-link active" aria-current="page" href="/bot">Bot</a>
                            <a class="nav-link" href="/products">Products</a>
                        </div>
                    </div>
                    <div class="d-flex">
                         <ul class="navbar-nav">
                             <li class="nav-item">
                                 <a @click="logoutAction()" class="nav-link " aria-current="page" href="#">Logout</a>
                             </li>
                         </ul>
                     </div>
                </div>
            </nav>
             <h2 class="text-center mt-5">Welcome, {{user?.name}}!</h2  >
         </div>
       </div>
    </layout-div>
</template>
   
<script>
 import axios from 'axios';
 import LayoutDiv from '../LayoutDiv.vue';
   
 export default {
   name: 'DashboardPage',
   components: {
     LayoutDiv,
   },
   data() {
     return {
       user: {}
     };
   },
   created() {
     this.getUser();
     console.log('dashboard')
     if(localStorage.getItem('token') == "" || localStorage.getItem('token') == null){
       this.$router.push('/')
     }else {
       this.getUser();
     }
  
   },
   methods: {
     getUser() {
         axios.get('/user', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
         .then((r) => {
            // console.log('adsasd')
            console.log(r)
            this.user = r.data.data;
            return r
         })
         .catch((e) => {
            return e
         });
     },
  
     logoutAction () {
       axios.post('/logout',{}, { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
       .then((r) => {
           localStorage.setItem('token', "")
           this.$router.push('/')
           return r
       })
       .catch((e) => {
         return e
       });
     }
  
   },
 };
</script>