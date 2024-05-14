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
      <form class="row g-3 mt-0">
          <div class="col-md-6">
              <label for="inputBotToken" class="form-label">Bot token {{bot.token? `('${bot.token}')`:"(not set)"}}</label>
              <p v-if="Object.keys(errors.token).length != 0" class=''><small class='text-danger' v-text="errors.token"></small></p>
              <input v-model="sendBot.token" type="text" class="form-control" id="inputBotToken">
          </div>
          <div class="col-12">
              <!-- <button :disabled="isSubmittingBT" @click="sendBotToken()" 
              type="button" class="btn btn-primary">Set bot token</button> -->
              <button :disabled="isSubmittingBT" @click="sendBotToken()"
                type="button" class="btn btn-primary btn-block">Set bot token</button>
          </div>
      </form>
    </div>
    <div class="container">
      <form class="row g-3 mt-0">
          <div class="mb-3">
              <label for="inputWelcomeMessage" class="form-label">Welcome message {{bot.scenario? `('${bot.scenario[1].text}')`:"(no message)"}}</label>
              <p v-if="Object.keys(errors.msg).length != 0" class=''><small class='text-danger' v-text="errors.msg"></small></p>
              <textarea v-model="sendBot.welcomeText" class="form-control" id="inputWelcomeMessage" rows="3"></textarea>
          </div>
          <div class="col-12">
              <button :disabled="isSubmittingBWT" @click="setBotWelcomeText()" 
              type="button" class="btn btn-primary">Set welcome message</button>
          </div>
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
      user: {},
      bot: {
      token:'',
      welcomeText: ''
      },
      errors: {
        token: {},
        msg: {}
      },
      sendBot: {},
      isSubmittingBT: false,
      isSubmittingBWT: false,
    };
    },
    created() {
      this.getUser();
      this.getBot();

      this.isSubmittingBT = false
      this.isSubmittingBWT = false
      window.alert = function() {}
      if(localStorage.getItem('token') == "" || localStorage.getItem('token') == null){
        console.log('asdasddsadasadsadsadsads')
        this.$router.push('/')
      }else {
        this.getUser();
      }

    },
    methods: {
      getUser() {
          axios.get('/user', { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
          .then((r) => {
            this.user = r.data;
            return r
          })
          .catch((e) => {
            console.log(e)
            return e
          });
      },

      logoutAction () {
        axios.post('/logout',{}, { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((r) => {
            console.log(r)
            localStorage.setItem('token', "")
            this.$router.push('/')
            return r
        })
        .catch((e) => {
          return e
        });
      },

      sendBotToken(){
        this.isSubmittingBT = true
        let payload = {
            token: this.sendBot.token,
        }
        axios.post('/user/setBotToken', payload)
          .then(response => {
            // localStorage.setItem('token', response.data.token)
            this.$router.go('/bot')
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
      setBotWelcomeText(){
          this.isSubmittingBWT = true
          let payload = {
            text: this.sendBot.welcomeText,
          }
          axios.post('/user/setBotWelcomeText', payload)
          .then(response => {
            // localStorage.setItem('token', response.data.token)
            this.$router.go('/bot')
            // this.isSubmittingBWT = false
            return response
        }).catch(error => {
            this.isSubmittingBWT = false
            if (error.response.data.message != undefined) {
                  this.errors.msg = error.response.data.message
              }
              if (error.response.data.message != undefined) {
                  this.errors.msg = error.response.data.message
              }
              return error
        });
      },
      getBot(){
        axios.get('/user/getBot')
        .then((r) => {
          // console.log(r.data)
          this.bot = r.data.data;
          // console.log(this.bot)
          return r
        })
        .catch((e) => {
          console.log(e)
          return e
        });
      }
      

    },
  };
</script>