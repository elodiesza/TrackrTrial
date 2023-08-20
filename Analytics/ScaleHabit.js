function ScaleHabit (scales,habits,direction) {

    if(habits[0]!==undefined && scales[0]!==undefined) {

        const habitname=habits[0].name;
        const scalename=scales[0].name;

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

        let infresults =results;
        let supresults =results;
        // for True inf to value
        const infCleanedResults = () => {
            for (var i=0;i<infresults.length;i++){
                infresults[i]=(infresults[i].infTrueCount<80 || infresults[i].supFalseCount<80) ? {'limit':i,'infTrueCount':null,'supFalseCount':null} : infresults[i];
            }
            return infresults;
        }
        const inflimitArray = infresults.map(c=>c.infTrueCount+c.supFalseCount);
        const inflimitValue = Math.max(...inflimitArray)==undefined? null : Math.max(...inflimitArray);
        const inflimitIndex = inflimitValue==null? null : inflimitArray.indexOf(inflimitValue);
        const inflimit = (inflimitIndex==null||inflimitIndex==-1)? null : results[inflimitIndex].limit;

        // for True sup to value
        const supCleanedResults = () => {
            for (var i=0;i<supresults.length;i++){
                supresults[i]=(supresults[i].infTrueCount>20 || supresults[i].supFalseCount>20) ? {'limit':i,'infTrueCount':null,'supFalseCount':null} : supresults[i];
            }
            return supresults;
        }

        const suplimitArray = supresults.map(c=>c.supTrueCount+c.supFalseCount);
        const suplimitValue = Math.min(...suplimitArray)==undefined? null : Math.min(...suplimitArray);
        const suplimitIndex = suplimitValue==null? null : suplimitArray.indexOf(suplimitValue);
        const suplimit = (suplimitIndex==null||suplimitIndex==-1)? null : results[suplimitIndex].limit;



        const result = inflimit!==null?
                            'You are more likely to do '+habitname+' when '+scalename+' is under '+inflimit+'. ('+ infresults.map(c=>c.infTrueCount)[inflimitIndex]+'% of the time.)' :
                            suplimit!==null?
                                'You are more likely to do '+habitname+' when '+scalename+' is over '+suplimit+'. ('+ supresults.map(c=>c.supTrueCount)[suplimitIndex]+'% of the time.)' :
                                'There is no correlation between '+habitname+' and '+scalename+'.';

        return {'result': result,'resultNumber':100};
    }
    else{
        return {'result':'no result : undefined indicators','resultNumber':0};
    }
}

export default ScaleHabit;