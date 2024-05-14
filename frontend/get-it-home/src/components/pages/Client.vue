
<template>
  <div class="container" style="align-items: center; display: flex; flex-direction: column " >
  <button type="button" class="btn btn-primary" style="position: fixed; bottom: 0;width: 800px; z-index: 99999;" @click="order()">Order. Price : {{ coast }}p</button>

    <div class="btn-group" role="group" aria-label="Basic radio toggle button group" style="margin: 20px 0;">
      
      <!-- <input type="radio" class="btn-check" name="btnradio" id="btnradio0" autocomplete="off" checked>
      <label class="btn btn-outline-primary" for="btnradio0">All</label>

      <input type="radio" class="btn-check" name="btnradio" :id="'btnradio'+v" autocomplete="off" v-for="(i, v) in categories">
      <label class="btn btn-outline-primary" :for="'btnradio'+vv" v-for="(iv, vv) in categories">{{ iv.name }}</label> -->
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4" >
      <div class="col " style="width: 400px;" v-for="(item, itemIndex) in displayProducts" :key="itemIndex">
        <div class="card h-100">
          <div class="card-img-top" style="max-width: 100%; width: fit-content; height: 200px; display: flex; justify-content: center;">
            <img :src="baseUrl+'image/'+item.image_link" class="card-img-top" style="max-width: 100%; max-height: 100%;  height: auto;" alt="...">
          </div>
          <div class="card-body">
            <h5 class="card-title">{{item.name}}</h5>
            <p class="card-text">category: {{ categoryName(item.category_id) || "no name" }}</p>
            <p class="card-text">weight: {{ item.weight }}</p>
            <p class="card-text">price: {{ item.price }}p</p>
            <div class="inline">
              <button type="button" class="btn btn-primary" :name="'numberInput'+itemIndex"  onclick="document.getElementById(this.name).stepDown(); document.getElementById(this.name).dispatchEvent(new Event('input', { 'bubbles': true }))">-</button>
              <input type="number" v-model="addProducts[item.id]" :name="'numberInput'+itemIndex" :id="'numberInput'+itemIndex" :value="addProducts[item.id]||0" @input="limitInput($event.target, item.count);addProductsChange(item.id, $event.target.value)" min="0" 
              :max="item.count" 
              style="height: 40px; margin-left: 5px; margin-right: 5px;">
              <button type="button" class="btn btn-primary" :name="'numberInput'+itemIndex"  onclick="document.getElementById(this.name).stepUp(); document.getElementById(this.name).dispatchEvent(new Event('input', { 'bubbles': true }))">+</button>
              <!-- <button type="button" class="btn btn-primary" @click="conso">+</button> -->
            </div>
            
          </div>
        </div>
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
        products: {},
        categories: {},
        addProducts: {},
        displayProducts: {},
        coast: 0,
        baseUrl: axios.defaults.baseURL
     };
   },
   created() {
    // this.displayProducts = this.products
    const query = this.$route.query
    if (query.token) {
        localStorage.setItem('clientToken', query.token)
    }
    this.getProducts(true)
    this.getCategories()
    // console.log(this.$route.query)
   },
   methods: {
      getProducts(is = false){
        axios.get('/clients/Products', { headers:{Authorization: 'Bearer ' + localStorage.getItem('clientToken')}})
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.products = r.data.data
            if(is){
              this.displayProducts = this.products
            }
            console.log(this.products)
            return r
        })
        .catch((e) => {
            return e  
        });
      },
      getCategories(){
        axios.get('/clients/Categories', { headers:{Authorization: 'Bearer ' + localStorage.getItem('clientToken')}})
        .then((r) => {
            // localStorage.setItem('token', "")
            // this.$router.push('/')
            this.categories = r.data.data
            console.log(this.categories)
            return r
        })
        .catch((e) => {
            return e  
        });
      },
      categoryName(id){
        if (!Object.keys(this.categories).length) return 'no name'
        for (let i of this.categories){
          if (i.id == id) return i.name
        }
        return 'no name'
        return id
      },
      getProduct(id){
        // if (!Object.keys(this.products).length) return 'no name'
        console.log(this.products)
        for (let i of this.products){
          if (i.id == id) {
            // console.log(i)
            return i}
        }
        // return 'no name'
        return null
      },
      limitInput(target, limit){
        // console.log(target.value)
        if (target.value > limit){
          target.value = limit
        }
        if (target.value < 0 || target.value == '' ){
          target.value = 0
        }
      },
      addProductsChange(id, count){
        if (count == 0){
          delete this.addProducts[id]
        } else {
          this.addProducts[id] = Number(count)
        }
        let t = Number(0)
        Object.keys(this.addProducts).map(c=>t+=Number(this.addProducts[c])*Number(this.getProduct(c).price))
        // console.log(t)
        this.coast = t
        // console.log(this.addProducts)
      },
      async order(){
        for(let k of Object.keys(this.addProducts)){
          const product = this.getProduct(Number(k))
          await axios.post('/clients/Basket',{product_id: product.id, count:Number(this.addProducts[k])}, { headers:{Authorization: 'Bearer ' + localStorage.getItem('clientToken')}})
          .then((r) => {

              // localStorage.setItem('token', "")
              this.$router.push('/clientOrder')
              // this.categories = r.data.data
              // console.log(this.categories)
              return r
          })
          .catch((e) => {
              return e  
          });
        }
      }
   },
 };
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>