<template>
<div>
    <div class="title bold">
        Group {{group}}
    </div>
    
    <div :class="['container',alignItems]">
      <div class="team-container">
        
        <div class="team-name-container" v-for="(eachTeam,group) in data" :key=group @click="selectWinner(group, eachTeam.matchNo, levels.level1, $event)">
          {{group}}
          <div class="team-name" v-for="(team,index1) in eachTeam" :key=index1>
           {{team.teamName}}
         </div>
       
        </div>
      </div>
      <div class="level-container" v-for="(eachLevel,index) in levels" :key=index>
         <div :class="['rounds-container',index]" v-for="(match,index1) in eachLevel" :key=index1 @click="movetoNextLevel( match, index, index1)">
           <div>
               <p v-if="match.winner != ''" class="bold">Team {{match.winner}} winner</p>
               <p>{{match.place}}</p>
               <p>{{match.date}}</p>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setStoreCollection } from "../common/localStorage";
import { publishEvent } from '../common/observer';

export default {
    props:['data','levels', 'alignItems', 'group'],
    methods: {
        selectWinner(group, matchNo, levels){
            for (const eachLevel in levels) {
                if(levels[eachLevel].matchNo == matchNo) {
                    levels[eachLevel].winner = group;
                    levels[eachLevel]["teamData"] = this.data[group];
                }
            }
        },
        movetoNextLevel( match, index, selectdIndex) {
            var level = parseInt(index.substr(index.length - 1))+1;
            if(match.teamData && level == parseInt(Object.keys(this.levels).length + 1)) {
                match.group = this.group;
                publishEvent("teamWinner", match);
                return;
                // Found last level winner
            }

             if(!match.teamData) {
                alert("Please select Previous match winner");
                return;
            }
           

            if(selectdIndex % 2 == 0) {
                this.levels["level"+level][selectdIndex]["winner"] = match.winner;
                this.levels["level"+level][selectdIndex]["runnerUp"] = match.winner;
                this.levels["level"+level][selectdIndex]["teamData"] = match.teamData;
            } else {
                this.levels["level"+level][selectdIndex-1]["winner"] = match.winner;
                 this.levels["level"+level][selectdIndex-1]["teamData"] = match.teamData;
            }

            setStoreCollection('levels', this.levels);
        }
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: row;
    
    .team-container {
        display: flex;
       flex-direction: column;
    }
    .team-name-container {
       display: flex;
       flex-direction: column;
  
    }
    .level-container {
      display: grid;
      grid-template-rows: auto;
      
       .rounds-container {
           justify-content: center;
           margin: 10px;
           padding:20px;
           border: 1px solid black;
           border-left:none;
           margin-right: 0;
           margin-left: 0;
       }
    }
    .team-name-container:hover,
    .rounds-container:hover {
        background-color: lightgray;
        cursor: pointer;
    }
    .level2 { 
        margin: 200px;
    }  

    .level2:last-child,
    .level2:first-child{ 
        margin-top: 100px;
        margin-bottom: 100px;
    } 
    .level3:last-child,
    .level3:first-child{ 
        margin-top: 200px;
        margin-bottom: 200px;
    } 
    .level4:last-child:last-child,
    .level4:first-child{ 
        margin-top: 300px;
        margin-bottom: 300px;
    } 
    
}
.right {
    direction: rtl;
    .level-container {
       .rounds-container {
           border: 1px solid black;
           border-right:none
       }
    }
}
.bold {
    font-size: 13px;
    font-weight: 600;
}
.title {
    font-size: 16px;
    font-weight: 600;
}
</style>