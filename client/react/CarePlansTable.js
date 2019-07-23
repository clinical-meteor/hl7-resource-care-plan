            <th>Goals</th>
import { Card, CardActions, CardMedia, CardText, CardTitle, Checkbox } from 'material-ui';

import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Table } from 'react-bootstrap';
import { get, has } from 'lodash';

import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'


flattenCarePlan = function(plan){
  // careplans: CarePlans.find({'subject.reference': Meteor.userId}).map(function(plan){
  // todo: replace tertiary logic

  // console.log('flattenCarePlan', plan)

  let result = {
    _id: plan._id,
    subject: '',
    author: '',
    template: '',
    category: '',
    am: '',
    pm: '',
    activities: 0,
    goals: 0,
    addresses: 0,
    start: '',
    end: '',
    title: ''
  };

  if (get(plan, 'template')) {
    result.template = plan.template.toString();
  }

  result.subject = get(plan, 'subject.display', '');
  result.author = get(plan, 'author[0].display', '')
  result.start = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
  result.end = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
  result.category = get(plan, 'category[0].text', '')    


  if (get(plan, 'activity')) {
    result.activities = plan.activity.length;
  }
  if (get(plan, 'goal')) {
    result.goals = plan.goal.length;
  }
  if (get(plan, 'addresses')) {
    result.addresses = plan.addresses.length;
  }

  if(!result.title){
    result.title = get(plan, 'title', '')    
  }
  if(!result.title){
    result.title = get(plan, 'description', '')    
  }
  if(!result.title){
    result.title = get(plan, 'category[0].coding[0].display', '')    
  }

  // if( plan.period ) {
  //   if (plan.period.start) {
  //     result.start = plan.period.start;
  //   }
  //   if (plan.period.end) {
  //     result.end = plan.period.end;
  //   }
  // }

  return result;
}
export class CarePlansTable extends React.Component {
  
  getMeteorData() {

    // default query is scoped to the logged in user
    let carePlanQuery = {'subject.reference': Meteor.userId()};
    if (get(Meteor.user(), 'roles[0]') === "practitioner") {
      // practitioner query is open ended and returns everybody
      carePlanQuery = {};
    }

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      careplans: []
    };


    if(this.props.data){
      this.props.data.forEach(function(plan){
        data.careplans.push(flattenCarePlan(plan));
      })
    } else {
      data.careplans = CarePlans.find(carePlanQuery).map(flattenCarePlan);
    }

    // if (Session.get('darkroomEnabled')) {
    //   data.style.color = "black";
    //   data.style.background = "white";
    // } else {
    //   data.style.color = "white";
    //   data.style.background = "black";
    // }

    // // this could be another mixin
    // if (Session.get('glassBlurEnabled')) {
    //   data.style.filter = "blur(3px)";
    //   data.style.WebkitFilter = "blur(3px)";
    // }

    // // this could be another mixin
    // if (Session.get('backgroundBlurEnabled')) {
    //   data.style.backdropFilter = "blur(5px)";
    // }

    if(process.env.NODE_ENV === "test") console.log("CarePlansTable[data]", data);


    return data;
  }
  removeRecord(_id){
    console.log('Remove careplan ', _id)
    CarePlans._collection.remove({_id: _id})
  }
  showSecurityDialog(carePlan){
    console.log('showSecurityDialog', carePlan)

    Session.set('securityDialogResourceJson', CarePlans.findOne(get(carePlan, '_id')));
    Session.set('securityDialogResourceType', 'CarePlan');
    Session.set('securityDialogResourceId', get(carePlan, '_id'));
    Session.set('securityDialogOpen', true);
  }
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }

  handleSelect(selected) {
    this.setState({selected});
  }
  getDate(){
    return "YYYY/MM/DD";
  }
  noChange(){
    return "";
  }
  rowClick(carePlanId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(carePlanId);
    } else {
      Session.set('selectedPatientId', carePlanId);
      Session.set('selectedPatient', CarePlans.findOne(carePlanId));

      browserHistory.push('/careplan/' + carePlanId);  
    }
  }
  renderBarcode(_id){
    if (this.props.showBarcode) {
      return (
        <td><span className="barcode">{ _id }</span></td>
      );
    }
  }
  renderBarcodeHeader(){
    if (this.props.showBarcode) {
      return (<th>id</th>);
    }
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <th className="toggle" style={{width: '60px'}} ></th>
      );
    }
  }
  renderCheckbox(){
    if (!this.props.hideCheckboxes) {
      return (
        <td className="toggle" style={{width: '60px'}}>
            <Checkbox
              defaultChecked={true}
            />
          </td>
      );
    }
  }
  renderSubjectHeader(){
    if (!this.props.hideSubject) {
      return (
        <th className='patientDisplay'>Patient</th>
      );
    }
  }
  renderSubject(subject ){
    if (!this.props.hideSubject) {
      return (
        <td className='subject' style={{minWidth: '140px'}}>{ subject }</td>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <th className='actionIcons' style={{width: '100px'}}>Actions</th>
      );
    }
  }
  renderActionIcons(carePlan ){
    if (!this.props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <td className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, carePlan)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, carePlan._id)} />  
        </td>
      );
    }
  } 
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.careplans.length; i++) {

      let rowStyle = {
        cursor: 'pointer',
        textAlign: 'left'
      }
      if(get(this.data.careplans[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      let activitesCount = get(this.data.careplans[i], 'activities', []);
      let goalsCount = get(this.data.careplans[i], 'goals', []);
      let addressesCount = get(this.data.careplans[i], 'addresses', []);

      tableRows.push(
        <tr key={i} className="patientRow" style={rowStyle} onClick={ this.rowClick.bind(this, this.data.careplans[i]._id)} >
          { this.renderCheckbox(this.data.careplans[i]._id) }
          { this.renderActionIcons(this.data.careplans[i]) }

          <td>{this.data.careplans[i].title }</td>
          {/* <td>{this.data.careplans[i].subject }</td> */}
          { this.renderSubject( this.data.careplans[i].subject ) } 
          <td>{this.data.careplans[i].author }</td>
          <td>{ this.data.careplans[i].activities }</td>
          <td>{ this.data.careplans[i].goals }</td>
          <td>{ this.data.careplans[i].addresses }</td>
        </tr>
      );
    }


    return(
      <Table hover >
        <thead>
          <tr>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            <th>Title</th>
            { this.renderSubjectHeader() }
            {/* <th>Subject</th> */}
            <th>Author</th>
            <th>Activites</th>
            <th>Goals</th>
            <th>Conditions Addressed</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>

    );
  }
}


CarePlansTable.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object,
  onRowClick: PropTypes.func,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideSubject: PropTypes.bool,
  enteredInError: PropTypes.bool
};
ReactMixin(CarePlansTable.prototype, ReactMeteorData);
export default CarePlansTable;