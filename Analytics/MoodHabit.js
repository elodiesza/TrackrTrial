

function MoodHabit (habits,moods,setResult, setResultNumber) {


    let whenMoodthenTrue = [];

    const habitname=habits[0].name;
    const moodname="mood";

    const MoodsFirstYear = Math.min([...new Set(moods.map(c=>c.year))]);
    const MoodsFirstMonth = Math.min([...new Set(moods.filter(c=>c.year==MoodsFirstYear).map(c=>c.month))]);
    const MoodsFirstDay = Math.min(...moods.filter(c=>(c.year==MoodsFirstYear&&c.month==MoodsFirstMonth)).map(c=>c.day));
    const MoodsLastYear = Math.max([...new Set(moods.map(c=>c.year))]);
    const MoodsLastMonth = Math.max([...new Set(moods.filter(c=>c.year==MoodsLastYear).map(c=>c.month))]);
    const MoodsLastDay = Math.max(...moods.filter(c=>(c.year==MoodsLastYear&&c.month==MoodsLastMonth)).map(c=>c.day));
    const MoodsFirstDate = new Date(MoodsFirstYear,MoodsFirstMonth,MoodsFirstDay);
    const MoodsLastDate = new Date(MoodsLastYear,MoodsLastMonth,MoodsLastDay);

    const MoodsPeriod= (MoodsLastDate-MoodsFirstDate)/(1000*60*60*24)+1;

    const numberOfmoods = [...new Set(moods.map(c=>c.mood))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined).length;
    const moodsmoods = [...new Set(moods.map(c=>c.mood))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined);

    for (var i=0;i<MoodsPeriod;i++) {
        let habitsElement = habits.filter(c=>(c.year==moods[i].year)&&(c.month==moods[i].month)&&(c.day==moods[i].day));
        for(var j=0;j<numberOfmoods;j++) {
            moods[i].mood==moodsmoods[j]? habitsElement.map(c=>c.state)[0]==1? whenMoodthenTrue.push(moodsmoods[j]) : undefined : undefined;
        }
    }

    const whenMoodthenTrueResults =[];

    for(var i=0;i<numberOfmoods;i++) {
        let counter = 0;
        for(var j=0;j<whenMoodthenTrue.length;j++){
            whenMoodthenTrue[j]==moodsmoods[i]?
                counter++ 
            : undefined;
        };
        whenMoodthenTrueResults.push(counter);
    };

    const sumwhenMoodthenTrueResults = whenMoodthenTrueResults.reduce((a, b) => (a + b), 0);
    const maxPwhenMoodthenTrueResults = ((Math.max(...whenMoodthenTrueResults)/sumwhenMoodthenTrueResults)).toFixed(2)*100;
    const maxPwhenMoodthenTrueResultsmood = moodsmoods[whenMoodthenTrueResults.indexOf(Math.max(...whenMoodthenTrueResults))];

    //const when1then2result = (when1then2.filter(mood => mood !== null && (mood === 0 || mood === 1)).reduce((a, b) => (a + b), 0)/when1then2.filter(mood => mood !== null && (mood === 0 || mood === 1)).length*100).toFixed(0);
    //const when2then1result = (when2then1.filter(mood => mood !== null && (mood === 0 || mood === 1)).reduce((a, b) => (a + b), 0)/when2then1.filter(mood => mood !== null && (mood === 0 || mood === 1)).length*100).toFixed(0);    
    //const whennot1then2result = (whennot1then2.filter(mood => mood !== null && (mood === 0 || mood === 1)).reduce((a, b) => (a + b), 0)/whennot1then2.filter(mood => mood !== null && (mood === 0 || mood === 1)).length*100).toFixed(0);   
    //const whennot2then1result = (whennot2then1.filter(mood => mood !== null && (mood === 0 || mood === 1)).reduce((a, b) => (a + b), 0)/whennot2then1.filter(mood => mood !== null && (mood === 0 || mood === 1)).length*100).toFixed(0);   


    finalResult = maxPwhenMoodthenTrueResults>80? 
                        'When '+ moodname + ' is ' + maxPwhenMoodthenTrueResultsmood+' you are more likely to do '+habitname + '. (' + maxPwhenMoodthenTrueResults+ '%)'
                    : 'no result';



    setResultNumber(maxPwhenMoodthenTrueResults);
    setResult(finalResult);

}

export default MoodHabit;