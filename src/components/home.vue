<template>
  <div  v-if="loading">
    <h2>Loading data.. Please wait !!</h2>
  </div>
  <div v-else class='home-container'>
    <div class='left-container'>
      <tree :data='teamA' :levels='levels.teamA' alignItems='left' group='A'></tree>
    </div>
    <div class='mid-container'>
      <h1>Final Level</h1>
      <div v-if="finalLevel.champion">
        <p class="title" v-if="finalLevel.champion">
          Champion - Group {{finalLevel.group}}  -- Team {{finalLevel.champion}}
          
        </p>
        <!-- <p> Runner-Up - {{finalLevel.runnerUp}}</p>
        <p>3rd Place - {{finalLevel.thirdPlace}}</p>
        <p>4th Place - {{finalLevel.fourthPlace}}</p> -->
      </div>
      <div v-else>
        <p>
          Results coming soon ...!!
        </p>
      </div>
     
    
    </div>
     <div class='right-container'>
       <tree :data='teamB' :levels='levels.teamB' alignItems='right' group='B'></tree>
    </div>
    
    
  </div>
  
</template>

<script>
import Tree from './renderTree';
import Constant from './../common/constants';
import { getStoreCollection, setStoreCollection } from '../common/localStorage';
import { subscribeEvent } from '../common/observer';
import Service from '../service/service';

export default {
  name: 'HelloWorld',
  data() {
    return {
      loading: true,
      groups: ['A','B','C','D','E','F','G','H','I','J'],
      teamA : [],
      teamB : [],
      levels : {},
      finalLevel : {
        'champion' : '',
        'runnerUp' : '',
        'thirdPlace' : '',
        'fourthPlace' : ''
      },
      teamGroup: {}
    }
  },
  components:{
    Tree
  },
  methods: {
    fetchData() {
      Service.getData().then(res => {
        this.createTeams(res.data);
        this.loading = false;
      })
      .catch(err => {
        console.log("Error"), err;
        //  this.loading = false;
      })
    },
    createGroups(data, pos, teamcount) {
      for(let i=0;i<teamcount;i++) {
        if(pos%teamcount == i) {
          if(!this.teamGroup[this.groups[i]]) {
            this.teamGroup[this.groups[i]] = [];
          }
          
          this.teamGroup[this.groups[i]].push(data);
        }
      }
    },
    divideTheTeam(data, matchNo) {
      this.teamGroup = {};
      let teamcount = Math.ceil(data.length/4);
      for(let i=0;i<data.length;i++) {
        this.createGroups(data[i], i, teamcount);
      }
      this.teamGroup = this.asseignMatch(this.teamGroup, matchNo);
      return this.teamGroup;
    },
    asseignMatch(data, matchNo) {
      var key = Object.keys(data);
      for(let i=0;i<key.length;i++) {
          data[key[i]]['matchNo'] = matchNo;
          console.log(data[key[i]]['matchNo']);
          if((i+1) % 2 == 0) {
             matchNo = matchNo + 2;
          }
      }
     return data;
    },
    createTeams(data) {
      const temp = data.splice(0,(Math.floor(data.length/2)));
      
      this.teamB = this.divideTheTeam(data, 2);
      this.teamA = this.divideTheTeam(temp, 1);

      this.levels={
        teamA: this.createLevels(Object.keys(this.teamA).length, 1, 1),
        teamB: this.createLevels(Object.keys(this.teamB).length, 1, 2)
      }

      setStoreCollection('teamA', this.teamA)
      setStoreCollection('teamB', this.teamB)
      setStoreCollection('levels', this.levels);

    },
    createLevels(count, level, matchNo, temp) {
      if(count == 1) {
        return temp;
      }
      if(!temp) {
        temp = {};
      }
      count = count/2;
      temp['level'+level] = [];
      for(let i=0;i<count;i++) {
        temp['level'+level].push({
          matchNo : matchNo,
          winner : '',
          runnerUp:'',
          place: Constant.MATCH_INFO[matchNo].place,
          date: Constant.MATCH_INFO[matchNo].dateTime
        })
        matchNo = matchNo + 2;
      }
      level++;
      return this.createLevels(count, level, matchNo, temp);
    },
    updateTeamData(data) {
      this.finalLevel.champion = data.winner;
      this.finalLevel.group = data.group;
      //TODO : Need to continue to get runner up, 3rd place and 4th place
    }
  },
  created() {
    subscribeEvent('teamWinner', this.updateTeamData)
  },
  mounted() {
     this.loading = true;
     let levels = getStoreCollection('levels');
     let teamA = getStoreCollection('teamA');
     let teamB = getStoreCollection('teamB');
     if(!levels && teamA && teamB) {
       this.levels = levels;
       this.teamA = teamA;
       this.teamB = teamB;
       this.loading = false;
     } else {
        this.fetchData();
     }
     
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.home-container {
  display: flex;
  flex-direction: row;
  .left-container {
    width: 40%;

  }
  .mid-container {
    width: 20%;
  }
  .right-container {
    width: 40%;
  }
  .title {
    font-size:18px;
    font-weight: 600;
  }
}
</style>
