import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuarios = [];
  public libros = [];
  public documentId = null;
  public currentStatus = 1;
  public nuevoUsuarioForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    libro: new FormControl(''),
    id: new FormControl('')
  });
  
  constructor(private firestoreService: FirestoreService) {
    this.nuevoUsuarioForm.setValue({
      id: '',
      nombre: '',
      password: '',
      libro: ''
    });
   }

  ngOnInit() {
    this.firestoreService.getTodosUsuarios().subscribe(
      (usuariosSnapshot) => {
        this.usuarios = [];
        usuariosSnapshot.forEach(
          (usuariosData: any) => {
            this.usuarios.push({
              id: usuariosData.payload.doc.id,
              data: usuariosData.payload.doc.data()
            })
          }
        )
      }
    );

    this.firestoreService.getTodosLibros().subscribe(
      (librosSnapshot) => {
        this.libros = [];
        librosSnapshot.forEach(
          (librosData: any) => {
            this.libros.push({
              id: librosData.payload.doc.id,
              data: librosData.payload.doc.data(),
            })
          }
        )
      }
    );

    this.agregaVisible('hidden');
  }

  public agregaVisible(v){
    document.getElementById('formularioUsuario').style.visibility = v;
    if(v == 'visible'){
      document.getElementById('botonAgregar').style.visibility = 'hidden';
    } else {
      document.getElementById('botonAgregar').style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('botonInput')).value = "Agregar";
    }

  }

  public nuevoUsuario(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        nombre: form.nombre,
        password: form.password,
        libro: form.libro
      }
      this.firestoreService.creaUsuarioBiblioteca(data).then(() => {
        console.log('Documento creado exitosamente!');
        this.nuevoUsuarioForm.setValue({
          id: '',
          nombre: '',
          password: '',
          libro: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      let data = {
        nombre: form.nombre,
        password: form.password,
        libro: form.libro
      }
      this.firestoreService.actualizaUsuario(documentId, data).then(() => {
        this.currentStatus = 1;
        this.nuevoUsuarioForm.setValue({
          id: '',
          nombre: '',
          password: '',
          libro: ''
        });
        console.log('Documento editado exitosamente');
      }, (error) => {
        console.log(error);
      });
    }

    this.agregaVisible('hidden');
    (<HTMLInputElement>document.getElementById('botonInput')).value = "Editar";
  }

  public editaUsuario(documentId) {
    let editSubscribe = this.firestoreService.getUsuarioBiblioteca(documentId).subscribe((usuario) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.nuevoUsuarioForm.setValue({
        id: documentId,
        nombre: usuario.payload.data()['nombre'],
        password: usuario.payload.data()['password'],
        libro: usuario.payload.data()['libro']
      });
      editSubscribe.unsubscribe();
    });
    this.agregaVisible('visible');
    (<HTMLInputElement>document.getElementById('botonInput')).value = "Editar";
  }

  public borraUsuario(documentId) {
    this.firestoreService.eliminaUsuario(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

}
