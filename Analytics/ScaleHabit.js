function ScaleHabit (scales,habits,direction) {

    if(habits[0]!==undefined && scales[0]!==undefined) {

        const habitname=habits[0].name;
        const scalename=scales[0].name;

// Calculate limit with 80% outcome

        const minvalue = Math.min(...scales.filter(c=>c.value!==null).map(c=>c.value));
        const maxvalue = Math.max(...scales.filter(c=>c.value!==null).map(c=>c.value));

        const results = [];

        for (var i=minvalue+1;i<maxvalue-1;i++){
            let trueCount=0;
            let falseCount=0;
            let totalSupCount=0;
            let totalInfCount=0;
            for (var j=0;j<scales.length;j++){
                (scales[j].value!==null && scales[j].value<i) ? totalInfCount++ : undefined;
                (scales[j].value!==null && scales[j].value>i) ? totalSupCount++ : undefined;
                habits[j].state==true && (scales[j].value!==null && scales[j].value<i) ? trueCount++ : undefined;
                habits[j].state==false && (scales[j].value!==null && scales[j].value>i) ? falseCount++ : undefined;
            }
            results.push({'limit':i,'infTrueCount':parseInt((trueCount*100/totalInfCount).toFixed(2)),'supFalseCount':parseInt((falseCount*100/totalSupCount).toFixed(2))});
        }

        // for True inf to value
        const infresults =results;
        const infCleanedResults = () => {
            for (var i=0;i<infresults.length;i++){
                infresults[i]=(infresults[i].infTrueCount<80 || infresults[i].supFalseCount<80) ? {'limit':i,'infTrueCount':null,'supFalseCount':null} : infresults[i];
            }
            return infresults;
        }
        const inflimitArray = infCleanedResults().map(c=>c.infTrueCount+c.supFalseCount);
        const inflimitValue = Math.max(...inflimitArray)==undefined? null : Math.max(...inflimitArray);
        const inflimitIndex = inflimitValue==null? null : inflimitArray.indexOf(inflimitValue);
        const infTruevalue = infCleanedResults().map(c=>c.infTrueCount)[inflimitIndex];
        const inflimit = (inflimitIndex==null||inflimitIndex==-1)? null : results[inflimitIndex].limit;


        // for True sup to value
        const supresults =results;
        const supCleanedResults = () => {
            for (var i=0;i<supresults.length;i++){
                supresults[i]=(supresults[i].infTrueCount>20 || supresults[i].supFalseCount>20) ? {'limit':i,'infTrueCount':null,'supFalseCount':null} : supresults[i];
            }
            return supresults;
        }
        const suplimitArray = supCleanedResults().map(c=>c.supTrueCount+c.supFalseCount);
        const suplimitValue = Math.min(...suplimitArray)==undefined? null : Math.min(...suplimitArray);
        const suplimitIndex = suplimitValue==null? null : suplimitArray.indexOf(suplimitValue);
        const supFalsevalue = supCleanedResults().map(c=>c.supFalseCount)[suplimitIndex];
        const suplimit = (suplimitIndex==null||suplimitIndex==-1)? null : results[suplimitIndex].limit;
       
        
        const result = (inflimit!==null && inflimit!==0)?
        'You are more likely to do '+habitname+' when '+scalename+' is under '+inflimit+'. ('+ infTruevalue+'% of the time.)' :
        (suplimit!==null && suplimit!==0)?
            'You are more likely to do '+habitname+' when '+scalename+' is over '+suplimit+'. ('+ supFalsevalue+'% of the time.)' :
            'There is no direct correlation between '+habitname+' and '+scalename+'.';



//Raise or decrease after habit change

        var raiseTrueCount = null;
        var raiseFalseEqualCount = null;
        var decreaseTrueEqualCount = null;
        var decreaseFalseCount = null;
        var raiseFalseCount = null;
        var decreaseTrueCount = null;
        var raiseTrueEqualCount = null;
        var decreaseFalseEqualCount = null;

        for (var i=0; i<scales.length-1;i++){
            scales[i+1].value!==null && scales[i]!==null && scales[i+1].value>scales[i].value ? (habits[i].state==true ? raiseTrueCount++ : raiseFalseEqualCount++) : undefined;
            scales[i+1].value!==null && scales[i]!==null && scales[i+1].value<scales[i].value ? (habits[i].state==false? decreaseFalseCount++ : decreaseTrueEqualCount++) : undefined;
            scales[i+1].value!==null && scales[i]!==null && scales[i+1].value>scales[i].value ? (habits[i].state==false? raiseFalseCount++ : raiseTrueEqualCount++) : undefined;
            scales[i+1].value!==null && scales[i]!==null && scales[i+1].value<scales[i].value ? (habits[i].state==true? decreaseTrueCount++ : decreaseFalseEqualCount++) : undefined;
        };

        const raiseTrueCountResult = (raiseTrueCount*100/(raiseTrueCount+raiseFalseEqualCount)).toFixed(2);
        const decreaseFalseCountResult = (decreaseFalseCount*100/(decreaseFalseCount+decreaseTrueEqualCount)).toFixed(2);
        const raiseFalseCountResult = (raiseFalseCount*100/(raiseFalseCount+raiseTrueEqualCount)).toFixed(2);
        const decreaseTrueCountResult = (decreaseTrueCount*100/(decreaseTrueCount+decreaseFalseEqualCount)).toFixed(2);


        //Here only direction==false is correct. For direction == true, need to see for scale i-1 and habit i.
        const result2 = raiseTrueCountResult>80 && decreaseFalseCountResult>80 ? 
                            (direction==true ?
                                'You are likely to do ' +habitname +' when '+scalename +' increases ('+ raiseTrueCountResult+'%)':
                                scalename +' is likely to increase when you do '+habitname+' ('+ raiseTrueCountResult+'%)'  
                            ): 
                            raiseFalseCountResult >80 && decreaseTrueCountResult >80 ?
                                (direction==true ?
                                    'You are likely to do ' +habitname +' when '+scalename +' decreases ('+ raiseFalseCountResult+'%)':
                                    scalename +" is likely to increase when you don't do "+habitname+' ('+ raiseFalseCountResult+'%)' 
                                ):
                                'There is no raise/decrease correlation between '+habitname+' and '+scalename+'.';
        
        


        return {'result': result+ ' '+ result2,'resultNumber':(inflimit!==null && inflimit!==0)?infTruevalue:(suplimit!==null && suplimit!==0)?supFalsevalue:0};
    }
    else{
        return {'result':'no result : undefined indicators','resultNumber':0};
    }
}

export default ScaleHabit;