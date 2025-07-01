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
///// TEAM  OFFLINE DATA LOADING
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
      winnersData:[],
      aboutData: [],
      timelineData: [],
      fadeData: [],
      timeline_description: [],
      updateData: [],
      commsData: [],
      posterData:[],
      showDesc: false,
      index_active:0,
      dataLoaded: false,
      loading: true, // Add loading state
    }
  },

  created: function () {
    this.loadAllData();
  },
  
  methods: {

    // Load all data from local JSON files
    loadAllData: async function() {
      try {
        this.loading = true;
        await Promise.all([
          this.loadIndex(),
          this.loadChallenge(),
          this.loadTeam(),
          this.loadWinners(),
          this.loadAbout(),
          this.loadTime(),
          this.loadUpdates(),
          this.loadComms(),
          this.loadPoster(),
          this.loadFadetext()
        ]);
        
        this.dataLoaded = true;
        this.loading = false;
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    },

    // Load cities data (indexData)
    loadIndex: async function() {
      try {
        const response = await fetch('data/cities.json');
        const data = await response.json();
        
        // The API returns { "data": [...] }, so we access data.data
        this.indexData = data.data || [];
        
        // Sort city team by name (same as original) - but only if city_team exists
        if (this.indexData && this.indexData[0] && this.indexData[0].city_team) {
          this.indexData[0].city_team.sort(function(a, b) {
            var textA = a.people_id.name.toUpperCase();
            var textB = b.people_id.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
        }
        
        console.log('Cities data loaded:', this.indexData.length, 'cities');
      } catch (error) {
        console.error('Error loading cities data:', error);
        this.indexData = [];
      }
    },

    // Load challenge data
    loadChallenge: async function() {
      try {
        const response = await fetch('data/challenge.json');
        const data = await response.json();
        this.challengeData = data.data || [];
        console.log('Challenge data loaded:', this.challengeData.length, 'challenges');
      } catch (error) {
        console.error('Error loading challenge data:', error);
        this.challengeData = [];
      }
    },

    // Load team data
    loadTeam: async function() {
      try {
        const response = await fetch('data/people.json');
        const data = await response.json();
        
        // Sort by name (same as original)
        if (data.data && Array.isArray(data.data)) {
          data.data.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
        }
        
        this.teamData = data.data || [];
        console.log('Team data loaded:', this.teamData.length, 'people');
      } catch (error) {
        console.error('Error loading team data:', error);
        this.teamData = [];
      }
    },

    // Load winners data
    loadWinners: async function() {
      try {
        const response = await fetch('data/winners.json');
        const data = await response.json();
        this.winnersData = data.data || [];
        console.log('Winners data loaded:', this.winnersData.length, 'winners');
      } catch (error) {
        console.error('Error loading winners data:', error);
        this.winnersData = [];
      }
    },

    // Load about data
    loadAbout: async function() {
      try {
        const response = await fetch('data/about.json');
        const data = await response.json();
        this.aboutData = data.data || [];
        console.log('About data loaded:', this.aboutData.length, 'items');
      } catch (error) {
        console.error('Error loading about data:', error);
        this.aboutData = [];
      }
    },

    // Load timeline data
    loadTime: async function() {
      try {
        const response = await fetch('data/timeline.json');
        const data = await response.json();
        this.timelineData = data.data || [];
        this.default_timeline_description();
        console.log('Timeline data loaded:', this.timelineData.length, 'items');
      } catch (error) {
        console.error('Error loading timeline data:', error);
        this.timelineData = [];
        this.timeline_description = [];
      }
    },

    // Load fade text data
    loadFadetext: async function() {
      try {
        const response = await fetch('data/fadetext.json');
        const data = await response.json();
        this.fadeData = data.data || [];
        console.log('Fade text data loaded:', this.fadeData.length, 'items');
      } catch (error) {
        console.error('Error loading fade text data:', error);
        this.fadeData = [];
      }
    },

    // Load updates data
    loadUpdates: async function() {
      try {
        const response = await fetch('data/updates.json');
        const data = await response.json();
        this.updateData = data.data || [];
        console.log('Updates data loaded:', this.updateData.length, 'items');
      } catch (error) {
        console.error('Error loading updates data:', error);
        this.updateData = [];
      }
    },

    // Load communications data
    loadComms: async function() {
      try {
        const response = await fetch('data/communications.json');
        const data = await response.json();
        this.commsData = data.data || [];
        console.log('Communications data loaded:', this.commsData.length, 'items');
      } catch (error) {
        console.error('Error loading communications data:', error);
        this.commsData = [];
      }
    },

    // Load poster data
    loadPoster: async function() {
      try {
        const response = await fetch('data/posters.json');
        const data = await response.json();
        this.posterData = data.data || [];
        console.log('Poster data loaded:', this.posterData.length, 'items');
      } catch (error) {
        console.error('Error loading poster data:', error);
        this.posterData = [];
      }
    },

    // Timeline description methods (same as original)
    show_description: function(index){
      index=index+1;
      var id_index="timeline";
      id_index=id_index.concat(index);

      var element = document.getElementById(id_index);
      if (element) {
        element.classList.toggle("active");
      }
      
      if (this.timelineData && Array.isArray(this.timelineData)) {
        this.timeline_description = this.timelineData.filter(function(date_item){ 
          return date_item && date_item.order == index;
        });
      }
    },

    default_timeline_description: function(){
      if (this.timelineData && Array.isArray(this.timelineData) && this.timelineData.length > 0) {
        this.timeline_description = this.timelineData.filter(function(date_item){ 
          return date_item && date_item.active == true;
        });
      } else {
        this.timeline_description = [];
      }
    },

    toggleMessage (index) {
      this.index_active = index;
      this.showDesc = !this.showDesc;
      console.log(this.showDesc);
    }
  },

  // Add computed properties for safe data access
  computed: {
    // Safe access to about data
    aboutDataSafe() {
      return this.aboutData && this.aboutData.length > 0 ? this.aboutData[0] : {};
    },
    
    // Safe access to timeline description
    timelineDescriptionSafe() {
      return this.timeline_description && this.timeline_description.length > 0 ? this.timeline_description[0] : {};
    }
  }
}); 