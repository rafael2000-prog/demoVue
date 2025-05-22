<template>
    
    <div>
      <ul>
        <li v-for="c in contactos" :key="c.id">
          {{ c.nombre }} - {{ c.direccion }}
        </li>
      </ul>
    </div>
    
    <div>
      <h2>{{ texto }} - Ecuador</h2>
  
      <form @submit.prevent="guardar">
        <label for="txtNombre">Nombre completo</label>
        <input id="txtNombre" type="text" v-model="nombre" />
        <p><strong>Hola </strong> {{ nombre }}</p>
        <label for="txtDireccion">Dirección</label>
        <input id="txtDireccion" type="text" v-model="direccion" />

        <button type="submit">{{ editIndex !== null ? 'Actualizar' : 'Guardar' }}</button>
      </form>
    </div>

    <table border="1" style="margin-top: 20px;">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in listaDatos" :key="index">
          <td>{{ item.nombre }}</td>
          <td>{{ item.direccion }}</td>
          <td>
            <button @click="editar(index)">Editar</button>
            <button @click="eliminar(index)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

  </template>
  
  <script>

  import { db } from '../firebase';
  import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';


  export default {
    name: 'holaUPS',
    props: {
      texto: {
        type: String,
        default: 'Programacion'
      }
    },
    data() {
      return {
        nombre: '',
        direccion: '',
        listaDatos: [],
        editIndex: null,
        contactos: []
      }
    },

    async mounted() {
      await this.cargarContactos();

      const datos = localStorage.getItem("datos");
      this.listaDatos = datos ? JSON.parse(datos) : [];
    },

    methods: {
      async cargarContactos() {
        const ref = collection(db, 'contactos');
        const snapshot = await getDocs(ref);
        this.listaDatos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      },

      async guardar() {
        //console.log('Guardando Vue.....','Nombre:', this.nombre, 'Dirección:', this.direccion)

        const registro = {nombre: this.nombre, direccion: this.direccion};

        //const datos = localStorage.getItem("datos");
        //const lista = datos ? JSON.parse(datos):[];

        /*
        if (this.editIndex !== null) {
          this.listaDatos[this.editIndex] = registro;
          this.editIndex = null;
        } else {
          this.listaDatos.push(registro);
        }*/

        //lista.push(registro);

        //localStorage.setItem('datos',JSON.stringify(this.listaDatos));

        //console.log('datos guardados', lista);

      if (this.editIndex !== null) {
          const contactoExistente = this.listaDatos[this.editIndex];

          if (contactoExistente && contactoExistente.id) {
            const contactoRef = doc(db, 'contactos', contactoExistente.id);
            await updateDoc(contactoRef, registro);
          }

          this.editIndex = null;
        } else {
          const ref = collection(db, 'contactos');
          await addDoc(ref, registro);
        }

        //this.listaDatos = lista;
        this.nombre = '';
        this.direccion = '';

        await this.cargarContactos();

      },

      editar(index) {
        const r = this.listaDatos[index];
        this.nombre = r.nombre;
        this.direccion = r.direccion;
        this.editIndex = index;
      },

      async eliminar(index) {
          const contacto = this.listaDatos[index];

          if (!contacto || !contacto.id) {
            console.error('No se puede eliminar: contacto sin ID');
            return;
          }

          const contactoRef = doc(db, 'contactos', contacto.id);
          await deleteDoc(contactoRef);

          this.listaDatos.splice(index, 1);

          //this.listaDatos.splice(index, 1);
          //localStorage.setItem('datos', JSON.stringify(this.listaDatos));
        }
      
    }
  }

  
  </script>
  