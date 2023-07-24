<template>
  <q-page class="bg-dark" :style="{'height':this.$q.screen.height + 'px'}">
    <div class="container">
      <q-card
      dark
      :style="{
          'width':this.store.mobileActive ? '100%' : '1100px',
          'height':this.store.mobileActive ? `100%` : '750px'
        }"
        class="bg-white text-dark">
        <q-card-section horizontal>
          <q-img
            loading="lazy"
            spinner-color="white"
            class="col-7"
            v-if="this.store.mobileActive === false"
            :src="this.loginPagePhoto"
            style="object-fit:cover;height:750px;object-fit:cover;border-radius:4px;"
            ></q-img>
            <q-card-section class="text-center bg-dark col">
              <q-card-section class="text-center">
                <q-avatar size="150px">
                  <img :src="logo" alt="">
                </q-avatar>
              </q-card-section>
              <q-card-section>
                <q-card class="bg-grey-4 text-dark">
                  <q-card-section class=" q-pa-md">
                    <q-input
                      type="email"
                      v-model="this.userData.email"
                      standout="bg-dark text-white" color="dark" label="Email Link Authentication">
                      <template v-slot:prepend v-if="this.userData.email">
                        <q-btn icon="remove" flat color="white" v-on:click="this.userData.email = ''"></q-btn>
                      </template>
                        <template v-slot:prepend v-else-if="!this.userData.email">
                          <q-icon name="email"></q-icon>
                        </template>
                        <template v-slot:append v-if="this.userData.email">
                          <q-btn icon="send" round color="dark" v-on:click="sendEmailWithNodemailer"></q-btn>
                        </template>
                      </q-input>
                    </q-card-section>
                </q-card>
              <q-card class="bg-grey-4 text-dark q-mt-xs">
                <q-card-section horizontal class="q-pa-md">
                  <q-btn icon="login" class="col-2" flat color="dark" v-on:click="loginWithGoogle"></q-btn>
                  <q-card-section class="col">
                    <div class="text-subtitle2 text-weight-bold text-left">
                      Google Authentication
                    </div>
                  </q-card-section>
                  <q-btn icon="fa-brands fa-google" color="red" class="col-2" glossy push v-on:click="loginWithGoogle"></q-btn>
                </q-card-section>
              </q-card>
              <q-card class="bg-grey-4 text-dark q-mt-xs">
                <q-card-section class="q-pa-md" horizontal>
                  <q-btn icon="login" label="" size="" flat class="col-2"></q-btn>
                  <q-card-section class="col">
                    <div class="text-subtitle2 text-weight-bold text-left">
                      Phone Authentication
                    </div>
                  </q-card-section>
                  <q-btn icon="call" label="" size="" class="col-2" color="blue" glossy v-on:click="this.phoneActive =! this.phoneActive"></q-btn>
                </q-card-section>
                <transition-group appear enter-active-class="animated fadeInUp slower" leave-active-class="animated fadeOutUp slower">
                  <q-card-section horizontal class="q-pa-xs" v-if="!this.phoneActive">
                    <q-card-section class="col">
                      <div>
                        <q-input color="dark" standout="bg-dark text-white" label="Phone Number" v-model="this.phNo" type="number">
                          <template v-slot:before>
                            <q-btn label="+90" flat></q-btn>
                          </template>
                          <template v-slot:prepend>
                            <q-icon name="call"></q-icon>
                          </template>
                          <template v-slot:after>
                            <q-btn id="sign-in-button" v-on:click="sendOtp" label="get otp"></q-btn>
                          </template>
                        </q-input>
                        <div id="recaptcha-container"></div><br>
                        <q-input color="dark" standout="bg-dark text-white" label="OTP" v-model="this.otp">
                          <template v-slot:prepend>
                            <q-icon name="sms"></q-icon>
                          </template>
                          <template v-slot:after>
                            <q-btn label="verify" v-on:click="verifyOtp"></q-btn>
                          </template>
                        </q-input>
                        <q-btn icon="restart_alt" label="Resend OTP" v-on:click="this.sendOtp()" class="q-mt-md"></q-btn>
                      </div>
                    </q-card-section>
                  </q-card-section>
                </transition-group>
              </q-card>
              </q-card-section>

            </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <loginComp v-if="this.store.loginCompActive"/>
  </q-page>
</template>

<script>
import logo from '../images/logo.png'
import loginComp from 'src/components/loginComp.vue';
import {auth} from '../firebase/index'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import {
  createUserWithEmailAndPassword ,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail   } from "firebase/auth";
