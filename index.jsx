

import CarePlansPage from './client/react/CarePlansPage';
import CarePlansTable from './client/react/CarePlansTable';
import CarePlanDetail from './client/react/CarePlanDetail';
import CarePlanDesignerPage from './client/react/CarePlanDesignerPage';
import CarePlanDetailPage from './client/react/CarePlanDetailPage';
import { CarePlan, CarePlans, CarePlanSchema } from './lib/CarePlans';

import { ConditionsTable } from 'meteor/clinical:hl7-resource-condition';
import { GoalsTable } from 'meteor/clinical:hl7-resource-goal';
import { MedicationsTable } from 'meteor/clinical:hl7-resource-medication';


var DynamicRoutes = [{
  'name': 'CarePlansPage',
  'path': '/care-plans',
  'component': CarePlansPage,
  'requireAuth': true
}, {
  'name': 'Care Plan Designer',
  'path': '/careplan-designer',
  'component': CarePlanDesignerPage,
  'requireAuth': true
}, {
  'name': 'CarePlanDetailPage',
  'path': '/careplan/:id',
  'component': CarePlanDetailPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Care Plans',
  'to': '/care-plans',
  'href': '/care-plans'
}, {
  'primaryText': 'CarePlan',
  'to': '/careplan',
  'href': '/careplan'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  CarePlansPage,
  CarePlansTable,
  CarePlanDetail,
  CarePlanDesignerPage
};


