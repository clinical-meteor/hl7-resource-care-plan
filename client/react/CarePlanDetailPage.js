import { CardText, CardTitle } from 'material-ui/Card';
import {Tab, Tabs} from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get } from 'lodash';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { ConditionsTable } from 'meteor/clinical:hl7-resource-condition';
import { GoalsTable } from 'meteor/clinical:hl7-resource-goal';
import { MedicationsTable } from 'meteor/clinical:hl7-resource-medication';

export class CarePlanDetailPage extends React.Component {
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

    if(this.props.params.id){
      data.currentCarePlan = CarePlans.findOne({_id: this.props.params.id});
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    console.log('CarePlanDetailPage.data', data)
    // console.log('CarePlanDetailPage.props', this.props)

    return data;
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In CarePlanDetailPage render');
    return (
      <div id='carePlanDetailPage'>
        <VerticalCanvas>

          <GlassCard >
            <CardTitle title='Conditions Addressed' />
            <CardText>
            <ConditionsTable
              hideCheckboxes={true}
              hideIdentifier={true}
              hidePatientName={true}
              hideAsserterName={true}
            />
              {/* <ConditionsTable conditions={get(this, 'data.currentCarePlan.addresses')} /> */}
            </CardText>
          </GlassCard>
          <DynamicSpacer />

          <GlassCard >
            <CardTitle title='Goals' />
            <CardText>
              <GoalsTable 
                hideIdentifier={true}
                hideCheckboxes={true}
              />
            </CardText>
          </GlassCard>
          <DynamicSpacer />

          <GlassCard >
            <CardTitle title='Medications' />
            <CardText>
              <MedicationsTable />
            </CardText>
          </GlassCard>
          <DynamicSpacer />


        </VerticalCanvas>
      </div>
    );
  }
}

ReactMixin(CarePlanDetailPage.prototype, ReactMeteorData);

export default CarePlanDetailPage;