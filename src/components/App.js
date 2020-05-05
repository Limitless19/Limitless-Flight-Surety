import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import FlightSuretyApp from '../abis/FlightSuretyApp.json'
import FlightSuretyData from '../abis/FlightSuretyData.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css';

class App extends Component {

  async componentWillMount(){ // init lifecycle 
     await this.loadWeb3();
     await this.loadBlockchainAccounts();
    //  await this.getFlights();
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }else{
      window.alert("Non-Ethereum browser detected.You should consider using metamask");
    }
  }

  async loadBlockchainAccounts(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({owner : accounts[0]});
    console.log(`owner ${this.state.owner}`)

    //load contract abis and addresses
    
    const networkId = await web3.eth.net.getId();
    //FlightSuretyApp
    const flightSuretyAppNetworkData = FlightSuretyApp.networks[networkId];
    //FlightSuretySata
    const flightSuretyNetworkData = FlightSuretyData.networks[networkId];


    if(flightSuretyAppNetworkData && flightSuretyNetworkData ) {

      const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, flightSuretyAppNetworkData.address); // you can't for now use web3.eth.Contract in .js truffle test.
      const flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, flightSuretyNetworkData.address);
      this.setState({flightSuretyApp,flightSuretyData});
      this.setState({ loading: false});
      this.setState({web3});
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props){
   super(props);
   this.state = {
     account: '',
     loading: true,
     flights:'',
     flightsCount:''
   }

   //bind all methods.
   this.buyInsurance = this.buyInsurance.bind(this)
   this.requestPayout = this.requestPayout.bind(this)
   this.getFlights = this.getFlights.bind(this)
   this.getInsurances = this.getInsurances.bind(this);
  }

//this.state.flightSuretyApp.methods
//this.state.flightSuretyData.methods

  async buyInsurance(){
    console.log("buy insurance button clicked - get flights");
     await this.getFlights();
  }

  requestPayout(){
    console.log("Request payout button clicked");
  }

  async getFlights(){
    
    //get the flights from contract.
    let flights = [];
    this.setState({ loading: true })
    let flightsCount = await this.state.flightSuretyApp.methods.getFlightsCount().call({from: this.state.owner});
    console.log(`flightcounts ${flightsCount}`)
    for (var i = 0; i < flightsCount; i++) {
      const flight = await this.state.flightSuretyApp.methods.getFlight(i).call({ from: this.state.owner }); //map
      console.log(flight)
      flights.push(flight);
  }
  console.log(flights);

  this.setState({flights})
  this.setState({flightsCount})

  await this.getInsurances(this.state.flights);
  this.setState({ loading: false })

  }

  async getInsurances(flights){
    //get insurances
    let insurances = [];
    flights.map(async (flight) => {
      const insurance = await this.state.flightSuretyApp.methods
          .getInsurance(flight.name)
          .call({ from: this.state.owner });

      if (insurance.amount !== "0"){
         insurances.push({
          amount: this.state.web3.utils.fromWei(insurance.amount, 'ether'),
          payoutAmount: this.state.web3.utils.fromWei(insurance.payoutAmount, 'ether'),
          state: insurance.state,
          flight: flight
      });
      }
  });
  //

  }

   render() {
      return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main  
                   buyInsurance={this.buyInsurance}
                   requestPayout = {this.requestPayout}
                   flights = {this.state.flights}
                   flightsCount = {this.state.flightsCount}
                   />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }

 
}

export default App;
