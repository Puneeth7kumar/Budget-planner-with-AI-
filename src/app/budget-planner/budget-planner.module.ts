import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FinancialInsightsService } from '../financial-insights.service';
import { FinancialInsightsComponent } from '../financial-insights/financial-insights.component';
import { FinancialCoachService } from '../financial-coach.service';
import { FinancialCoachComponent } from '../financial-coach/financial-coach.component';
import { BudgetService } from '../services/budget.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from './side-nav/side-nav.component';
import { LoanComponent } from './loan/loan.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    //FinancialCoachComponent
    DashboardComponent,

  ],
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    FormsModule,
    HttpClientModule,

    CommonModule, MatIconModule, SideNavComponent, FinancialInsightsComponent, HttpClientModule, FinancialCoachComponent

  ],
  providers: [FinancialInsightsService, FinancialCoachService, BudgetService,]
})
export class BudgetPlannerModule { }
