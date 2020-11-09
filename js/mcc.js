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

// Vue.use(Vuetify);
Vue.use(VueMeta);

new Vue({

  el: '#home-page',

  data: function () {

    return {
      indexData: [],
      challengeData: [],
      teamData: [],
      aboutData: [],
      timelineData: [],
      fadeData: [],
      timeline_description: [],
      updateData: [],
      commsData: [],
      apiURL: 'https://directus.thegovlab.com/mcc-africa',

    }
  },

  created: function () {
    this.fetchIndex();
    this.fetchChallenge();
    this.fetchTeam();
    this.fetchAbout();
    this.fetchTime();
    this.fetchUpdates();
    this.fetchComms();
    this.fetchFadetext();


  },
  methods: {

    fetchIndex: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

  //     client.getItems(
  // 'cities',
  // {
  //   fields: ['*.*','city_challenge.*','city_challenge.city_challenge_id.*','city_challenge.city_challenge_id.image.data.*','city_team.people_id.*','city_team.people_id.image.data.*']
  // }
axios.get('https://directus.thegovlab.com/mcc-africa/items/cities?fields=*.*,city_challenge.*,city_challenge.city_challenge_id.*,city_challenge.city_challenge_id.image.data.*,city_team.people_id.*,city_team.people_id.image.data.*').then( function(data) {

  data.data.data[0].city_team.sort(function(a, b) {
    var textA = a.people_id.name.toUpperCase();
    var textB = b.people_id.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

  self.indexData = data.data.data;
  console.log(self.indexData);
})
.catch( function(error){ console.error(error);})},
    fetchChallenge: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

  //     client.getItems(
  // 'challenge',
  // {
  //   fields: ['*.*']
  // }
axios.get('https://directus.thegovlab.com/mcc-africa/items/challenge?fields=*.*').then( function(data) {

  self.challengeData = data.data.data;
})
.catch( function(error){ console.error(error);})},
    fetchTeam: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

  //     client.getItems(
  // 'people',
  // {
  //   fields: ['*.*']
  // }
axios.get('https://directus.thegovlab.com/mcc-africa/items/people?fields=*.*').then( function(data) {

  data.data.data.sort(function(a, b) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

  self.teamData = data.data.data;

})
.catch( function(error){ console.error(error);})},
    fetchAbout: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

  //     client.getItems(
  // 'about',
  // {
  //   fields: ['*.*']
  // }
axios.get('https://directus.thegovlab.com/mcc-africa/items/about?fields=*.*').then( function(data) {
  console.log(data);
  self.aboutData = data.data.data;
})
.catch( function(error){ console.error(error);})},
    fetchTime: function(){
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

//       client.getItems(
//   'timeline',
//   {
//     fields: ['*.*']
//   }
// ).then(function(data) {
axios.get('https://directus.thegovlab.com/mcc-africa/items/timeline?fields=*.*').then( function(data) {
  self.timelineData = data.data.data;
  self.default_timeline_description();
})
.catch( function(error){ console.error(error);})},
    fetchFadetext: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

//       client.getItems(
//   'fadetext',
//   {
//     fields: ['*.*']
//   }
// ).then(function(data) {
axios.get('https://directus.thegovlab.com/mcc-africa/items/fadetext?fields=*.*').then( function(data) {

  self.fadeData = data.data.data;
})
.catch( function(error){ console.error(error);})},
    fetchUpdates: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

//       client.getItems(
//   'updates',
//   {
//     fields: ['*.*']
//   }
// ).then(function(data) {
axios.get('https://directus.thegovlab.com/mcc-africa/items/updates?fields=*.*').then( function(data) {

  self.updateData = data.data.data;
})
.catch( function(error){ console.error(error);})},
    fetchComms: function() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "mcc-africa",
        storage: window.localStorage
      });

//       client.getItems(
//   'communications',
//   {
//     fields: ['*.*']
//   }
// ).then(function(data) {
axios.get('https://directus.thegovlab.com/mcc-africa/items/communications?fields=*.*').then( function(data) {
  self.commsData = data.data.data;
})
.catch( function(error){ console.error(error);})},
    show_description: function(index){
      index=index+1;
      var id_index="timeline";
      id_index=id_index.concat(index);

      var element = document.getElementById(id_index);
      element.classList.toggle("active");
      self.timeline_description = self.timelineData.filter(function(date_item){ return date_item.order == index});

    },
    default_timeline_description: function(){
      self.timeline_description = self.timelineData.filter(function(date_item){ return date_item.active == true});

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


