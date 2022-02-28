const app = new Vue({
  el: "#app",
  data: {
    pageTypes: [
      { text: "Página de inicio", value: "HOME" },
      { text: "Inicio de sesión", value: "SESSION_START" },
      { text: "Mapa web", value: "WEB_MAP" },
      { text: "Contacto", value: "CONTACT" },
      { text: "Ayuda", value: "HELP" },
      { text: "Legal", value: "LEGAL" },
      { text: "Servicio/Proceso", value: "SERVICE" },
      { text: "Búsqueda", value: "SEARCH" },
      {
        text: "Declaración de accesibilidad",
        value: "ACCESSIBILITY_DECLARATION",
      },
      { text: "Mecanismo de comunicación", value: "COMMUNICATION_MECHANISM" },
      { text: "Página tipo", value: "TYPICAL_PAGE" },
      { text: "Otras páginas", value: "OTHER" },
      { text: "Aleatoria", value: "ALEATORY" },
      { text: "Documento descargable", value: "DOWNLOADABLE_DOC" },
    ],
    siteName: "",
    siteDomain: "",
    indice: null,
    inUrl: "",
    inType: "",
    inShortName: "",
    inBreadcrumb: "",
    siteWebPages: [],
    editMode: false,
  },
  mounted() {
    ///TODO obtener los datos de local storage

    //Recuperar datos guardados desde archivo
    /*     try {
      this.siteName = savedSite[0].siteName;
      this.siteDomain = savedSite[0].siteDomain;
      this.siteWebPages = [...savedSite[0].siteWebPages];
    } catch (error) {
      console.log('No existen datos guardados');
    } */

    try {
      const savedLocal = localStorage.getItem("saved-site");
      const parsed = JSON.parse(savedLocal);
      this.siteName = parsed[0].siteName;
      this.siteDomain = parsed[0].siteDomain;
      this.siteWebPages = [...parsed[0].siteWebPages];
      //console.log('this.siteWebPages :>> ', this.siteWebPages);
    } catch (error) {
      console.log("No hay datos");
    }
  },
  methods: {
    loadSite() {
      /******************TODO: función para cargar un json guardado******************* */
      try {
        this.siteName = savedSite[0].siteName;
        this.siteDomain = savedSite[0].siteDomain;
        this.siteWebPages = [...savedSite[0].siteWebPages];
      } catch (error) {
        console.log("No existen datos guardados");
      }
    },
    /*******
     * Organiza urlList
     */
    orden() {
      const ordered = [];
      this.pageTypes.forEach((pageType) => {
        this.siteWebPages.map((page) => {
          if (page.webPageType == pageType.value) {
            ordered.push(page);
          }
        });
      });
      this.siteWebPages = ordered;
      this.saveSite();
    },
    /**
     * GUARDAR TRABAJO EN LOCALSTORAGE
     */
    saveSite() {
      //convertir la lista de url en un blob
      const parsed = JSON.stringify(this.urlList);
      localStorage.setItem("saved-site", parsed);
      /*
      const jsonBlob = new Blob([parsed]);     
      const blobUrl = URL.createObjectURL(jsonBlob); //crear una url que apunte al json    
      const link = document.createElement('a'); //crea un enlace
      link.href = blobUrl; //apunta el enlace al json
      link.download = 'saved_site.js';     
      document.body.appendChild(link); //añade el link al body

      //despacha un evento click en el link
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: false,
          cancelable: false,
          view: window,
        }));
        bPreguntar = false;
      
      document.body.removeChild(link); //elimina el link del body
      */
    },

    /***
     * RESET
     * Borrado de los datos del sitio
     */
    reset() {
      const borrar = confirm("Se van a borrar los datos");
      if (borrar) {
        this.siteName = "";
        this.siteDomain = "";
        this.siteWebPages = [];
        localStorage.setItem("saved-site", JSON.stringify(this.urlList));
        alert("¡Los datos se han borrado!");
      }
    },

    /**
     *  GUARDADO DEL FICHERO .BAT
     */
    saveBatch() {
      //crear el batch
      let urlBatch = "";
      this.siteWebPages.forEach((e) => {
        urlBatch +=
          'start chrome --new-tab- "' +
          decodeURI(e.webPageUrl) +
          '"\n' +
          "timeout /t 1\n";
      });

      const batchBlob = new Blob([urlBatch]);
      const batch = URL.createObjectURL(batchBlob); //crear una url que apunte al json
      const link = document.createElement("a"); //crea un enlace
      link.href = batch;
      link.download = "url_list.bat"; //apunta el enlace al json
      document.body.appendChild(link); //añade el link al body
      //despacha un evento click en el link
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      document.body.removeChild(link); //elimina el link del body
    },

    /**
     * SALVA EL JSON
     */
    saveJson() {
      const parsed = JSON.stringify(this.urlList);
      const jsonBlob = new Blob([parsed]);
      const blobUrl = URL.createObjectURL(jsonBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "url_list.json";
      document.body.appendChild(link);
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      document.body.removeChild(link); //elimina el link del body
    },

    /**
     * AÑADE URL
     */
    addItem() {
      this.inUrl = this.inUrl.trim();
      const duplicates = this.siteWebPages.some(
        (e) => e.webPageUrl === this.inUrl
      );
      //Comprobación duplicados
      if (duplicates) {
        alert("¡URL Duplicada!");
      } else {
        const newPage = {
          webPageUrl: this.inUrl,
          webPageType: this.inType,
          shortName: this.inShortName,
          breadcrumb: this.inBreadcrumb,
        };

        this.siteWebPages.push(newPage);
        this.saveSite();
        //bPreguntar = true;
      }
    },
    /***
     * BORRA UNA URL
     */
    deleteItem(index) {
      this.siteWebPages.splice(index, 1);
      this.saveSite();
    },
    /********
     * EDITA UNA URL
     */
    editItem(index) {
      this.editMode = true;
      this.indice = index;
      this.inUrl = this.siteWebPages[index].webPageUrl;
      this.inType = this.siteWebPages[index].webPageType;
      this.inShortName = this.siteWebPages[index].shortName;
      this.inBreadcrumb = this.siteWebPages[index].breadcrumb;
    },
    saveModified() {
      const i = this.indice;
      this.siteWebPages[i] = {
        webPageUrl: this.inUrl,
        webPageType: this.inType,
        shortName: this.inShortName,
        breadcrumb: this.inBreadcrumb,
      };
      this.indice = null;
      this.inUrl = "";
      this.inType = "";
      this.inShortName = "";
      this.inBreadcrumb = "";
      this.editMode = false;
      this.saveSite();
    },
  },
  computed: {
    /****************************************************** */

    //Recuperación de datos
    urlList: function () {
      return [
        {
          siteId: this.siteId,
          siteName: this.siteName,
          siteDomain: this.siteDomain,
          siteWebPages: this.siteWebPages,
        },
      ];
    },

    //número de url en la muestra
    numUrl: function () {
      return this.siteWebPages.reduce((acc, e) => {
        if (e.webPageUrl !== "") acc++;
        return acc;
      }, 0);
    },

    //número de aleatorias
    numAleatory: function () {
      return this.siteWebPages.reduce((acc, e) => {
        e.webPageUrl && e.webPageType === "ALEATORY" ? acc++ : null;
        return acc;
      }, 0);
    },

    //PÁGINA DE INICIO?
    hasHome: function () {
      return this.siteWebPages.some(
        (e) => e.webPageType === "HOME" && e.webPageUrl
      );
    },

    //Declaración de accesibilidad
    hasDecAcc: function () {
      return this.siteWebPages.some(
        (e) => e.webPageType === "ACCESSIBILITY_DECLARATION" && e.webPageUrl
      );
    },

    //Genera Site Id
    siteId: function () {
      if (this.siteName)
        //El nombre del sitio sin espacios ni carácteres especiales
        return this.siteName
          .toLowerCase()
          .replace(/ /g, "_")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
    },
  },
});
