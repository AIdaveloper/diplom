<template>
    <layout-div>
         <div class="row justify-content-md-center mt-5">
             <div class="col-4">
                 <div class="card">
                     <div class="card-body">
                         <h5 class="card-title mb-4">Sign In</h5>
                         <form>
                             <p v-if="Object.keys(validationErrors).length != 0" class='text-center '><small class='text-danger' v-text="validationErrors"></small></p>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="email"
                                     class="form-label">
                                         Email address
                                 </label>
                                 <input 
                                     v-model="email"
                                     type="email"
                                     class="form-control"
                                     id="email"
                                     name="email"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="password"
                                     class="form-label">Password
                                 </label>
                                 <input 
                                     v-model="password"
                                     type="password"
                                     class="form-control"
                                     id="password"
                                     name="password"
                                 />
                             </div>
                             <div class="d-grid gap-2">
                                 <button 
                                     :disabled="isSubmitting"
                                     @click="loginAction()"
                                     type="button"
                                     class="btn btn-primary btn-block">Login</button>
                                 <p class="text-center">Don't have account? 
                                     <router-link to="/register">Register here </router-link>
                                 </p>
                             </div>
                         </form>
                     </div>
                 </div>
             </div>
         </div>
          
    </layout-div>
</template>
   
<script>
 import axios from 'axios';
 import LayoutDiv from '../LayoutDiv.vue';
   
 export default {
   name: 'LoginPage',
   components: {
     LayoutDiv,
   },
   data() {
     return {
         email:'',
         password:'',
         validationErrors:{},
         isSubmitting:false,
     };
   },
   created() {
     if(localStorage.getItem('token') != "" && localStorage.getItem('token') != null){
         this.$router.push('/main')
     }
   },
   methods: {
      loginAction(){
         this.isSubmitting = true
         let payload = {
             email: this.email,
             password: this.password,
         }
         axios.post('/auth/login', payload)
           .then(response => {
            //  console.log(response)
             localStorage.setItem('token', response.data.accessToken)
             localStorage.setItem('refreshToken', response.data.refreshToken)
             this.$router.push('/main')
             return response
           })
           .catch(error => {
             console.log(error)
             this.isSubmitting = false
            if (error.response.data.message != undefined) {
                 this.validationErrors = error.response.data.message
             }
             if (error.response.data.message != undefined) {
                 this.validationErrors = error.response.data.message
             }
             return error
           });
      }
   },
 };
</script>