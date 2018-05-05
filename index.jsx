

import CarePlansPage from './client/react/CarePlansPage';
import CarePlansTable from './client/react/CarePlansTable';
import CarePlanDesignerPage from './client/react/CarePlanDesignerPage';
import { CarePlan, CarePlans, CarePlanSchema } from './lib/CarePlans';

var DynamicRoutes = [{
  'name': 'CarePlansPage',
  'path': '/care-plans',
  'component': CarePlansPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Care Plans',
  'to': '/care-plans',
  'href': '/care-plans'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  CarePlansPage,
  CarePlansTable,
  CarePlanDesignerPage
};


