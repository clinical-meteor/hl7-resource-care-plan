import { Card, CardHeader, CardText, CardTitle, Dialog, FlatButton, RaisedButton, TextField } from 'material-ui';
import { GlassCard, FullPageCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

import AccountCircle from 'material-ui/svg-icons/action/account-circle';

import { ActivitiesTable, GoalsTable } from 'meteor/clinical:hl7-resource-goal';
import { MedicationsTable } from 'meteor/clinical:hl7-resource-medication';
import { PatientTable } from 'meteor/clinical:hl7-resource-patient'
import { QuestionnaireTable } from 'meteor/clinical:hl7-resource-questionnaire';

import { CarePlansTable } from './CarePlansTable';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { browserHistory } from 'react-router';
import { Col, Grid, Row } from 'react-bootstrap';

import { get } from 'lodash';

Session.setDefault('patientDialogOpen', false);
Session.setDefault('selectedPatient', false);
Session.setDefault('selectedPatientId', false);
Session.setDefault('selectedCarePlanId', false);
export class CarePlanDesignerPage extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {

    let data = {
      style: {},
      primaryContact: {
        display: ''
      },
      careplan: {
        goal: []
      },
      selectedMeds: [],
      patientDialog: {
        open: Session.get('patientDialogOpen'),
        patient: {
          display: '',
          reference: ''
        }
      },
      selectedPatient: Session.get('selectedPatient')
    };
    


    // this should all be handled by props
    // or a mixin!
    if (Session.get('darkroomEnabled')) {
      data.style.color = 'black';
      data.style.background = 'white';
    } else {
      data.style.color = 'white';
      data.style.background = 'black';
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = 'blur(3px)';
      data.style.WebkitFilter = 'blur(3px)';
    }

    // the following assumes that we only have a single CarePlan record in the database
    if (CarePlans.find({'identifier.value':'alcohol-treatment-template'}).count() > 0) {
      let carePlanTemplate = CarePlans.find({'identifier.value':'alcohol-treatment-template'}).fetch()[0];
      //console.log("carePlanTemplate", carePlanTemplate);

      if (carePlanTemplate ) {
        data.primaryContact = carePlanTemplate.author[0];

        data.careplan = carePlanTemplate;
      }
    }

    data.style = Glass.blur(data.style);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }
  changeInput(variable, event, value){
    console.log('changeInput', variable, event, value)
    Session.set(variable, value);
  }  
  handleOpenPatients(){
    console.log('handleOpenPatients.bind(this) ')
    Session.set('patientDialogOpen', true);
  }  
  handleClosePatients(){
    Session.set('patientDialogOpen', false);
  }  
  selectCarePlan(carePlanId){
    console.log('selectCarePlan', carePlanId)
    Session.set('selectedCarePlanId', carePlanId);
    // browserHistory.push(get(Meteor, 'settings.public.defaults.routes.carePlanDesignerNext', '/'))
  }
  render() {
    let style = {
      inactiveIndexCard: {
        opacity: .5,
        width: '50%',
        display: 'inline-block',
        paddingLeft: '20px',
        paddingRight: '20px'
      },
      indexCard: {
        cursor: 'pointer'
      },
      indexCardPadding: {
        width: '100%',
        display: 'inline-block',
        paddingLeft: '20px',
        paddingRight: '20px',
        position: 'relative'
      }
    };
    const patientActions = [
      <FlatButton
        label="Clear"
        primary={true}
        onClick={this.handleClosePatients.bind(this)}
      />,
      <FlatButton
        label="Select"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClosePatients.bind(this)}
      />
    ];

    let patientPicklist;

    if(!this.data.selectedPatient){
      patientPicklist = <section id="patientSection" style={style.indexCardPadding} >
      <GlassCard>
        <CardTitle
          title="Patient Pick List"
        />
        <CardText>

          <TextField
            hintText="Jane Doe"
            errorText="Patient Search"
            onChange={this.changeInput.bind(this, 'patientSearch')}
            value={this.data.patientDialog.patient.display}
            fullWidth>
              <FlatButton
                label="Patients"
                id="patientSearchButton"
                className="patientsButton"
                primary={true}
                onClick={this.handleOpenPatients.bind(this) }
                icon={ <AccountCircle /> }
                style={{float: 'right', cursor: 'pointer', zIndex: 200, width: '160px', textAlign: 'right'}}
              />
            </TextField>

          <Dialog
            title="Patient Search"
            actions={patientActions}
            modal={false}
            open={this.data.patientDialog.open}
            onRequestClose={this.handleClosePatients.bind(this)}
          >
            <CardText style={{overflowY: "auto"}}>
            <TextField
              hintText="Jane Doe"
              errorText="Patient Search"
              onChange={this.changeInput.bind(this, 'description')}
              value={this.data.patientDialog.patient.display}
              fullWidth />
              <PatientTable 
                hideToggle={true}
                hideActions={true}
                hideMaritalStatus={true}
                hideLanguage={true}
                onRowClick={function(patientId){
                  console.log('CarePlanDesigner.PatientTable.onRowClick()')
                  Session.set('selectedPatientId', patientId);
                  Session.set('selectedPatient', Patients.findOne({id: patientId}));
                  Session.set('patientDialogOpen', false);
                }}
              />
            </CardText>
          </Dialog>
        </CardText>
      </GlassCard>
      <DynamicSpacer />
    </section>
    }
    return (
      <section id='carePlanDesignerPage' style={{paddingTop: "20px"}}>
        <FullPageCanvas >

          <Col md={6}>
            { patientPicklist }

            <section id="goalsSelection" style={style.indexCardPadding} >
              <GlassCard style={style.indexCard} >
                <CardTitle
                  title='Goals'
                  subtitle='Select the goals for the patient treatment.'
                />
                <CardText>
                  <GoalsTable hideIdentifier={true} />
                </CardText>
              </GlassCard>
            </section>

            <DynamicSpacer />          

            <section id="medicationSection" style={style.indexCardPadding} >
              <GlassCard style={style.indexCard} >
                <CardTitle
                  title='Medications'
                  subtitle='Select the medications the patient will receive.'
                />
                <CardText>
                  <MedicationsTable hideIdentifier={true}  />
                </CardText>
              </GlassCard>
            </section>

            <DynamicSpacer />

            <section id="activitiesSection" style={style.indexCardPadding} >
              <GlassCard style={style.indexCard} >
                <CardTitle
                  title='Activities'
                  subtitle='Select the activities the patient ought to engage in.'
                />
                <CardText>
                  <ActivitiesTable
                    hideIdentifier={true} 
                    />
                </CardText>
              </GlassCard>
            </section>
            <DynamicSpacer />

            <section id="questionnairesSection" style={style.indexCardPadding} >
              <GlassCard style={style.indexCard} >
                <CardTitle
                  title='Questionnaires'
                  subtitle='The questionnaire that you need the patient to answer.'
                />
                <CardText>
                  <QuestionnaireTable
                    hideIdentifier={true} 
                    hideToggles={true} 
                    hideActions={true} 
                    />
                </CardText>
              </GlassCard>
            </section>
            <DynamicSpacer />

            {/* <section  style={style.indexCardPadding}>
              <RaisedButton
                id='authorCarePlanButton'
                label="Author CarePlan"
                fullWidth={true}
                primary={true}
                onClick={this.authorCarePlan.bind(this)}
                style={{marginBottom: '60px'}}
              />
            </section>   */}
      
          </Col>
          <Col md={6}>
            <CarePlansTable 
              onRowClick={this.selectCarePlan.bind(this) }
            />
          </Col>

        </FullPageCanvas>
      </section>
    );
  }
  authorCarePlan(){
    console.log('Authoring a CarePlan...')
    //if(process.env.NODE_ENV === "test") console.log("authoring care plan...");

    var currentUser = new User(Meteor.user());

    let careplanData = {
      template: 'sample-template',
      subject: {
        display: Session.get('patientSearchFilter'),
        reference: Session.get('selectedPatientId')
      },
      author: {
        display: currentUser.fullName(),
        reference: Meteor.userId()
      },
      description: 'Basic Treatment Plan',
      medications: Session.get('selectedMedications'),
      goals: Session.get('selectedGoals'),
      deselectedActivities: Session.get('deselectedActivities')
    };

    if(process.env.NODE_ENV === "test") console.log("careplanData", careplanData);

    let newCarePlanId = CarePlans.insert(careplanData);
    // let newCarePlanId = authorCarePlan.call(careplanData);

    Patients.update({_id: Session.get('selectedPatientId')}, {$set: {
      'carePlanId': newCarePlanId
    }});

    Session.set('selectedMedications', []);
    // browserHistory.push('/careplan-history');
  }
}




ReactMixin(CarePlanDesignerPage.prototype, ReactMeteorData);

export default CarePlanDesignerPage;