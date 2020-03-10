import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {

  displayedColumns = ['id', 'titulo', 'autor'];

  public libros = [];
  public documentId = null;
  public currentStatus = 1;
  public nuevoLibroForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    autor: new FormControl('', Validators.required),
    usuario: new FormControl(''),
    id: new FormControl('')
  });

  constructor(private firestoreService: FirestoreService) {
    this.nuevoLibroForm.setValue({
      id: '',
      titulo: '',
      autor: '',
      usuario: ''
    });
   }

  ngOnInit() {
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
    document.getElementById('formularioLibro').style.visibility = v;
    if(v == 'visible'){
      document.getElementById('botonAgregar').style.visibility = 'hidden';
    } else {
      document.getElementById('botonAgregar').style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('botonInput')).value = "Agregar";
    }

  }

  public nuevoLibro(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        titulo: form.titulo,
        autor: form.autor,
        usuario: ''
      }
      this.firestoreService.creaLibro(data).then(() => {
        console.log('Documento creado exitosamente!');
        this.nuevoLibroForm.setValue({
          id: '',
          titulo: '',
          autor: '',
          usuario: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      let data = {
        titulo: form.titulo,
        autor: form.autor,
        usuario: ''
      }
      this.firestoreService.actualizaLibro(documentId, data).then(() => {
        this.currentStatus = 1;
        this.nuevoLibroForm.setValue({
          id: '',
          titulo: '',
          autor: '',
          usuario: ''
        });
        console.log('Documento editado exitosamente');
      }, (error) => {
        console.log(error);
      });
    }

    this.agregaVisible('hidden');
    (<HTMLInputElement>document.getElementById('botonInput')).value = "Editar";
  }

  public editaLibro(documentId) {
    let editSubscribe = this.firestoreService.getLibro(documentId).subscribe((libro) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.nuevoLibroForm.setValue({
        id: documentId,
        titulo: libro.payload.data()['titulo'],
        autor: libro.payload.data()['autor'],
        usuario: libro.payload.data()['usuario']
      });
      editSubscribe.unsubscribe();
    });
    this.agregaVisible('visible');
    (<HTMLInputElement>document.getElementById('botonInput')).value = "Editar";
  }

  public borraLibro(documentId) {
    this.firestoreService.eliminaLibro(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

}
