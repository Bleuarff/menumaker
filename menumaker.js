const vm = new Vue({
  data:{
    plats: [],
    menu: [],
    semaine: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  },
  watchers: {
    // dejList:
  },
  created: async function(){
  },
  mounted: async function(){
    const res = await fetch('data/plats.yml'),
          data = await res.text()

    try{
      this.plats = jsyaml.safeLoad(data)
    }
    catch(ex){
      alert('Erreur au chargement des données')
      console.error(ex)
    }

    document.getElementById('go').focus()
  },
  methods: {
    generate: function(days){
      this.menu = []

      const dejList = this.plats.filter(x => !x.repas || x.repas === 'dej')
      const dinerList = this.plats.filter(x => !x.repas || x.repas === 'diner')

      for (let i = 0; i < days; i++){
        const idxDej = Math.floor(Math.random() * Math.floor(dejList.length))
        const idxDiner = Math.floor(Math.random() * Math.floor(dinerList.length))
        this.menu.push({
          dow: i % 7,
          dej: dejList[idxDej].nom,
          diner: dinerList[idxDiner].nom
        })
      }
    },

    getPlat: function(idx){
      
    }
  }
})
