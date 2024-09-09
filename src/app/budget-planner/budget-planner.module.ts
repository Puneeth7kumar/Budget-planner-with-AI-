import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';
import { environment } from '../../environments/environment';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { LoanComponent } from './loan/loan.component';
import { FinancialInsightsComponent } from '../financial-insights/financial-insights.component';
import { FinancialCoachComponent } from '../financial-coach/financial-coach.component';

import { FinancialInsightsService } from '../financial-insights.service';
import { FinancialCoachService } from '../financial-coach.service';
import { BudgetService } from '../services/budget.service';
import { AuthService } from '../auth.service';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';


@NgModule({
    declarations: [
        DashboardComponent,

        IncomeComponent,
        ExpenseComponent
    ],
    imports: [
        CommonModule,  // Use CommonModule
        BudgetPlannerRoutingModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
        AngularFireAuthModule, // For Firebase Authentication
        //NoopAnimationsModule,  // For Material animations
        MatIconModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        SideNavComponent,
        LoanComponent,
        FinancialInsightsComponent,
        FinancialCoachComponent
    ],
    providers: [
        FinancialInsightsService,
        FinancialCoachService,
        BudgetService, AuthService
    ]
})
export class BudgetPlannerModule { }
