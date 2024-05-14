<template>
    <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Weight</th>
                <th scope="col">Count</th>
                <th scope="col">Price</th>
                <th scope="col">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in order.orderProducts" :key="itemIndex">
                <td>
                  {{ itemIndex + 1}}
                </td>
                <td>
                  {{ item.product.name}}
                </td>
                <td>
                  {{ item.product.weight}}
                </td>
                <td>
                  {{ item.product_count}}
                </td>
                <td>
                  {{ item.product.price}}
                </td>
                <td>
                  {{ Number(item.product.price) * Number(item.product_count) }}
                </td>
              </tr>
            </tbody>
          </table>
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
        order_id: null,
        order: {}
     };
   },
   created() {
    const query = this.$route.query
    if (query.id) {
        this.order_id = query.id
        // localStorage.setItem('clientToken', query.token)
    } else {
        this.$router.back()
    }
    this.getOrder(this.order_id)
   },
   methods: {
     getOrder(id) {
         axios.get(`/user/Order/${id}`)
         .then((r) => {
            // console.log('adsasd')
            console.log(r.data.data.orderProducts)
            this.order = r.data.data;
            return r
         })
         .catch((e) => {
            return e
         });
     }
  
   },
 };
</script>