import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import CarePlanDetail from './CarePlanDetail';
import CarePlansTable from './CarePlansTable';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

//=============================================================================================================================================
// TABS

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

//=============================================================================================================================================
// COMPONENT


export class CarePlansPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('carePlanPageTabIndex'),
      carePlanSearchFilter: Session.get('carePlanSearchFilter'),
      currentCarePlan: Session.get('selectedCarePlan')
    };

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('carePlanPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedCarePlan', false);
    Session.set('carePlanUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In CarePlansPage render');
    return (
      <div id='carePlansPage'>
        <PageCanvas>
          <StyledCard height='auto'>
            <CardHeader title='CarePlans' />
            <CardContent>
              <CarePlansTable />

              {/* <Tabs id="carePlansPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className="carePlanListTab" label='CarePlans' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <CarePlansTable />
               </Tab>
               <Tab className="carePlanDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <CarePlanDetail id='carePlanDetails' />
               </Tab>
             </Tabs> */}
            </CardContent>
          </StyledCard>
        </PageCanvas>
      </div>
    );
  }
}

ReactMixin(CarePlansPage.prototype, ReactMeteorData);

export default CarePlansPage;