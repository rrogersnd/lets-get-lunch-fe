import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { SignupModule } from './signup.module';

//import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth/auth.service';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

let component: SignupComponent;
let fixture: ComponentFixture<SignupComponent>;
let authService: AuthService;
let signupPage: SignupPage;

class SignupPage {
  submitBtn: DebugElement;
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  dietPreference: DebugElement[];

  addPageElements() {
    this.submitBtn = fixture.debugElement.query(By.css('button'));
    this.usernameInput = fixture
      .debugElement
      .query(By.css('[name=username]'))
      .nativeElement;
    this.passwordInput = fixture
      .debugElement
      .query(By.css('[name=password]'))
      .nativeElement;
    this.dietPreference = fixture
      .debugElement
      .queryAll(By.css('[name=preference]'));
  }
}

class MockAuthService{
  signup(credentials) {}
}

describe('SignupComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SignupModule ]
    })
    .overrideComponent(SignupComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    signupPage = new SignupPage();
    authService = fixture.debugElement.injector.get(AuthService);

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      signupPage.addPageElements();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user with valid credentials and diet preferences', () => {
    signupPage.usernameInput.value = 'johndoe';
    signupPage.passwordInput.value = 'password';
    signupPage.usernameInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));
    signupPage.dietPreference[0].nativeElement.click();
    signupPage.dietPreference[1].nativeElement.click();

    spyOn(authService, 'signup').and.callFake(() => {
      return Observable.of({ token: 's3cr3tt0ken' });
    });
    signupPage.submitBtn.nativeElement.click();

    expect(authService.signup).toHaveBeenCalledWith({
      username: 'johndoe',
      password: 'password',
      dietPreferences: ['BBQ', 'Burger']
    });
    //add expectation to redirect to user dashboard
  });

  it('should display an error message with invalid credentials', () => {
    signupPage.usernameInput.value = 'janedoe';
    signupPage.passwordInput.value = 'pswd';
    signupPage.usernameInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'signup').and.callFake(() => {
      return Observable.throw({
        error: {
          message: 'Your password must be at least 5 characters long.'
        }
      });
    });
    signupPage.submitBtn.nativeElement.click();

    fixture.detectChanges();
    const errorMessage: DebugElement = fixture.debugElement.query(By.css('.alert'));
    expect(errorMessage.nativeElement.textContent)
      .toEqual('Your password must be at least 5 characters long.');
  });
});
