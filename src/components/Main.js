import React, { Component } from "react";
import SelectInsurance from './SelectInsurance'

class Main extends Component {
  state = {};
  render() {
    return (
      <div>
         
        <main className="wrapper">
        <section id="display-wrapper">
        </section>

        <section>
            <h2>Buy Insurance</h2>

            <p className="description">Buy Insurance from a flight below</p>

           
            {/* <select name="buy-insurance" id="buy-insurance-flights" aria-label="Flights"></select> */}
            <SelectInsurance 
             flights = {this.props.flights ?? []}
             flightsCount = {this.props.flightsCount}
            />

            <input type="number" name="amount" id="amount" placeholder="1 ether" defaultValue="1"></input>

            <button 
            className="btn" 
            data-action="0"
            onClick={() => {
              this.props.buyInsurance();
            }}
            >Buy Insurance
            </button>
        </section>

        <section>
            <h2>Your Insured Flights</h2>

            <ul id="insured-flights">
            </ul>
        </section>


        <section>
            <h2>Your Balance</h2>

            <div id="passenger-balance"></div>


            <button 
                className="btn" 
                data-action="3"
                onClick={() => {
                  this.props.requestPayout();
                }}
                >
                Request Payout
                </button>
        </section>
    </main>
     
      </div>
    );
  }
}

export default Main;
