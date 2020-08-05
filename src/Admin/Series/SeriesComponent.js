import React, { Component } from 'react'
import SeriesDataService from './Service/SeriesDataService';

import './Series.css';
import ReactTable from "react-table-6"; 
import 'react-table-6/react-table.css';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
 
import Slide from "@material-ui/core/Slide";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    flexBasis: 950
  },
  list:{
    width: "100%",
    maxWidth: "300px",
    position: "fixed"
  }
});
 
const formStyle = { width: "100%" };

const Tournament = [
  {
    value: "A-Limited Overs International",
    label: "A-Limited Overs International"
  },
  {
    value: "National",
    label: "National"
  }
];
const SeriesType = [
  {
    value: "First Class",
    label: "First Class"
  },
  {
    value: "Second class",
    label: "Second class"
  }
];
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SeriesComponent extends Component {
 
    constructor(props) {
        super(props)
        this.state = {
            Series: [],
            message: null,
            series_id:"",
            series_name:"",
            series_short_name:"",
            series_start_date:"",
            series_end_date:"",
            tournament:"",
            series_type:"",
            host1:"UNKWN",
            host2:"UNKWN",
            host3:"UNKWN",
            host4:"UNKWN",
            points_table_active:false,
            series_points:"",
            open:false,
            open_u:false
        }
        this.deleteSeriesClicked = this.deleteSeriesClicked.bind(this)
        this.refreshSeries = this.refreshSeries.bind(this)
        this.updateSeriesClicked = this.updateSeriesClicked.bind(this)
        this.addSeriesClicked = this.addSeriesClicked.bind(this)  
        this.addTeamClicked=this.addTeamClicked.bind(this)
        this.showTeamClicked=this.showTeamClicked.bind(this)
    }
 
    componentDidMount() {
        this.refreshSeries();   
    }
    
    refreshSeries() {
        SeriesDataService.retrieveAllSeries()
            .then(
                response => {
                    console.log(response);
                    this.setState({ Series: response.data })
                }
            )
    }
 
    deleteSeriesClicked(id,series_short_name) {
        SeriesDataService.deleteSeries(id)
            .then(
                response => {
                    this.setState({ message: `Delete of series ${series_short_name} is Successful` })
                    this.refreshSeries()
                }
            )
    
    } 
 
    updateSeriesClicked(id) {
        console.log('update ' + id)
        this.props.history.push(`/admin/dashboard/Series/${id}`)
    }
 
    addSeriesClicked() {
        this.props.history.push(`/admin/dashboard/SeriesAddForm`)
    }
    addTeamClicked(id) {
        this.props.history.push(`/admin/dashboard/SeriesAddTeam/${id}`)
    }
    showTeamClicked(id) {
        this.props.history.push(`/admin/dashboard/SeriesShowTeam/${id}`)
    }

    openAddForm = e => {
      this.setState({
        open: true
      
      });
    };
    openUpdateForm = e => {
    this.setState({
       series_id:e
        
      });
      SeriesDataService.retrieveSeries(e)
            .then(response => this.setState({
                series_name:response.data.series_name,
                series_short_name:response.data.series_short_name,
                series_start_date:response.data.series_start_date,
                series_end_date:response.data.series_end_date,
                tournament:response.data.tournament,
                series_type:response.data.series_type,
                host1:response.data.host_country[0],
                host2:response.data.host_country[1],
                host3:response.data.host_country[2],
                host4:response.data.host_country[3],
                points_table_active:response.data.points_table_active,
                series_points:response.data.series_points
               
            }))
     
      this.setState({
        open_u:true
        
      });
    };
  handleClose = () => {
      this.setState({ open: false,open_u:false });
    };
    handleChange = name => event => {
      this.setState({
        [name]: event.target.value
      });
    };
    handleSubmit=() => {
     // alert(this.state.series_name+this.state.series_short_name+this.state.series_start_date+this.state.series_end_date+this.state.series_type+this.state.tournament+this.state.points_table_active.toString()+this.state.series_points+this.state.host1+this.state.host2+this.state.host3+this.state.host4)
     //console.log(this.state.points_table_active);
      var series={
        series_name:this.state.series_name,
        series_short_name:this.state.series_short_name,
        series_start_date:this.state.series_start_date,
        series_end_date:this.state.series_end_date,
        series_type:this.state.series_type,
        tournament:this.state.tournament,
        points_table_active:this.state.points_table_active,
        series_points:this.state.series_points,
        host_country:[this.state.host1,this.state.host2,this.state.host3,this.state.host4]
    };
    console.log(series); 
    SeriesDataService.createSeries(series)
      .then(
        response => {
            this.setState({open:false })
            this.refreshSeries()
        }
    ) 
     
    
     }

     handleCheck = name => event => {
      this.setState({
        [name]: event.target.checked
      });
    };
     handleUpdate=() => {
     
      var series={
        series_name:this.state.series_name,
        series_short_name:this.state.series_short_name,
        series_start_date:this.state.series_start_date,
        series_end_date:this.state.series_end_date,
        series_type:this.state.series_type,
        tournament:this.state.tournament,
        points_table_active:this.state.points_table_active,
        series_points:this.state.series_points,
        host_country:[this.state.host1,this.state.host2,this.state.host3,this.state.host4]
    };
    console.log(series); 
       
    SeriesDataService.updateSeries(this.state.series_id,series)
      .then(
        response => {
            this.setState({open_u:false })
            this.refreshSeries()
        }
    )  
    
     }
     
    

    
    render() {

      const { classes } = this.props;
        const columns = [{  
            Header: 'Series name',
            accessor: 'series_name',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
            },{  
            Header: 'Series short name',  
            accessor: 'series_short_name',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
            },{  
            Header: 'Series type',  
            accessor: 'series_type',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
            },{  
            Header: 'Start date',  
            accessor: 'series_start_date',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )      
            },{  
            Header: 'End date',  
            accessor: 'series_end_date',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )      
            },{  
            Header: 'Tournament',  
            accessor: 'tournament',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
         
            },{  
            Header: 'Host 1',  
            accessor: 'host_country[0]',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
        
            },{  
            Header: 'Host 2 ',  
            accessor: 'host_country[1]',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
            
            },{  
            Header: 'Host 3',  
            accessor: 'host_country[2]',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
                
            },{  
            Header: 'Host 4',  
            accessor: 'host_country[3]',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
                    
            },{  
            id:'points_table_active',    
            Header: 'Points table',  
            accessor: value=>{return value.points_table_active?'Yes':'No'},
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
                        
            },
            {  
            Header: 'Series points',  
            accessor: 'series_points',
            filterMethod: (filter, row) => {
                var v = row[filter.id]
                  .toString()
                  .toUpperCase()
                  .search(filter.value.toUpperCase());
                // row[filter.id].toString().startsWith(filter.value)
                if (v >= 0) {
                  return true;
                } else return false;
              }, Filter: ({filter, onChange}) => (
                <input
                placeholder="Search"
                  onChange={event => onChange(event.target.value)}
                  value={filter ? filter.value : ''}
                  style={{
                    width: '100%',
                    backgroundColor: '#DCDCDC',
                    color: 'black',
                  }}
                />
              )    
                            
            },{  
                Header: 'Add team',  
                Cell:props=>{
                    return(
                        <button onClick={() =>  this.addTeamClicked(props.original.series_id)}>Add</button>
                )
        
                } ,
                sortable:false,
                filterable:false,
                width:100,
                minWidth:100,
                maxWidth:100
            },{  
            Header: 'Show team',  
            Cell:props=>{
                return(
                    <button  onClick={() =>  this.showTeamClicked(props.original.series_id)} >Show</button>
            )
    
            } ,
            sortable:false,
            filterable:false,
            width:100,
            minWidth:100,
            maxWidth:100
            },{  
                Header: 'Delete',  
                Cell:props=>{
                    return(
                        <button onClick={() => this.deleteSeriesClicked(props.original.series_id,props.original.series_short_name)}>Delete</button>
                )
        
                } ,
                sortable:false,
                filterable:false,
                width:100,
                minWidth:100,
                maxWidth:100
            },{  
                Header: 'Update',  
                Cell:props=>{
                    return(
                        <button  onClick={() => this.openUpdateForm(props.original.series_id)} >Update</button>
                )
        
                } ,
                sortable:false,
                filterable:false,
                width:100,
                minWidth:100,
                maxWidth:100
                }
        ]  
        return (
            <div>
                
                <div className = "details">
                {this.state.message && <div class="alert success">{this.state.message}</div>}
                     <div>
                        <button class="btn newBtn" onClick={this.openAddForm}>New</button>
                     </div>
                   
                     <ReactTable
                     className="MyReactTableClass"
                     columns={columns}
                     data={this.state.Series}
                     filterable
                     defaultPageSize={10}
                     ></ReactTable>
 
 
                </div>
                <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
         

          <DialogContent>
          <Paper
              style={{
                width: "500px",
                paddingLeft: "2%",
                paddingRight: "0%",
                paddingTop: "1%"
              }}
            >
              <center>
                <h3>Series</h3>
              </center>
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_name")}
                label="Series Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    Series
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Series Short Name"
                onChange={this.handleChange("series_short_name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Short Name
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_start_date")}
                label="Series Start Date"
                type="date"
                
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_end_date")}
                label="Series End Date"
                type="date"
                
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                style={{ width: "45%" }}
                select
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Tournament"
                onChange={this.handleChange("tournament")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Tournament</InputAdornment>
                  )
                }}
              >
                {Tournament.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ width: "45%" }}
                select
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Series Type"
                onChange={this.handleChange("series_type")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Series Type
                    </InputAdornment>
                  )
                }}
              >
                {SeriesType.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 1"
                onChange={this.handleChange("host1")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    Host 1
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 2"
                onChange={this.handleChange("host2")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 2
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                autoComplete='off'
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 3"
                onChange={this.handleChange("host3")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 3
                    </InputAdornment>
                  )
                }}
              />
               <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("host4")}
                label="Host country 4"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 4
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                style={{ width: "45%",marginLeft:"55px" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_points")}
                label="Series Points"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Series Points
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ width: "25%" }}
                    onChange={this.handleCheck("points_table_active")}
                    className={classNames(classes.margin)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Points Table"
              />
             
              <center>
                <Button
                  variant="contained"
                  style={{ width: "150px" }}
                  className={classes.button}
                  onClick={this.handleSubmit}
                >
                  Create
                </Button>
              </center>
              <br />
              
            </Paper>

          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ open:false });
              }}
              variant="outlined"
            >
              Cancel
            </Button>
           
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.open_u}
          TransitionComponent={Transition}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
         

          <DialogContent>
          <Paper
              style={{
                width: "500px",
                paddingLeft: "2%",
                paddingRight: "0%",
                paddingTop: "1%"
              }}
            >
              <center>
                <h3>Series</h3>
              </center>
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_name")}
                label="Series Name"
                value={this.state.series_name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    Series
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                value={this.state.series_short_name}
                label="Series Short Name"
                onChange={this.handleChange("series_short_name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Short Name
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_start_date")}
                label="Series Start Date"
                type="date"
                value={this.state.series_start_date}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_end_date")}
                label="Series End Date"
                type="date"
                value={this.state.series_end_date}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                style={{ width: "45%" }}
                select
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Tournament"
                value={this.state.tournament}
                onChange={this.handleChange("tournament")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Tournament</InputAdornment>
                  )
                }}
              >
                {Tournament.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ width: "45%" }}
                select
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Series Type"
                value={this.state.series_type}
                onChange={this.handleChange("series_type")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Series Type
                    </InputAdornment>
                  )
                }}
              >
                {SeriesType.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 1"
                value={this.state.host1}
                onChange={this.handleChange("host1")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                    Host 1
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 2"
                value={this.state.host2}
                onChange={this.handleChange("host2")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 2
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                autoComplete='off'
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Host country 3"
                value={this.state.host3}
                onChange={this.handleChange("host3")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 3
                    </InputAdornment>
                  )
                }}
              />
               <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("host4")}
                label="Host country 4"
                value={this.state.host4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Host 4
                    </InputAdornment>
                  )
                }}
              />
              <br />
              <TextField
                style={{ width: "45%",marginLeft:"55px" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                onChange={this.handleChange("series_points")}
                label="Series Points"
                type="number"
                value={this.state.series_points}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Series Points
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ width: "25%" }}
                    onChange={this.handleCheck("points_table_active")}
                    checked={this.state.points_table_active}
                    className={classNames(classes.margin)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Points Table"
              />
             
              <center>
                <Button
                  variant="contained"
                  style={{ width: "150px" }}
                  className={classes.button}
                  onClick={this.handleUpdate}
                >
                  Update
                </Button>
              </center>
              <br />
              
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ open_u:false });
              }}
              variant="outlined"
            >
              Cancel
            </Button>
           
          </DialogActions>
        </Dialog>

           
            </div>
        )
    }
    
}
SeriesComponent.propTypes = {
  classes: PropTypes.object.isRequired
};
 
export default withStyles(styles)(SeriesComponent)
