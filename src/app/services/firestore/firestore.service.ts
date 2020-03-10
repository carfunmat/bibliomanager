import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // USUARIOS

  // Crea un nuevo usuario de la biblioteca
  public creaUsuarioBiblioteca(data: {nombre: string, password: string}){
    return this.firestore.collection('usuarios').add(data);
  }

  // Obtiene un usuario
  public getUsuarioBiblioteca(documentId: string){
    return this.firestore.collection('usuarios').doc(documentId).snapshotChanges();
  }

  // Obtiene todos los usuarios
  public getTodosUsuarios(){
    return this.firestore.collection('usuarios').snapshotChanges();
  }

  // Actualiza un usuario
  public actualizaUsuario(documentId: string, data: any){
    return this.firestore.collection('usuarios').doc(documentId).set(data);
  }

  // Elimina un usuario
  public eliminaUsuario(documentId: string){
    return this.firestore.collection('usuarios').doc(documentId).delete();
  }


  // LIBROS
  public creaLibro(data: {titulo: string, autor: string, usuario: string}){
    return this.firestore.collection('libros').add(data);
  }

  public getLibro(documentId: string){
    return this.firestore.collection('libros').doc(documentId).snapshotChanges();
  }

  public getTodosLibros(){
    return this.firestore.collection('libros').snapshotChanges();
  }

  public actualizaLibro(documentId: string, data: any){
    return this.firestore.collection('libros').doc(documentId).set(data);
  }

  public eliminaLibro(documentId: string){
    return this.firestore.collection('libros').doc(documentId).delete();
  }
}
