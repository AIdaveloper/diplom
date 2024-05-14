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
             <!-- <h2 class="text-center mt-5">Welcome, {{user?.name}}!</h2  > -->
         </div>
       </div>
    </layout-div>
    <div class="container">
      <div>
        <h2 style="width: fit-content; padding: 5px;" class="card" data-bs-toggle="collapse" href="#categoryCollapse" role="button" aria-expanded="false" aria-controls="collapseExample" >Categories</h2>
      </div>
      <div class="collapse " id="categoryCollapse">
        <div class="card card-body">
          <form action="form-inline">
            <input v-model="createCategoryName" class="sr-onl" type="text" placeholder="Input category name">
            <button :disabled="isSubmittingBT" @click="createCategory()"
              type="button" class="btn btn-primary" style="margin-left: 10px;">Create category</button>
          </form>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in categories" :key="itemIndex">
                <td>
                  {{ itemIndex + 1}}
                </td>
                <td>
                  {{ item.name}}
                </td>
                <td>
                  <p type="button" class="btn btn-danger" @click="deleteCategory(item.id)">Delete</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <div>
        <h2 style="width: fit-content; padding: 5px;" 
          class="card" data-bs-toggle="collapse" 
          href="#productsCollapse" role="button" 
          aria-expanded="false" aria-controls="collapseExample" >
          Products</h2>
      </div>
      <div class="collapse " id="productsCollapse">
        <div class="card card-body">
          <form action="form-inline">
            <input v-model="createProductForm.name" class="sr-onl" type="text" style="width: 100px;" required placeholder="Name">
            <input v-model="createProductForm.weight" class="sr-onl" type="number" style="width: 80px; margin-left: 5px;" required placeholder="Weight">
            <input v-model="createProductForm.count" class="sr-onl" type="number" style="width: 80px; margin-left: 5px;" required placeholder="count">
            <select  v-model="createProductForm.category_id" class="custom-select mr-sm-2 sr-onl" style="width: 180px; height: 30px; margin-left: 5px;" required>
              <option value="" disabled selected>Choose category</option>
              <option v-for="category in categories" v-bind:value="category.id" >{{ category.name }}</option>
            </select>
            <input @change="createProductForm.files = $event.target.files" multiple type="file" class="form-control-file" style="width: 80px; margin-left: 5px;" id="exampleFormControlFile1">
            <input v-model="createProductForm.price" class="sr-onl" type="number" style="width: 80px; margin-left: 5px;" required placeholder="price">
            <button :disabled="isSubmittingBT" @click="createProduct()"
              type="button" class="btn btn-primary" style="margin-left: 10px;">Create product</button>
          </form>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Weight</th>
                <th scope="col">Count</th>
                <th scope="col">Categoty</th>
                <th scope="col">Price</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in products" :key="itemIndex">
                <td>
                  {{ itemIndex + 1}}
                </td>
                <td>
                  {{ item.name}}
                </td>
                <td>
                  {{ item.weight}}
                </td>
                <td>
                  {{ item.count}}
                </td>
                <td>
                  {{ categoryName(item.category_id)}}
                </td>
                <td>
                  {{ item.price}}
                </td>
                <td>
                  <a type="button" class="btn btn-primary" :href="baseURL+'image/'+item.image_link">image</a>
                </td>
                <td>
                  <router-link type="button" class="btn btn-primary" :to="{path:`/product/${item.id}`}">Edit</router-link>
                </td>
                <td>
                  <p type="button" class="btn btn-danger" @click="deleteProduct(item.id)">Delete</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <div>
        <h2 style="width: fit-content; padding: 5px;" 
        class="card" data-bs-toggle="collapse" href="#deliveryCollapse" 
        role="button" aria-expanded="false" aria-controls="collapseExample" >
        Delivery</h2>
      </div>
      <div class="collapse " id="deliveryCollapse">
        <div class="card card-body">
          <form action="form-inline">
            <input v-model="createDeliveryName" class="sr-onl" type="text" placeholder="Input delivery name">
            <button :disabled="isSubmittingBT" @click="createDelivery()"
              type="button" class="btn btn-primary" style="margin-left: 10px;">Create delivery</button>
          </form>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in deliveries" :key="itemIndex">
                <td>
                  {{ itemIndex + 1}}
                </td>
                <td>
                  {{ item.name}}
                </td>
                <td>
                  <p type="button" class="btn btn-danger" @click="deleteCategory(item.id)">Delete</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container">
      <div>
        <h2 style="width: fit-content; padding: 5px;" 
        class="card" data-bs-toggle="collapse" href="#orderCollapse" 
        role="button" aria-expanded="false" aria-controls="collapseExample" >
        Orders</h2>
      </div>
      <div class="collapse " id="orderCollapse">
        <div class="card card-body">
          <!-- <form action="form-inline">
            <input v-model="createDeliveryName" class="sr-onl" type="text" placeholder="Input delivery name">
            <button :disabled="isSubmittingBT" @click="createDelivery()"
              type="button" class="btn btn-primary" style="margin-left: 10px;">Create delivery</button>
          </form> -->
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">client_id</th>
                <th scope="col">delivery_id</th>
                <th scope="col">address</th>
                <th scope="col">status</th>
                <th scope="col">view</th>
                <th scope="col">apply</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in orders" :key="itemIndex">
                <td>
                  {{ itemIndex + 1}}
                </td>
                <td>
                  {{ item.client_id}}
                </td>
                <td>
                  {{ item.delivery_id || 'none'}}
                </td>
                <td>
                  {{ item.address}}
                </td>
                <td>
                  {{ item.status}}
                </td>
                <td>
                  <a type="button" class="btn btn-primary" :href="origin+`/order?id=${item.id}`">View</a>
                  <!-- <router-link type="button" class="btn btn-primary" :to="{path:`/order?id=${item.id}`}">View</router-link> -->
                </td>
                <td>
                  
                  <form action="form-inline">
                    <select  v-model="changeOrder[`status${item.id}`]" class="custom-select mr-sm-2 sr-onl" style="width: 180px; height: 30px; margin-left: 5px;" required @change="changeLocation">
                      <option value="" disabled selected>Choose status</option>
                      <option v-for="category in ['prepare', 'cooking', 'wating', 'delivery', 'delivered']" v-bind:value="category" >{{ category }}</option>
                    </select>
                    <select  v-model="changeOrder[`delivery_id${item.id}`]" class="custom-select mr-sm-2 sr-onl" style="width: 180px; height: 30px; margin-left: 5px;" required @change="changeLocation">
                      <option value="" disabled selected>Choose delivery</option>
                      <option v-for="delivery in deliveries" v-bind:value="delivery.id" >{{ delivery.name }}</option>
                    </select>
                    <button  @click="changeOrderStatus(item.id)"
                      type="button" class="btn btn-primary" style="margin-left: 10px;">Change status</button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
        user: {},
        products: [],
        categories: [],
        deliveries: [],
        orders: [],
        baseURL: axios.defaults.baseURL,
        origin: window.location.origin,
        createCategoryName: '',
        createDeliveryName: '',
        createProductForm: {
          category: ''
        },
        changeOrder: {
          status: '',
          delivery: null
        },
        image: ''
      };
    },
    created() {
      this.getUser();
      this.getProducts();
      this.getCategories();
      this.getDeliveries();
      this.getOrders()
      // console.log(window.location.origin)
      if(localStorage.getItem('token') == "" || localStorage.getItem('token') == null){
      //  this.$router.push('/')
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
      },

      getProducts(){
        axios.get('/user/getAllProducts')
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.products = r.data.data
            // console.log(this.products)
            return r
        })
        .catch((e) => {
            return e  
        });
      },
      getCategories(){
        axios.get('/user/getCategories')
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.categories = r.data.data
            // console.log(this.products)
            return r
        })
        .catch((e) => {
            return e  
        });

      },
      getOrders(){
        axios.get('/user/getOrders')
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.orders = r.data.data
            console.log('orders')
            console.log(this.orders)
            return r
        })
        .catch((e) => {
            return e  
        });

      },
      getDeliveries(){
        axios.get('/user/getDeliveries')
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.deliveries = r.data.data
            console.log(this.deliveries)
            return r
        })
        .catch((e) => {
            return e  
        });

      },
      categoryName(id){
        for (let i of this.categories){
          if (i.id == id) return i.name
        }
        return id
      },
      createCategory(){
        let payload = {
            name: this.createCategoryName,
        }
        axios.post('/user/createCategory', payload)
          .then(response => {
            this.createCategoryName = ''
            this.getCategories()
            return response
        }).catch(error => {
            this.isSubmittingBT = false
            if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              return error
        });

      },
      createDelivery(){
        let payload = {
            name: this.createDeliveryName,
        }
        axios.post('/user/createDelivery', payload)
          .then(response => {
            this.createDeliveryName = ''
            this.getDeliveries()
            return response
        }).catch(error => {
            if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              return error
        });

      },
      createProduct(){
        let payload = this.createProductForm
        let v = new FormData()
        Object.keys(payload).map(k => {v.append(k, payload[k])})
        v.append("uploadedFiles",  this.createProductForm.files[0]) 
        console.log(this.createProductForm.files)
        axios.post('/user/createProduct', v)
          .then(response => {
            this.createProductForm = {}
            this.getProducts()
            return response
        }).catch(error => {
            this.isSubmittingBT = false
            if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              return error
        });
      },
      deleteProduct(id){
        axios.delete(`/user/deleteProduct/${id}`)
        .then((r) => {
            this.getProducts()
            return r
        })
        .catch((e) => {
            return e  
        });

      },
      deleteCategory(id){
        axios.delete(`/user/deleteCategory/${id}`)
        .then((r) => {
            this.getCategories()
            return r
        })
        .catch((e) => {
            return e  
        });
        createProductForm.file
      },
      previewFiles( event ){
        console.log(event.target.files);
        this.image = event.target.files;
      },
      changeOrderStatus(id){
        let payload = {status:this.changeOrder[`status${id}`], delivery_id: this.changeOrder[`delivery_id${id}`], order_id: id}
        axios.post('/user/setOrderStatus', payload)
          .then(response => {
            this.changeOrder = {}
            this.getOrders()
            return response
        }).catch(error => {
            if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              if (error.response.data.message != undefined) {
                  this.errors.token = error.response.data.message
              }
              return error
        });

      }

    },
 };
</script>