export default {
  components:{
    loginComp,
    
  },
  setup(){
    const store = useCounterStore()
    return{
      store,
      logo
    }
  },
  data:function(){
    return{
      phoneActive:false,
      loginPagePhoto:'',
      phNo: '',
      appVerifier : '',
      otp : '',
      userData:{},
      emailAuthData:{
        status:false
      },
    }
  },
  methods:{
    createDirectly(res){
      const auth = getAuth();
      const email = this.userData.email
      const password = res.data.currentCode
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
           const loginData = {
            email:user.email ?? '',
            phoneNumber:user.phoneNumber ?? '',
            online:true,
            firebaseUserId:user.uid,
            authType:'email',
            password:password
          }
          this.postUserInfoToDb(loginData)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
    sendEmailWithNodemailer(){
       const userData = {
        email:this.userData.email
      }
      axios.post(`${this.store.baseUrl}/carapp/emailLink`,userData)
        .then(res=>{
          console.log(res)
          if(res.data.alreadyIn){
            this.$q.notify({
              type:'positive',
              message:`You Already Signed Up, Try Other Authentications. (${res.data.myacc.authType})`,
              position:'right',
              timeou:7000,
              icon:'info'
            })
            console.log('already user in',res.data.myacc)
            if(res.data.alreadyIn && res.data.myacc.authType == 'email'){
              this.store.myAcc = res.data.myacc
              this.store.loginCompActive = true
              console.log('myAcc',this.store.myAcc)
              console.log(this.store.loginCompActive)
            }
            console.log(this.store.loginCompActive)
          }else if(!res.data.alreadyIn){
            this.$q.notify({
              type:'positive',
              message:'Please Check Your Email For Auth Code',
              timeout:700,
              position:'right',
              icon:'info'
            })
            this.$q.dialog({
              title: 'Email Authentication',
              message: 'Please Check your email and enter your code.',
              prompt: {
                model: this.emailAuthData.code,
                type: 'text' // optional
              },
              dark:true,
              cancel: true,
              persistent: true
            }).onOk(data => {
              if(String(res.data.currentCode) === String(data)){
                this.createDirectly(res)
              }else{
                this.$q.notify({
                  type:'negative',
                  message:'Try Again',
                  timeout:700,
                  position:'right',
                  icon:'info'
                })
              }
            }).onCancel(() => {
              // console.log('>>>> Cancel')
            }).onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    sendEmailLink(){
      if(this.userData.email){
        const actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be in the authorized domains list in the Firebase Console.
          url: 'http://localhost:8080/#/login',
          // This must be true.
          handleCodeInApp: true,
          iOS: {
            bundleId: 'com.example.ios'
          },
          android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
          },
          dynamicLinkDomain: 'http://localhost:8080/#/login'
        };
        const auth = getAuth();
        const email = this.userData.email
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
          });
      }
    },
    sendOtp() {
      let countryCode = '+90'; // india
    let phoneNumber = countryCode + this.phNo;
    //
    let appVerifier = this.appVerifier;
    //
    const auth = getAuth();
    signInWithPhoneNumber(auth,phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        //
        //alert('SMS sent');
        this.$q.notify({
          type:'positive',
          message:'SMS Sent',
          avatar:'info',
          timeout:700,
          position:'top'
        })
      })
      .catch(function(error) {
        // Error; SMS not sent
        // ...
        console.log(error)
        alert('Error! SMS not sent');
      });
},

verifyOtp() {
  let vm = this;
  let code = this.otp;
  //
  confirmationResult.confirm(code).then((result) => {
    // User signed in successfully.
    const user = result.user;
    const loginData = {
      email:user.email ?? '',
      phoneNumber:user.phoneNumber ?? '',
      online:true,
      firebaseUserId:user.uid,
      authType:'phoneNumber'
    }
    //this.$router.push({path:'/'})
    this.postUserInfoToDb(loginData)
    // ...
  }).catch((error) => {
    // User couldn't sign in (bad verification code?)
    // ...
  });
},

initReCaptcha() {
  setTimeout(() => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    }, auth);
    this.appVerifier = window.recaptchaVerifier;
  }, 1000);
},
    async loginWithPhoneNumber(){
    },
    postUserInfoToDb(loginData){
      const newData = loginData
      axios.post(`${this.store.baseUrl}/carapp/users/${loginData.firebaseUserId}/addToDb`,newData)
        .then(res=>{
          console.log(res)
          this.$router.push({path:'/'})
        })
        .catch(err=>{
          console.log(err)
        })
    },
    loginWithGoogle(){
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
           const loginData = {
            email:user.email ?? '',
            phoneNumber:user.phoneNumber ?? '',
            online:true,
            firebaseUserId:user.uid,
            authType:'google'
          }
          this.postUserInfoToDb(loginData)
          console.log(user)
        }).catch((error) => {
          console.log(error)
          // ...
        });
    },
    getRandomPhoto(){
      const API_KEY = this.store.pexelId
      const query = 'car'
      const url = `https://api.pexels.com/v1/search?query=${query}`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data from the API response
          const maxNumber = data.photos.length
          const randomNumber = Math.floor(Math.random() * maxNumber);
          console.log(data)
          const photoUrl = data.photos[randomNumber].src.large;
          console.log(photoUrl);
          if(photoUrl){
            this.loginPagePhoto = photoUrl
            console.log('loginpagephoto',this.loginPagePhoto)
          }else{
            console.log('non photo')
          }
        })
        .catch((error) => {
          // Handle any errors that occur
          console.error(error);
        });
    },
  },
  created(){
    this.initReCaptcha()
    this.getRandomPhoto()
  },
  watch:{
    emailAuthData:{
      handler(newValue,oldValue){
        if(newValue.status === true){

        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>


<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
}
.googleButtonCard{
  margin-top: 30%;
}
</style>
