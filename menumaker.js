const vm = new Vue({
  data:{
    plats: [],
    menu: [],
    semaine: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
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

      for (let i = 0; i < days; i++){
        const idx1 = Math.floor(Math.random() * Math.floor(this.plats.length))
        const idx2 = Math.floor(Math.random() * Math.floor(this.plats.length))
        this.menu.push({
          dow: i % 7,
          dej: this.plats[idx1],
          diner: this.plats[idx2]
        })
      }
    }
  }
})
