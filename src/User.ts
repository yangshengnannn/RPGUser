var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

    desc.value = function () {

        //用于缓存战斗力，若战斗力缓存存在，dirtyflag不能访问，跳过获取战斗力的函数,直接使用缓存的战斗力
        if (this["fightPowerCache"] != null && this["dirtyFlag"] == false) {
          
            console.log("use cache");
            return target["fightPowerCache"];
        } 
        else {

            this["dirtyFlag"] = false;

            //获得用于战斗力缓存的值
            this["fightPowerCache"] = method.apply(this);
            return method.apply(this);
        }

    }
    return desc;
}


var HpCache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

    desc.value = function () {

        if (this["hpCache"] != null && this["dirtyFlag"] == false) {
          
            console.log("use HpCache");
            return target["hpCache"];
        } 
        else {

            this["dirtyFlag"] = false;
            this["hpCache"] = method.apply(this);
            return method.apply(this);
        }

    }
    return desc;
}


var attackCache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

    desc.value = function () {

        if (this["attackCache"] != null && this["dirtyFlag"] == false) {
          
            console.log("use attackCache");
            return target["attackCache"];
        } 
        else {

            this["dirtyFlag"] = false;
            this["attackCache"] = method.apply(this);
            return method.apply(this);
        }

    }
    return desc;
}



class User{

    money = 1000;

    undealMoney = 1000;

    currentExp = 0;

    level = 0;

    fightPowerCache = null;

    dirtyFlag = false;

    //User与Hero为聚合关系的表现
    heroes : Hero[] = [];

    constructor(){

        this.money = 1000;
        this.undealMoney = 1000;
        this.currentExp = 0;
        this.level = 0;

    }

    //基础数值写法
    
    //heroesInTeam : Hero[] = [];

    //高阶数值写法
    get heroesInTeam(){

        return this.heroes.filter(hero => hero.isInteam);
    }


    //@Cache
    get fightPower(){

        var result = 0;
        
        //forEach : 将数组中每个元素都执行
        this.heroesInTeam.forEach(hero => result += hero.fightPower);
        return result;
    }


    public addHero(hero : Hero){

        this.heroes.push(hero);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("User:");
        console.log("level:" + this.level);
        console.log("currentExp：" + this.currentExp);
        console.log("undealGold:" + this.undealMoney);
        console.log("money:" + this.money);
        console.log("fightPower:" + this.fightPower)
    }

}

class Hero{

    public isInteam : boolean = false;
    private baseHp = 100;
    private baseAttack = 50;
    private  level = 0;
    private  value = 0;
    private equipments : Equipment[] = [];
    private dirtyFlag = false;
    private fightPowerCache = null;
    private hpCache = null;
    private attackPowerCache = null;
    constructor(baseHp : number, baseAttack : number, value : number){
        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
        this.value = value;

    }

    //@HpCache
    get hp(){

        var result = 0;
        this.equipments.forEach(e => result += e.hpBoost);
        return result + this.baseHp + (2 + 0.4 * this.value) * this.level;
    }

    //@attackCache
    get attack(){

        var result = 0;

        //累加装备的攻击力
        this.equipments.forEach(e => result += e.attackBoost);
        return result + this.baseAttack + (2 + 0.6 * this.value) * this.level;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.equipments.forEach(e => result += e.fightPower);
        return result + (this.hp * 650 + this.attack * 450) * 1;

    }

    public addEquipment(equipment : Equipment){

        this.equipments.push(equipment);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("value:" + this.value);
        console.log("attack:" + this.attack);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    }

}


class Equipment{

    private jewels : Jewel[] = [];
    private quality : equipmentQuality;
    private baseAttack = 0;
    private baseHp = 0;
    private fightPowerCache = null;
    private dirtyFlag = false;
    private hpCache = null;
    private attackPowerCache = null;
    constructor(quality : equipmentQuality, baseAttack : number, baseHp : number){
        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
    }


    //@attackCache
    get attackBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.attackBoost);
        return result + (this.quality * 15) + this.baseAttack;
    }

    //@HpCache
    get hpBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.hpBoost);
        return result + (this.quality * 15) + this.baseHp;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.jewels.forEach(e => result += e.fightPower);       
        return result + (this.hpBoost * 350 + this.attackBoost * 450) * 0.6;

    }

    public addJewel(jewel : Jewel){

        this.jewels.push(jewel);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }

}


class Jewel{
  
    private level : jewelLevel;
    private hpBoostCoefficient = 0;
    private attackBoostCoefficient = 0;
    constructor(level : jewelLevel, hpBoostCoefficient : number, attackBoostCoefficient : number){
        this.level = level;
        this.hpBoostCoefficient = hpBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;

    }

    get hpBoost(){
        return this.hpBoostCoefficient * this.level;
    }

    get attackBoost(){
        return this.attackBoostCoefficient * this.level;
    }

    
    get fightPower(){
        return this.hpBoost * 300 + this.attackBoost * 500;
    }

    public show(){
        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }
}

//不同级别的宝物
enum jewelLevel{

    one = 1,
    two = 2,
    three = 3
}

//装备分为四个不同的等级
enum equipmentQuality{
    grey = 1,
    green = 2,
    red = 3,
    yellow = 4
}

//heros rarility
enum heroValue{
    good = 1,
    better = 2,
    excellent = 3
}


