import React from 'react';
import './initial-customization.scss';
import CustomMultiSelect from "../../custom-clickables/createable-single";
import { withFirebase } from '../../../Firebase';
// import {CustomMultiSelect} from '../../custom-clickables/creatable-single';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    username: '',
    pursuits: [],

}
class InitialCustomizationPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            ...INITIAL_STATE
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSelect(newValue, actionMeta) {
        console.group('Value Changed');
        console.log(newValue);
        this.setState({ pursuits: newValue })
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.firebase.writeBasicUserData(
            this.state.username,
            this.state.firstName,
            this.state.lastName, 
            this.state.pursuits
        );

    }

    render() {
        const {username, firstName, lastName, pursuits} = this.state;
        let isInvalid = 
        username === '' ||
        firstName === '' ||
        lastName === '' ||
        pursuits.length === 0;
        return (
            <div className="basic-info-container">
                <form className="basic-info-form-container" onSubmit={this.handleSubmit}>
                    <h2>Let us know about you!</h2>
                    <label>
                        Don't worry this won't be public if you don't want it to.
                </label>
                    <input type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} />
                    <input type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} />
                    <label>
                        Choose a username!
                </label>
                    <input type="text" name="username" placeholder="Username" onChange={this.handleChange}/>
                    <label>
                        Tell us what you want to pursue or choose one from the list!
                </label>
                    <CustomMultiSelect name="pursuits" onSelect={this.handleSelect} />
                    <button disabled={isInvalid} type="submit" >
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}
export default withFirebase(InitialCustomizationPage);