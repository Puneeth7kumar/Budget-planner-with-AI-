import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FinancialInsightsService } from '../financial-insights.service';
import { FinancialInsightsComponent } from '../financial-insights/financial-insights.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [FinancialInsightsService]
})
export class BudgetPlannerModule { }
