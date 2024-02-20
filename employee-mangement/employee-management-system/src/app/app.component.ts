import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Employee } from './model/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;

  title = 'employee-management-system';
  educationOptions = [
    '10th pass',
    'diploma',
    'graduate',
    'post-graduate',
    'phd',
  ];

  employeeForm: FormGroup;
  employees: Employee[];
  employeesToDisplay: Employee[];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = [];
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control(''),
      lastname: this.fb.control(''),
      birthdate: this.fb.control(''),
      gender: this.fb.control(''),
      education: this.fb.control(''),
      company: this.fb.control(''),
      jobExperience: this.fb.control(''),
      salary: this.fb.control(''),
    });
    this.employeeService.getEmployees().subscribe((res) => {
      console.log(res)
      // for (let emp of res) {
      //   this.employees.unshift(emp);
      // }
      // this.employeesToDisplay = this.employees;
    });
  }
  public get firstname(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get lastname(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get birthdate(): FormControl {
    return this.employeeForm.get('birthdate') as FormControl;
  }
  public get gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get education(): FormControl {
    return this.employeeForm.get('education') as FormControl;
  }
  public get company(): FormControl {
    return this.employeeForm.get('company') as FormControl;
  }
  public get jobExperience(): FormControl {
    return this.employeeForm.get('jobExperience') as FormControl;
  }
  public get salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }
  ngAfterViewInit(): void {}

  removeEmployee(event: any) {
    this.employees.forEach((val, index) => {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res) => {
          this.employees.splice(index, 1);
        });
      }
    });
  }

  editEmployee(event: any) {
    this.employees.forEach((val, ind) => {
      if (val.id === event) {
        this.setForm(val);
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }

  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];
    if (event === '') {
      this.employeesToDisplay = this.employees;
    } else {
      filteredEmployees = this.employees.filter((val, index) => {
        let targetKey =
          val.firstname.toLowerCase() + ' ' + val.lastname.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  setForm(emp: Employee) {
    this.firstname.setValue(emp.firstname);
    this.lastname.setValue(emp.lastname);
    this.birthdate.setValue(emp.birthdate);
    this.gender.setValue(emp.gender);

    let educationIndex = 0;
    this.educationOptions.forEach((val, index) => {
      if (val === emp.education) educationIndex = index;
    });
    this.education.setValue(educationIndex);

    this.company.setValue(emp.company);
    this.jobExperience.setValue(emp.jobExperience);
    this.salary.setValue(emp.salary);
    this.fileInput.nativeElement.value = '';
  }

  clearForm() {
    this.firstname.setValue('');
    this.lastname.setValue('');
    this.birthdate.setValue('');
    this.gender.setValue('');
    this.education.setValue('');
    this.company.setValue('');
    this.jobExperience.setValue('');
    this.salary.setValue('');
    this.fileInput.nativeElement.value = '';
  }

  addEmployee() {
    let employee: Employee = {
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      birthdate: this.birthdate.value,
      gender: this.gender.value,
      education: this.educationOptions[parseInt(this.education.value)],
      company: this.company.value,
      jobExperience: this.jobExperience.value,
      salary: this.salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    };

    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    });
  }
}
