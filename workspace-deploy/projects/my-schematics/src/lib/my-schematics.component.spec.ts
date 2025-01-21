import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySchematicsComponent } from './my-schematics.component';

describe('MySchematicsComponent', () => {
  let component: MySchematicsComponent;
  let fixture: ComponentFixture<MySchematicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySchematicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySchematicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
