

function MoodHabit (moods, habits, direction) {

    if(habits[0]!==undefined) {

    const habitname=habits[0].name;
    const moodname="MOOD";

    const MoodsFirstYear = Math.min([...new Set(moods.map(c=>c.year))]);
    const MoodsFirstMonth = Math.min([...new Set(moods.filter(c=>c.year==MoodsFirstYear).map(c=>c.month))]);
    const MoodsFirstDay = Math.min(...moods.filter(c=>(c.year==MoodsFirstYear&&c.month==MoodsFirstMonth)).map(c=>c.day));
    const MoodsLastYear = Math.max([...new Set(moods.map(c=>c.year))]);
    const MoodsLastMonth = Math.max([...new Set(moods.filter(c=>c.year==MoodsLastYear).map(c=>c.month))]);
    const MoodsLastDay = Math.max(...moods.filter(c=>(c.year==MoodsLastYear&&c.month==MoodsLastMonth)).map(c=>c.day));
    const MoodsFirstDate = new Date(MoodsFirstYear,MoodsFirstMonth,MoodsFirstDay);
    const MoodsLastDate = new Date(MoodsLastYear,MoodsLastMonth,MoodsLastDay);

    const MoodsPeriod= (MoodsLastDate-MoodsFirstDate)/(1000*60*60*24)+1;

    let whenMoodthenTrue = [];
    const whenTruethenMood = [];
    const whenFalsethenMood= [];

    const numberOfmoods = [...new Set(moods.map(c=>c.mood))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined).length;
    const moodsmoods = [...new Set(moods.map(c=>c.mood))].filter(c=>c!=='').filter(c=>c!==null).filter(c=>c!==undefined);

    for (var i=0;i<MoodsPeriod;i++) {
        let habitsElement = habits.filter(c=>(c.year==moods[i].year)&&(c.month==moods[i].month)&&(c.day==moods[i].day));
        for(var j=0;j<numberOfmoods;j++) {
            moods[i].mood==moodsmoods[j]? (habitsElement.map(c=>c.state)[0]==1? whenMoodthenTrue.push(moodsmoods[j]) : undefined) : undefined;
            habitsElement.map(c=>c.state)[0]==1? moods[i].mood==moodsmoods[j]? whenTruethenMood.push(moods[i].mood) : undefined: undefined;
            habitsElement.map(c=>c.state)[0]==0? moods[i].mood==moodsmoods[j]? whenFalsethenMood.push(moods[i].mood) : undefined: undefined;
        }
    }
    const whenMoodthenTrueResults =[];
    const moodCount = [];
    const whenTruethenMoodResults =[];
    const whenFalsethenMoodResults =[];

    for(var i=0;i<numberOfmoods;i++) {
        let counter = 0;
        let moodCounter = 0;
        for(var j=0;j<whenMoodthenTrue.length;j++){
            whenMoodthenTrue[j]==moodsmoods[i]?
                counter++ 
            : undefined;
        };
        whenMoodthenTrueResults.push(counter);
        for(var j=0;j<moods.length;j++){
            moods[j].mood==moodsmoods[i]?
                moodCounter++ 
            : undefined;
        };
        moodCount.push(moodCounter);
    }; 

    for(var i=0;i<numberOfmoods;i++) {
        let counter = 0;
        for(var j=0;j<whenTruethenMood.length;j++){
            whenTruethenMood[j]==moodsmoods[i]?
                counter++ 
            : undefined;
        };
        whenTruethenMoodResults.push(counter);
    };

    for(var i=0;i<numberOfmoods;i++) {
        let counter = 0;
        for(var j=0;j<whenFalsethenMood.length;j++){
            whenFalsethenMood[j]==moodsmoods[i]?
                counter++ 
            : undefined;
        };
        whenFalsethenMoodResults.push(counter);
    };


    const sumwhenMoodthenTrueResults = whenMoodthenTrueResults.reduce((a, b) => (a + b), 0);
    const maxPwhenMoodthenTrueResults = ((Math.max(...whenMoodthenTrueResults)/sumwhenMoodthenTrueResults)).toFixed(2)*100;
    const maxMoodNumber = Math.max(...whenMoodthenTrueResults);
    const maxMoodIndex = maxMoodNumber==undefined? 0: whenMoodthenTrueResults.indexOf(Math.max(...whenMoodthenTrueResults));
    const maxMoodName = moodsmoods[maxMoodIndex];
    const whenTruePmaxMood = maxMoodNumber==undefined? 0: (maxMoodNumber/moodCount[maxMoodIndex]*100).toFixed(0);

    const maxMoodwhenTrue=moodsmoods[whenTruethenMoodResults.indexOf(Math.max(...whenTruethenMoodResults))];
    const maxMoodwhenTrueNumber = (Math.max(...whenTruethenMoodResults)*100/(whenTruethenMoodResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxMoodwhenFalse = moodsmoods[whenFalsethenMoodResults.indexOf(Math.max(...whenFalsethenMoodResults))];
    const maxMoodwhenFalseNumber = (Math.max(...whenFalsethenMoodResults)*100/(whenFalsethenMoodResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxMoodwhenTrueId=whenTruethenMoodResults.indexOf(Math.max(...whenTruethenMoodResults));
    const truemaxMoodwhenFalseNumber = (whenFalsethenMoodResults[maxMoodwhenTrueId]*100/(whenFalsethenMoodResults.reduce((a, b) => (a + b), 0))).toFixed(0);
    const maxMoodwhenFalseId=whenFalsethenMoodResults.indexOf(Math.max(...whenFalsethenMoodResults));
    const falsemaxMoodwhenTrueNumber = (whenTruethenMoodResults[maxMoodwhenFalseId]*100/(whenTruethenMoodResults.reduce((a, b) => (a + b), 0))).toFixed(0);


    finalResult2 = whenTruePmaxMood>80? 
                   'You are more likely to do '+habitname + ' when you are ' + maxMoodName+'. (' + whenTruePmaxMood + '%)'
               : 'no relevant result for '+ moodname + ' > '+ habitname + '.';
    finalResult1 = (maxMoodwhenTrueNumber>80 && truemaxMoodwhenFalseNumber<20) ?
                        (maxMoodwhenFalseNumber>80 && falsemaxMoodwhenTrueNumber<20) ?
                            'When you do '+ habitname + ' you are likely to feel '+ maxMoodwhenTrue + ' (' + maxMoodwhenTrueNumber+ "%), and when you don't do it you are likely to feel " + maxMoodwhenFalse + '. (' + maxMoodwhenFalseNumber+ '%)'
                        :'When you do '+ habitname + ' you are likely to feel '+ maxMoodwhenTrue + '. (' + maxMoodwhenTrueNumber+ '%)'
                    : (maxMoodwhenFalseNumber>80 && falsemaxMoodwhenTrueNumber<20) ?
                            "When you don't do"+ habitname + ' you are likely to feel '+ maxMoodwhenFalse + '. (' + maxMoodwhenFalseNumber+ '%)'
                    :'no relevant result for '+ habitname + ' > '+ moodname + '.';

    return {'result':direction?finalResult1:finalResult2,'resultNumber':direction?maxPwhenMoodthenTrueResults:maxMoodwhenTrueNumber};
}
else{
    return {'result':'no result : undefined indicators','resultNumber':0};
}

}

export default MoodHabit;