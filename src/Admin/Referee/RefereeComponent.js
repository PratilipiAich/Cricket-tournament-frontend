import React, { Component } from "react";
import RefereeDataService from "./Service/RefereeDataService";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Header from "../../Scorer/Header";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import AdminSidenav from "../AdminSidenav";
import { blue, pink } from "@material-ui/core/colors";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const styles = (theme) => ({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: pink[500],
    },
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 950,
  },
  list: {
    width: "100%",
    maxWidth: "300px",
    position: "fixed",
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: "50%",
    drawerWidth: "50%",
  },
  button: {
    margin: theme.spacing.unit,
  },
  newRoot: {
    backgroundColor: "#1854af",
    color: "white",
    "&:hover": {
      backgroundColor: "#6200ea",
    },
  },
  updateRoot: {
    backgroundColor: "#00A8CF",
    color: "white",
    "&:hover": {
      backgroundColor: "#0487A6",
    },
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class RefereeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referees: [],
      message: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      city: "",
      nationality: "",
      matches_refereed: "",
      experience: "",
      referee_id: "",
      open: false,
      open_u: false,
    };

    this.refreshReferees = this.refreshReferees.bind(this);
    this.updateRefereeClicked = this.updateRefereeClicked.bind(this);
    this.addRefereeClicked = this.addRefereeClicked.bind(this);
  }

  componentDidMount() {
    this.refreshReferees();

    ValidatorForm.addValidationRule("isMinLength", (value) => {
      if (value.length >= 2) {
        return true;
      }
      return false;
    });

    ValidatorForm.addValidationRule("isMaxLength", (value) => {
      if (value.length <= 15) {
        return true;
      }
      return false;
    });
    ValidatorForm.addValidationRule("isValidExp", (value) => {
      if (value >= 0 && value <= 40) {
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule("isMinLength");
    ValidatorForm.removeValidationRule("isMaxLength");
  }

  refreshReferees() {
    RefereeDataService.retrieveAllReferees().then((response) => {
      console.log(response);
      this.setState({ referees: response.data });
    });
  }

  updateRefereeClicked(id) {
    console.log("update " + id);
    this.props.history.push(`/admin/dashboard/Referee/${id}`);
  }

  addRefereeClicked() {
    this.props.history.push(`/admin/dashboard/RefereeAddForm`);
  }

  openAddForm = (e) => {
    this.setState({
      open: true,
    });
  };
  openUpdateForm = (e) => {
    this.setState({
      referee_id: e,
    });
    RefereeDataService.retrieveReferee(e).then((response) =>
      this.setState({
        first_name: response.data.first_name,
        middle_name: response.data.middle_name,
        last_name: response.data.last_name,
        city: response.data.city,
        nationality: response.data.nationality,
        matches_refereed: response.data.matches_refereed,
        experience: response.data.experience,
      })
    );

    this.setState({
      open_u: true,
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
      open_u: false,
      first_name: "",
      middle_name: "",
      last_name: "",
      city: "",
      nationality: "",
      matches_refereed: "",
      experience: "",
    });
  };
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  handleSubmit = () => {
    var referee = {
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      city: this.state.city,
      nationality: this.state.nationality,
      matches_refereed: this.state.matches_refereed,
      experience: this.state.experience,
    };

    console.log(referee);
    RefereeDataService.createReferee(referee).then((response) => {
      this.setState({ open: false });
      this.refreshReferees();
    });
  };
  handleUpdate = () => {
    var referee = {
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      city: this.state.city,
      nationality: this.state.nationality,
      matches_refereed: this.state.matches_refereed,
      experience: this.state.experience,
    };

    console.log(referee);

    RefereeDataService.updateReferee(this.state.referee_id, referee).then(
      (response) => {
        this.setState({ open_u: false });
        this.refreshReferees();
      }
    );
  };

  render() {
    const { classes } = this.props;

    const columns = [
      {
        Header: "First Name",
        accessor: "first_name",
        headerClassName: "header-class",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Middle Name",
        accessor: "middle_name",
        headerClassName: "header-class",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Last Name",
        accessor: "last_name",
        headerClassName: "header-class",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "City",
        accessor: "city",
        headerClassName: "header-class",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Nationality",
        headerClassName: "header-class",
        accessor: "nationality",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Matches Refereed",
        width: 170,
        headerClassName: "header-class",
        accessor: "matches_refereed",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Experience",
        headerClassName: "header-class",
        accessor: "experience",
        filterMethod: (filter, row) => {
          var v = row[filter.id]
            .toString()
            .toUpperCase()
            .search(filter.value.toUpperCase());
          // row[filter.id].toString().startsWith(filter.value)
          if (v >= 0) {
            return true;
          } else return false;
        },
        Filter: ({ filter, onChange }) => (
          <input
            placeholder="Search"
            onChange={(event) => onChange(event.target.value)}
            value={filter ? filter.value : ""}
            style={{
              width: "100%",
              backgroundColor: "#DCDCDC",
              color: "black",
            }}
          />
        ),
      },
      {
        Header: "Update",
        headerClassName: "header-class",
        Cell: (props) => {
          return (
            <Button
              variant="contained"
              color="primary"
              className={this.props.classes.updateRoot}
              onClick={() => this.openUpdateForm(props.original.referee_id)}
            >
              Update
            </Button>
          );
        },
        sortable: false,
        filterable: false,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
    ];
    if (
      Cookies.get("role") === undefined ||
      Cookies.get("role") !== "CABI_APPL_ADMIN"
    )
      return <Redirect to="/" />;
    return (
      <div style={{ marginTop: 100 }}>
        <Header />
        <AdminSidenav style={{ position: "fixed" }} />
        <div
          className="alignment"
          style={{
            marginLeft: "300px",
            marginTop: "30px",
            width: "74%",
            marginBottom: "20px",
          }}
        >
          {this.state.message && (
            <div class="alert success">{this.state.message}</div>
          )}
          <br />
          <div>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              className={(classes.margin, classes.newRoot)}
              onClick={this.openAddForm}
            >
              NEW
            </Button>
          </div>
          <br />
          <ReactTable
            className="MyReactTableClass"
            columns={columns}
            data={this.state.referees}
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
                paddingTop: "1%",
              }}
            >
              <center>
                <h3>Referee</h3>
              </center>

              <ValidatorForm onSubmit={this.handleSubmit} autoComplete="off">
                <TextValidator
                  style={{ width: "93%" }}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  variant="outlined"
                  label="First Name"
                  onChange={this.handleChange("first_name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        First Name
                      </InputAdornment>
                    ),
                  }}
                  validators={["isMinLength", "isMaxLength"]}
                  errorMessages={[
                    "Minimum 2 characters required!",
                    "Maximum 15 characters allowed!",
                  ]}
                  value={this.state.first_name}
                />

                <TextValidator
                  style={{ width: "93%" }}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  variant="outlined"
                  label="Middle Name"
                  onChange={this.handleChange("middle_name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Middle Name
                      </InputAdornment>
                    ),
                  }}
                  validators={["isMinLength", "isMaxLength"]}
                  errorMessages={[
                    "Minimum 2 characters required!",
                    "Maximum 15 characters allowed!",
                  ]}
                  value={this.state.middle_name}
                />

                <TextValidator
                  style={{ width: "93%" }}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  variant="outlined"
                  label="Last Name"
                  onChange={this.handleChange("last_name")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Last Name
                      </InputAdornment>
                    ),
                  }}
                  validators={["isMinLength", "isMaxLength"]}
                  errorMessages={[
                    "Minimum 2 characters required!",
                    "Maximum 15 characters allowed!",
                  ]}
                  value={this.state.last_name}
                />

                <TextValidator
                  style={{ width: "93%" }}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  variant="outlined"
                  label="City"
                  onChange={this.handleChange("city")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">City</InputAdornment>
                    ),
                  }}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                  value={this.state.city}
                />

                <TextValidator
                  style={{ width: "93%" }}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  variant="outlined"
                  label="Nationality"
                  onChange={this.handleChange("nationality")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Nationality
                      </InputAdornment>
                    ),
                  }}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                  value={this.state.nationality}
                />
                <TextValidator
                  label="Matches Refereed"
                  type="number"
                  style={{ width: "93%" }}
                  variant="outlined"
                  id="outlined-simple-start-adornment"
                  onChange={this.handleChange("matches_refereed")}
                  className={classNames(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Matches Refereed
                      </InputAdornment>
                    ),
                  }}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                  value={this.state.matches_refereed}
                />

                <TextValidator
                  style={{ width: "93%" }}
                  label=" Experience "
                  type="number"
                  variant="outlined"
                  onChange={this.handleChange("experience")}
                  id="outlined-simple-start-adornment"
                  className={classNames(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Experience
                      </InputAdornment>
                    ),
                  }}
                  validators={["required", "isValidExp"]}
                  errorMessages={[
                    "This field is required",
                    "Enter valid experience in years",
                  ]}
                  value={this.state.experience}
                />

                <center>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "150px" }}
                    className={classes.button}
                    type="submit"
                  >
                    Create
                  </Button>
                </center>
                <br />
              </ValidatorForm>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ open: false });
              }}
              variant="outlined"
              color="secondary"
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
                paddingTop: "1%",
              }}
            >
              <center>
                <h3>Referee</h3>
              </center>
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="First Name"
                value={this.state.first_name}
                onChange={this.handleChange("first_name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">First Name</InputAdornment>
                  ),
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Last Name"
                value={this.state.last_name}
                onChange={this.handleChange("last_name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Last Name</InputAdornment>
                  ),
                }}
              />
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Middle Name"
                value={this.state.middle_name}
                onChange={this.handleChange("middle_name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Middle Name
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="City"
                value={this.state.city}
                onChange={this.handleChange("city")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">City</InputAdornment>
                  ),
                }}
              />
              <br />
              <TextField
                style={{ width: "45%" }}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                label="Nationality"
                value={this.state.nationality}
                onChange={this.handleChange("nationality")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Nationality
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Matches Refereed"
                type="number"
                style={{ width: "45%" }}
                variant="outlined"
                value={this.state.matches_refereed}
                id="outlined-simple-start-adornment"
                onChange={this.handleChange("matches_refereed")}
                className={classNames(classes.margin, classes.textField)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      Matches Refereed
                    </InputAdornment>
                  ),
                }}
              />
              <br />
              <TextField
                style={{ width: "93%" }}
                label=" Experience "
                type="number"
                variant="outlined"
                value={this.state.experience}
                onChange={this.handleChange("experience")}
                id="outlined-simple-start-adornment"
                className={classNames(classes.margin, classes.textField)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Experience</InputAdornment>
                  ),
                }}
              />
              <br />
              <br />
              <center>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "150px" }}
                  className={(classes.button, this.props.classes.updateRoot)}
                  onClick={this.handleUpdate}
                >
                  Update
                </Button>
              </center>
              <br />
              <br /> <br />
              <br />
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
RefereeComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RefereeComponent);
