

function HabitHabit (habits1,habits2) {

    let when1then2 = [];
    let when2then1 = [];
    let whennot1then2 = [];
    let whennot2then1 = [];

    const name1=habits1[0].name;
    const name2=habits2[0].name;

    const maxLength=habits1.length==habits2.length? habits1.length : Math.max[habits1.length,habits2.length];
    const blankLength = Math.abs(habits1.length-habits2.length);

    // This works only if the habits are never stopped earlier one another 
    const year1 = habits1[0].year;
    const year2 = habits2[0].year;

    const firstYear = habits1[0].year==habits2[0].year? year1:Math.min[year1,year2];
    const firstMonth = habits1[0]==habits2[0].year? habits1[0].month==habits2[0].month? habits1[0].month:Math.min[habits1[0].month,habits2[0].month]: habits1[0].year<habits2[0].year? habits1[0].month: habits2[0].month;


        for (var i=0;i<maxLength;i++) {
            if(i<blankLength) {
                i++;
            }
            else {
                habits1[i].state==true? (habits2[i].state==true? when1then2.push(1) : when1then2.push(0)) : when1then2.push('null');
                habits2[i].state==true? (habits1[i].state==true? when2then1.push(1) : when2then1.push(0)) : when2then1.push('null');
                habits1[i].state==false? (habits2[i].state==true? whennot1then2.push(1) : whennot1then2.push(0)) : whennot1then2.push('null');
                habits2[i].state==false? (habits1[i].state==true? whennot2then1.push(1) : whennot2then1.push(0)) : whennot2then1.push('null');
                i++;
            }
        }

    const when1then2result = (when1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);
    const when2then1result = (when2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/when2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);    
    const whennot1then2result = (whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot1then2.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   
    const whennot2then1result = (whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).reduce((a, b) => (a + b), 0)/whennot2then1.filter(item => item !== null && (item === 0 || item === 1)).length*100).toFixed(0);   


    const finalResult = when2then1result>80&&when1then2result>80? 
                            whennot1then2result<20 && whennot2then1result<20? 
                                when2then1result==100&&when1then2result==100?
                                    "You always do "+ name1 +" and "+name2+" together.":
                                when2then1result==100?
                                    "You always do "+ name2 +" when you do " + name1 + "." :
                                "You usually do "+ name1 +" and "+name2+" together ("+when2then1result+ "%)." 
                            :(whennot1then2result<20?
                                when2then1result==100?
                                    "You also always do "+name2+" when you do: " + name1 + "." :
                                "You do "+ name1 +" there is more chance you do "+name2+" ("+when2then1result+ "%)." :
                            "nothing") :
                        "nothing";

    return {'result':finalResult,'resultNumber':when2then1result};
}

export default HabitHabit;