
class Calc{

    public getSum(arr:number[]):number{
        if(!arr || arr.length ===0){
            throw new Error("array cant be empty")
        }
        let sum = 0;
        for(const item of arr){
            sum+=item;
        }
        return sum;
    }
}

export const calc = new Calc();