

function StateHabit (habits,states,setResult, setResultNumber) {

    let whenTruethenState = [];
    let whenStatethenHabit = [];
    let whenStatethenTrue = [];
    let whenFalsethenState = [];

    const habitname=habits[0].name;
    const statename=states[0].name;

    const maxLength=habits.length==states.length? habits.length : Math.max[habits.length,states.length];
    const blankLength = Math.abs(habits.length-states.length);

    // This works only if the habits are never stopped earlier one another 
    const year1 = habits[0].year;
    const year2 = states[0].year;

    const firstYear = habits[0].year==states[0].year? year1:Math.min[year1,year2];
    const firstMonth = habits[0]==states[0].year? habits[0].month==states[0].month? habits[0].month:Math.min[habits[0].month,states[0].month]: habits[0].year<states[0].year? habits[0].month: states[0].month;

    const numberOfItems = [...new Set(states.map(c=>c.item))].filter(c=>c!=='').length;
    const statesItems = [...new Set(states.map(c=>c.item))].filter(c=>c!=='');

    for (var i=0;i<maxLength;i++) {
        if(i<blankLength) {
            i++;
        }
        else {
            for(var j=0;j<numberOfItems;j++) {
                states[i].item==statesItems[j]? habits[i].state==true? whenStatethenTrue.push(statesItems[j]) : undefined : undefined;
                //habits[i].state==true? states[i].item==statesItems[j]? whenTruethenState.push(statesItems[j]) : undefined : undefined;
                //states[i].item!==statesItems[j]? habits[i].state==true? whennotStatethenTrue.push(statesItems[j]) : undefined : undefined;
                //habits[i].state==false? states[i].item==statesItems[j]? whenFalsethenState.push(statesItems[j]) : undefined : undefined;
            }
        }
    }

    const whenStatethenTrueResults =[];

    for(var i=0;i<numberOfItems;i++) {
        let counter = 0;
        for(var j=0;j<whenStatethenTrue.length;j++){
            whenStatethenTrue[j]==statesItems[i]?
                counter++ 
            : undefined;
        };
        whenStatethenTrueResults.push(counter);
    };

    const sumwhenStatethenTrueResults = whenStatethenTrueResults.reduce((a, b) => (a + b), 0);
    const maxPwhenStatethenTrueResults = (Math.max(...whenStatethenTrueResults)/sumwhenStatethenTrueResults)*100;
    const maxPwhenStatethenTrueResultsItem = statesItems[whenStatethenTrueResults.indexOf(Math.max(...whenStatethenTrueResults))];

    //const when1then2result = (when1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);
    //const when2then1result = (when2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);    
    //const whennot1then2result = (whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   
    //const whennot2then1result = (whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   

    finalResult = maxPwhenStatethenTrueResults>80? 
                        'When '+ statename + ' is ' + maxPwhenStatethenTrueResultsItem+' you are more likely to do '+habitname + '. (' + maxPwhenStatethenTrueResults+ '%)'
                    : 'no result';



    setResultNumber(maxPwhenStatethenTrueResults);
    setResult(finalResult);

}

export default StateHabit;