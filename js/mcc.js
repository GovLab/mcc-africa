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
      teamData: [],
      aboutData: [],
      timelineData: [],
      fadeData: [],
      timeline_description: [],
      apiURL: 'https://directus.thegovlab.com/mcc-africa',

    }
  },

  created: function created() {
    this.fetchIndex();
    this.fetchChallenge();
    this.fetchTeam();
    this.fetchAbout();
    this.fetchTime();
    this.fetchFadetext();
    
 
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
    fields: ['*.*','city_challenge.*','city_challenge.city_challenge_id.*','city_challenge.city_challenge_id.image.data.*','city_team.people_id.*','city_team.people_id.image.data.*']
  }
).then(data => {
  data.data[0].city_team.sort(function(a, b) {
    var textA = a.people_id.name.toUpperCase();
    var textB = b.people_id.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

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

  self.challengeData = data.data;
})
.catch(error => console.error(error));
    },
    fetchTeam() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'people',
  {
    fields: ['*.*']
  }
).then(data => {

  data.data.sort(function(a, b) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

  self.teamData = data.data;
  
})
.catch(error => console.error(error));
    },
    fetchAbout() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'about',
  {
    fields: ['*.*']
  }
).then(data => {
  
  self.aboutData = data.data;
})
.catch(error => console.error(error));
    },
    fetchTime() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'timeline',
  {
    fields: ['*.*']
  }
).then(data => {

  self.timelineData = data.data;
  this.default_timeline_description();
})
.catch(error => console.error(error));
    },
    fetchFadetext() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

      client.getItems(
  'fadetext',
  {
    fields: ['*.*']
  }
).then(data => {

  self.fadeData = data.data;
})
.catch(error => console.error(error));
    },
    show_description(index){
      index=index+1;
      var id_index="timeline";
      id_index=id_index.concat(index);
      console.log(id_index);
      var element = document.getElementById(id_index);
      element.classList.toggle("active");
      self.timeline_description = self.timelineData.filter(date_item => date_item.order == index);

    },
    default_timeline_description(){
      self.timeline_description = self.timelineData.filter(date_item => date_item.active == true);
      
      // var id_index="timeline";
      // var index=self.timeline_description[0].order;
      // id_index=id_index.concat(index);
      // console.log(id_index);
      // var element_test = document.getElementById(id_index);
      // console.log(element_test);
      // element_test.classList.toggle("active");
      
    }
}
});


