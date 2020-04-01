import Axios from 'axios';


const getData = function() {
    return Axios
      .get('http://raw.githubusercontent.com/bttmly/nba/master/data/teams.json');
}

export default {
    getData : getData
};