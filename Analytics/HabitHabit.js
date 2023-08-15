

function HabitHabit (habits1,habits2) {

    let when1then2 = [];
    let when2then1 = [];
    let whennot1then2 = [];
    let whennot2then1 = [];

    if(habits1[0]!==undefined && habits2[0]!==undefined) {
    const name1=habits1[0].name;
    const name2=habits2[0].name;

    const allYears = [... new Set([...habits1.map(c => c.year),...habits2.map(c => c.year)])];

        for (var i=0;i<allYears.length;i++) {
            if(habits1.filter(c => c.year==allYears[i]).length>0 && habits2.filter(c => c.year==allYears[i]).length>0) {
                for (var j=0;j<12;j++) {
                    if(habits1.filter(c => c.year==allYears[i] && c.month==j).length>0 && habits2.filter(c => c.year==allYears[i] && c.month==j).length>0) {
                        for (var k=1;k<32;k++) {
                            (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined|| habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined)? undefined:habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? (habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? when1then2.push(1) : when1then2.push(0)) : when1then2.push('null');
                            (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined|| habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined)? undefined:habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? when2then1.push(1) : when2then1.push(0)) : when2then1.push('null');
                            (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined|| habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined)? undefined:habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==0? (habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? whennot1then2.push(1) : whennot1then2.push(0)) : whennot1then2.push('null');
                            (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined|| habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k))==undefined)? undefined:habits2.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==0? (habits1.filter(c=>(c.year==allYears[i] && c.month==j && c.day==k)).map(c=>c.state)[0]==1? whennot2then1.push(1) : whennot2then1.push(0)) : whennot2then1.push('null');
                        }
                    }
                }
            }
        }

    const when1then2result = (when1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);
    const when2then1result = (when2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);    
    const whennot1then2result = (whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   
    const whennot2then1result = (whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   

    const finalResult =
    when2then1result > 80 && when1then2result > 80
        ? whennot1then2result < 20 && whennot2then1result < 20
            ? when2then1result === 100 && when1then2result === 100
                ? "You always do " + name1 + " and " + name2 + " together."
                : when2then1result === 100
                    ? "You do " + name2 + " only when you do " + name1 + "."
                    : "You usually do " + name1 + " and " + name2 + " together (" + when2then1result + "%)."
            : whennot1then2result < 20
                ? when2then1result === 100
                    ? "You also always do " + name2 + " when you do: " + name1 + "."
                    : "When you do " + name1 + " there is more chance you do " + name2 + " (" + when2then1result + "%)."
                : "nothing"
        : "nothing";
        return {'result':finalResult,'resultNumber':when2then1result};
    
    }
    else{
        return {'result':'no result : undefined indicators','resultNumber':0};
    }

}

export default HabitHabit;