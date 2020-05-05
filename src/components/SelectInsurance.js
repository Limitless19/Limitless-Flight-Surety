import React, { Component } from 'react';

class SelectInsurance extends Component {
    state = { 
     }
    render() { 
        //TODO
      var Data  = ['this', 'example', 'isnt', 'funny'];
       var flightOption = function(X) {
            return <option key={X}>{X}</option>;
        };
    return <select>{Data.map(flightOption)}</select>;
    }
}
 
export default SelectInsurance;