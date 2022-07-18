import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup

  message!:string

  constructor(private formbuilder :FormBuilder,
              private authService : AuthService) { }

  ngOnInit(): void {
    this.initForgotPasswordForm()
  }

initForgotPasswordForm():void{
  this.forgotPasswordForm = this.formbuilder.group({
    email : ['',[Validators.required,Validators.email]]
  })
}

onSubmitForgotPassswordForm():void{
  this.authService.sendPasswordResetEmail(this.forgotPasswordForm.value.email)
  .then(() =>{
    this.message = 'L\'email de réinitialisation à été envoyé à votre adresse.';
  }) 
}

}
