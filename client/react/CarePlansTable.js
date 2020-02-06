import { 
  Checkbox, 
  Table, 
  TableRow, 
  TableCell,
  TableBody
} from '@material-ui/core';

import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { get } from 'lodash';

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
        <TableCell><span className="barcode helvetica">{ _id }</span></TableCell>
      );
    }
  }
  renderBarcodeHeader(){
    if (this.props.showBarcode) {
      return (<TableCell>id</TableCell>);
    }
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} ></TableCell>
      );
    }
  }
  renderCheckbox(){
    if (!this.props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  renderSubjectHeader(){
    if (!this.props.hideSubject) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  renderSubject(subject ){
    if (!this.props.hideSubject) {
      return (
        <TableCell className='subject' style={{minWidth: '140px'}}>{ subject }</TableCell>
      );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
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
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, carePlan)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, carePlan._id)} />  
        </TableCell>
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
        <TableRow key={i} className="patientRow" style={rowStyle} onClick={ this.rowClick.bind(this, this.data.careplans[i]._id)} >
          { this.renderCheckbox(this.data.careplans[i]._id) }
          { this.renderActionIcons(this.data.careplans[i]) }

          <TableCell>{this.data.careplans[i].title }</TableCell>
          {/* <TableCell>{this.data.careplans[i].subject }</TableCell> */}
          { this.renderSubject( this.data.careplans[i].subject ) } 
          <TableCell>{this.data.careplans[i].author }</TableCell>
          <TableCell>{ this.data.careplans[i].activities }</TableCell>
          <TableCell>{ this.data.careplans[i].goals }</TableCell>
          <TableCell>{ this.data.careplans[i].addresses }</TableCell>
        </TableRow>
      );
    }


    return(
      <Table hover >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            <TableCell>Title</TableCell>
            { this.renderSubjectHeader() }
            {/* <TableCell>Subject</TableCell> */}
            <TableCell>Author</TableCell>
            <TableCell>Activites</TableCell>
            <TableCell>Goals</TableCell>
            <TableCell>Conditions Addressed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
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