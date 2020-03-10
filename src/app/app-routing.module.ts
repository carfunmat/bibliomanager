import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LibrosComponent } from './libros/libros.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'libros', component: LibrosComponent},
  {path: 'usuarios', component: UsuariosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
