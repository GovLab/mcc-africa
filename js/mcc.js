////////////////////////////////////////
// reload page after Forward and back
///////////////////////////////////////

const TYPE_BACK_FORWARD = 2;

function isReloadedPage() {
  return performance.navigation.type === TYPE_BACK_FORWARD;
}

function main() {
  if (isReloadedPage()) {
    window.location.reload();
  }
}
main();

////////////////////////////////////////////////////////////
///// TEAM  API REQUEST ` `
////////////////////////////////////////////////////////////


Vue.use(VueMeta);

new Vue({
    
  el: '#home-page',
    
  data () {
  
    return {
      indexData: [],
      challengeData: [],
      apiURL: 'https://directus.thegovlab.com/mcc-africa',

    }
  },

  created: function created() {
    this.fetchIndex();
    this.fetchChallenge();
  },
  methods: {

    fetchIndex() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'cities',
  {
    fields: ['*.*','city_challenge.city_challenge_id.*']
  }
).then(data => {
  console.log(data)
  self.indexData = data.data;
})
.catch(error => console.error(error));
    },
    fetchChallenge() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'challenge',
  {
    fields: ['*.*']
  }
).then(data => {
  console.log(data)
  self.challengeData = data.data;
})
.catch(error => console.error(error));
    }
}
});


