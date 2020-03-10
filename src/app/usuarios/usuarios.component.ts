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
  public documentId = null;
  public currentStatus = 1;
  public nuevoUsuarioForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    id: new FormControl('')
  });
  
  constructor(private firestoreService: FirestoreService) {
    this.nuevoUsuarioForm.setValue({
      id: '',
      nombre: '',
      password: ''
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
    )
  }

  public nuevoUsuario(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        nombre: form.nombre,
        password: form.password
      }
      this.firestoreService.creaUsuarioBiblioteca(data).then(() => {
        console.log('Documento creado exitosamente!');
        this.nuevoUsuarioForm.setValue({
          id: '',
          nombre: '',
          password: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      let data = {
        nombre: form.nombre,
        password: form.password
      }
      this.firestoreService.actualizaUsuario(documentId, data).then(() => {
        this.currentStatus = 1;
        this.nuevoUsuarioForm.setValue({
          id: '',
          nombre: '',
          password: ''
        });
        console.log('Documento editado exitosamente');
      }, (error) => {
        console.log(error);
      });
    }
  }

  public editaUsuario(documentId) {
    let editSubscribe = this.firestoreService.getUsuarioBiblioteca(documentId).subscribe((usuario) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.nuevoUsuarioForm.setValue({
        id: documentId,
        nombre: usuario.payload.data()['nombre'],
        password: usuario.payload.data()['password']
      });
      editSubscribe.unsubscribe();
    });
  }

  public borraUsuario(documentId) {
    this.firestoreService.eliminaUsuario(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

}
