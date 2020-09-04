const vm = new Vue({
  data:{
    plats: [],
    menu: [],
    semaine: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  },
  computed: {
    dejList: function(){
      return this.plats.filter(x => !x.repas || x.repas === 'dej')
    },
    dinerList: function(){
      return this.plats.filter(x => !x.repas || x.repas === 'diner')
    }
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

    this.generate(7)
    document.getElementById('go').focus()
  },
  methods: {
    generate: function(days = 7){
      console.debug(`generate menu for ${days} days`)
      this.menu = []

      for (let i = 0; i < days; i++){
        const dej = this.getPlat('dej'),
              diner = this.getPlat('diner')

        this.menu.push({
          dow: i % 7,
          dej: dej.nom,
          diner: diner.nom
        })
      }
    },

    getPlat: function(repas){
      let list

      if (repas === 'dej')
        list = this.dejList
      else
        list = this.dinerList

      const idx = Math.floor(Math.random() * Math.floor(list.length))
      const plat = list[idx]

      this.plats = this.plats.filter(x => x != plat)

      return plat
    }
  }
})
