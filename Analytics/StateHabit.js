function StateHabit (states,habits,direction) {

if(habits[0]!==undefined && states[0]!==undefined) {

    const habitname=habits[0].name;
    const statename=states[0].name;

    const StatesFirstYear = Math.min([...new Set(states.map(c=>c.year))]);
    const StatesFirstMonth = Math.min([...new Set(states.filter(c=>c.year==StatesFirstYear).map(c=>c.month))]);
    const StatesFirstDay = 1;
    const StatesLastYear = Math.max([...new Set(states.map(c=>c.year))]);
    const StatesLastMonth = Math.max([...new Set(states.filter(c=>c.year==StatesLastYear).map(c=>c.month))]);
    const StatesLastDay =   (year, month) => new Date(year, month+1, 0).getDate();
    const StatesFirstDate = new Date(StatesFirstYear,StatesFirstMonth,StatesFirstDay);
    const StatesLastDate = new Date(StatesLastYear,StatesLastMonth,StatesLastDay(StatesLastYear,StatesLastMonth));
    const StatesPeriod= (StatesLastDate-StatesFirstDate)/(1000*60*60*24)+1;

    let whenStatethenTrue = [];
    const whenTruethenState = [];
    const whenFalsethenState= [];

    const numberOfstates = [...new Set(states.map(c=>c.item))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined).length;
    const statesitems = [...new Set(states.map(c=>c.item))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined);


    for (var i=0;i<StatesPeriod;i++) {
        let habitsElement = habits.filter(c=>(c.year==states[i].year)&&(c.month==states[i].month)&&(c.day==states[i].day));
        for(var j=0;j<numberOfstates;j++) {
            states[i].item==statesitems[j]? (habitsElement.map(c=>c.state)[0]==1? whenStatethenTrue.push(statesitems[j]) : undefined) : undefined;
            habitsElement.map(c=>c.state)[0]==1? states[i].item==statesitems[j]? whenTruethenState.push(states[i].item) : undefined: undefined;
            habitsElement.map(c=>c.state)[0]==0? states[i].item==statesitems[j]? whenFalsethenState.push(states[i].item) : undefined: undefined;
        }
    }
    const whenStatethenTrueResults =[];
    const stateCount = [];
    const whenTruethenStateResults =[];
    const whenFalsethenStateResults =[];

    for(var i=0;i<numberOfstates;i++) {
        let counter = 0;
        let statesCounter = 0;
        for(var j=0;j<whenStatethenTrue.length;j++){
            whenStatethenTrue[j]==statesitems[i]?
                counter++ 
            : undefined;
        };
        whenStatethenTrueResults.push(counter);
        for(var j=0;j<states.length;j++){
            states[j].item==statesitems[i]?
                statesCounter++ 
            : undefined;
        };
        stateCount.push(statesCounter);
    }; 

    for(var i=0;i<numberOfstates;i++) {
        let counter = 0;
        for(var j=0;j<whenTruethenState.length;j++){
            whenTruethenState[j]==statesitems[i]?
                counter++ 
            : undefined;
        };
        whenTruethenStateResults.push(counter);
    };

    for(var i=0;i<numberOfstates;i++) {
        let counter = 0;
        for(var j=0;j<whenFalsethenState.length;j++){
            whenFalsethenState[j]==statesitems[i]?
                counter++ 
            : undefined;
        };
        whenFalsethenStateResults.push(counter);
    };

    const sumwhenStatethenTrueResults = whenStatethenTrueResults.reduce((a, b) => (a + b), 0);
    const maxPwhenStatethenTrueResults = ((Math.max(...whenStatethenTrueResults)/sumwhenStatethenTrueResults)).toFixed(2)*100;
    const maxStateNumber = Math.max(...whenStatethenTrueResults);
    const maxStateIndex = maxStateNumber==undefined? 0: whenStatethenTrueResults.indexOf(Math.max(...whenStatethenTrueResults));
    const maxStateName = statesitems[maxStateIndex];
    const whenTruepmaxState = maxStateNumber==undefined? 0: (maxStateNumber/stateCount[maxStateIndex]*100).toFixed(0);

    const maxStatewhenTrue=statesitems[whenTruethenStateResults.indexOf(Math.max(...whenTruethenStateResults))];
    const maxStatewhenTrueNumber = (Math.max(...whenTruethenStateResults)*100/(whenTruethenStateResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxStatewhenFalse = statesitems[whenFalsethenStateResults.indexOf(Math.max(...whenFalsethenStateResults))];
    const maxStatewhenFalseNumber = (Math.max(...whenFalsethenStateResults)*100/(whenFalsethenStateResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxStatewhenTrueId=whenTruethenStateResults.indexOf(Math.max(...whenTruethenStateResults));
    const truemaxStatewhenFalseNumber = (whenFalsethenStateResults[maxStatewhenTrueId]*100/(whenFalsethenStateResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxStatewhenFalseId=whenFalsethenStateResults.indexOf(Math.max(...whenFalsethenStateResults));
    const falsemaxStatewhenTrueNumber = (whenTruethenStateResults[maxStatewhenFalseId]*100/(whenTruethenStateResults.reduce((a, b) => (a + b), 0))).toFixed(0);


    finalResult2 = whenTruepmaxState>80? 
                   'You are more likely to do '+habitname + ' when you are ' + maxStateName+'. (' + whenTruepmaxState + '%)'
               : 'no relevant result for '+ statename + ' > '+ habitname + '.';
    finalResult1 = (maxStatewhenTrueNumber>80 && truemaxStatewhenFalseNumber<20) ?
                        (maxStatewhenFalseNumber>80 && falsemaxStatewhenTrueNumber<20) ?
                            'When you do '+ habitname + ' you are likely to feel '+ maxStatewhenTrue + ' (' + maxStatewhenTrueNumber+ "%), and when you don't do it you are likely to feel " + maxStatewhenFalse + '. (' + maxStatewhenFalseNumber+ '%)'
                        :'When you do '+ habitname + ' you are likely to feel '+ maxStatewhenTrue + '. (' + maxStatewhenTrueNumber+ '%)'
                    : (maxStatewhenFalseNumber>80 && falsemaxStatewhenTrueNumber<20) ?
                            "When you don't do"+ habitname + ' you are likely to feel '+ maxStatewhenFalse + '. (' + maxStatewhenFalseNumber+ '%)'
                    :'no relevant result for '+ habitname + ' > '+ statename + '.';

    return {'result':direction?finalResult1:finalResult2,'resultNumber':direction?maxPwhenStatethenTrueResults:maxStatewhenTrueNumber};
}
else{
    return {'result':'no result : undefined indicators','resultNumber':0};
}

}

export default StateHabit;