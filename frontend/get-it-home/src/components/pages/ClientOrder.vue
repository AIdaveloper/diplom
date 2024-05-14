
<template>
    <div class="container">
        <form action="">
            <input class="form-control" v-model="address" type="text" placeholder="Enter your address" aria-label="default input example">
            <button  @click="sendOrder()"
                      type="button" class="btn btn-primary" style="margin-left: 10px;">Confirm order</button>
        </form>
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
        address: '',
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
    // console.log(this.$route.query)
    },
    methods: {
    sendOrder(){
        axios.post('/clients/Order', {address: this.address}, { headers:{Authorization: 'Bearer ' + localStorage.getItem('clientToken')}})
        .then((r) => {
            window.Telegram.WebApp.close()
            // localStorage.setItem('token', "")
            // this.$router.push('/')
        //   this.categories = r.data.data
        //   console.log(this.categories)
            return r
        })
        .catch((e) => {
            return e  
        });
    },
    },
};
</script>