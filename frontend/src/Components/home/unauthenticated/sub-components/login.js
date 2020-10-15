import React from 'react';
import PasswordForgetPage from '../../../password/forget/index'

const WelcomeLoginComponent = (props) =>
  (
    <div className="login-signup-container flex-display">
      <section >
        <h4>Sign In</h4>
          <button onClick={props.onToggleLoginRegisterWindow}>Create Account</button>
        <form onSubmit={props.onLoginSubmit}>
          <div>
            <input type="text" placeholder="Email" name="email" autoComplete="off" onChange={props.onLoginEmailChange} />
          </div>
          <div>
            <input type="password" placeholder="Password" name="password" autoComplete="off" onChange={props.onLoginPasswordChange} />
          </div>

          <input type="submit" value="Log in" />
        </form>
        <PasswordForgetPage />
      </section>
    </div>
  )




export default WelcomeLoginComponent;
