const vm = new Vue({
  data:{
    plats: [],
    menu: [],
    semaine: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    refPlats: []
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
      this.refPlats = jsyaml.safeLoad(data).map(x => {
        x.max = x.max || 1
        x.count = 0
        return x
      })
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
      // console.debug(`generate menu for ${days} days`)

      // list of meals to chose from is refreshed when beginning the process
      this.plats = this.refPlats.map(x => x)
      this.menu = []

      for (let i = 0; i < days; i++){
        const dow = i % 7,
              dej = this.getPlat('dej', dow),
              diner = this.getPlat('diner', dow)

        this.menu.push({
          dow: i % 7,
          dej: dej ? dej.nom : '-- RIEN ---',
          diner: diner ? diner.nom : '-- RIEN ---'
        })
      }
    },

    // TODO: check current sublist is not empty.
    // selects a new meal for the given repas
    getPlat: function(repas, dow = 0){
      let list

      // get the right list
      if (repas === 'dej')
        list = this.dejList
      else
        list = this.dinerList

      // filter it to remove recipes not allowed on this day of the week
      list = list.filter(x => !x.dow || x.dow.includes(dow))

      if (!list || !list.length){
        console.warn(`plus de plat pour le ${repas} :(`)
        return
      }

      const idx = Math.floor(Math.random() * Math.floor(list.length))
      const plat = list[idx]

      // count number of ocurrences, remove from list when limit is reached
      if (++plat.count >= plat.max)
        this.plats = this.plats.filter(x => x != plat)

      return this.createPlat(plat)
    },

    // flesh out plat if it is generic/variable. Otherwise returns the orignal name
    createPlat: function(plat){
      const attrs = ['viande', 'legume', 'feculent', 'variante']
      const generated = { nom: plat.nom }

      attrs.forEach(attr => {
        const varList = plat[attr]
        if (Array.isArray(varList)){
          const idx = Math.floor(Math.random() * Math.floor(varList.length)),
                value = varList[idx]
          generated.nom = generated.nom.replace(`{${attr}}`, value)
        }
      })

      return generated
    },

    // replace repas in day with a random new meal
    replaceOne: function(repas, dayIdx){
      const newPlat = this.getPlat(repas, dayIdx % 7)

      if (newPlat)
        this.menu[dayIdx][repas] = newPlat.nom
    }
  }
})
