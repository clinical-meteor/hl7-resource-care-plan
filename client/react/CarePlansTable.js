import { Card, CardActions, CardMedia, CardText, CardTitle, Toggle } from 'material-ui';

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
    am: '',
    pm: '',
    activities: '',
    goals: '',
    start: '',
    end: '',
    title: ''
  };

  if (plan.template) {
    result.template = plan.template.toString();
  }
  if (plan.subject && plan.subject.display) {
    result.subject = plan.subject.display;
  }
  if (plan.author && plan.author[0] && plan.author[0].display) {
    result.author = plan.author[0].display;
  }
  if (plan.createdAt) {
    result.createdAt = moment(plan.period.start).format("YYYY-MM-DD hh:mm a");
  }
  if (plan.activity) {
    result.activities = plan.activity.length;
  }
  if (plan.goal) {
    result.goals = plan.goal.length;
  }

  if(!result.title){
    result.title = get(plan, 'title', '')    
  }
  if(!result.title){
    result.title = get(plan, 'description', '')    
  }
  if(!result.title){
    result.title = get(plan, 'category[0].text', '')    
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
      Session.set("selectedCarePlan", carePlanId);
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
  renderToggleHeader(){
    if (!this.props.hideToggle) {
      return (
        <th className="toggle">Toggle</th>
      );
    }
  }
  renderToggle(){
    if (!this.props.hideToggle) {
      return (
        <td className="toggle" style={{width: '60px'}}>
            <Toggle
              defaultToggled={true}
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
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.careplans.length; i++) {
      tableRows.push(
        <tr key={i} className="patientRow" style={{cursor: "pointer", textAlign: 'left'}} onClick={ this.rowClick.bind(this, this.data.careplans[i]._id)} >
          { this.renderToggle(this.data.careplans[i]._id) }
          <td className='meta' style={{width: '120px'}}>
            <FaLock style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaTags style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaCode style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaPuzzlePiece style={{marginLeft: '2px', marginRight: '2px'}} />
            <GoTrashcan style={{marginLeft: '2px', marginRight: '2px'}} />
          </td>
          <td>{this.data.careplans[i].title }</td>
          {/* <td>{this.data.careplans[i].subject }</td> */}
          { this.renderSubject( this.data.careplans[i].subject ) } 
          <td>{this.data.careplans[i].author }</td>
        </tr>
      );
    }


    return(
      <Table hover >
        <thead>
          <tr>
            { this.renderToggleHeader() }
            <th className='actions'>Actions</th>
            <th>Title</th>
            { this.renderSubjectHeader() }
            {/* <th>Subject</th> */}
            <th>Author</th>
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
  hideToggle: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideSubject: PropTypes.bool,
  enteredInError: PropTypes.bool
};
ReactMixin(CarePlansTable.prototype, ReactMeteorData);
export default CarePlansTable;