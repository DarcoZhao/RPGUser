var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

    desc.value = function () {

        //如果战斗力缓存不存在并且flag为脏，获取战斗力的函数,否则直接使用缓存的战斗力
        if (this["fightPowerCache"] == null || this["dirtyFlag"] == true){

            this["dirtyFlag"] = false;

            //得到战斗力缓存的值
            this["fightPowerCache"] = method.apply(this);
            return method.apply(this);
        }
        else if(this["fightPowerCache"] != null && this["dirtyFlag"] == false) {
          
            console.log("use cache");
            return target["fightPowerCache"];
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

    name = "Darco";
    money = 0;
    //undealGold = 0;
    exp = 0;
    level = 0;
    fightPowerCache = null;
    dirtyFlag = false;

    //User与Hero为聚合关系的表现
    heroes : Hero[] = [];

    constructor(){
        this.money = 0;
        //this.undealGold = 0;
        this.exp = 0;
        this.level = 0;
    }

    
    heroesInTeam : Hero[] = [];


    //@Cache
    get fightPower(){

        var result = 0;
        this.heroesInTeam.forEach(hero => result += hero.fightPower);
        return result;
    }


    public addHero(hero : Hero){

        this.heroes.push(hero);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("User:");
        console.log("Level:" + this.level);
        console.log("Exp：" + this.exp);
        console.log("Money:" + this.money);
        console.log("fightPower:" + this.fightPower)
    }

}

class Hero{

    public isInteam : boolean = false;
    private level = 0;
    private baseAttack = 0;
    private baseProtect = 0;
    private baseHp = 0;
    private rare = 0;
    private equipments : Equipment[] = [];
    private dirtyFlag = false;
    private fightPowerCache = null;
    private hpCache = null;
    private attackPowerCache = null;

    constructor(baseHp : number, baseAttack : number, baseProtect : number, rare : number){

        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseProtect = baseProtect;
        this.baseHp = baseHp;
        this.rare = rare;

    }

    //@HpCache
    get hp(){

        var result = 0;
        this.equipments.forEach(e => result += e.protectBoost);
        return result + this.baseHp + (1 + (1-this.rare)*0.5) * this.level;
    }

    //@attackCache
    get attack(){

        var result = 0;

        //将所有装备的攻击力累加
        this.equipments.forEach(e => result += e.attackBoost);
        return (result + this.baseAttack) ^ this.level * 0.85;
    }

    get protect(){

        var result = 0;

        this.equipments.forEach(e => result += e.protectBoost);
        return (result + this.baseProtect) ^ this.level;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.equipments.forEach(e => result += e.fightPower);
        return result + 2.7^(this.attack * 0.5 + this.protect * 0.5 + this.hp*0.02) ;

    }

    public addEquipment(equipment : Equipment){

        this.equipments.push(equipment);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("rare:" + this.rare);
        console.log("attack:" + this.attack);
        console.log("protect:" + this.protect);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    }

}


class Equipment{

    private jewels : Jewel[] = [];
    private quality : equipmentQuality;
    private baseAttack = 0;
    private baseProtect = 0;
    private fightPowerCache = null;
    private dirtyFlag = false;
    private protectCache = null;
    private attackPowerCache = null;

    constructor(quality : equipmentQuality, baseAttack : number, basePro : number){

        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseProtect = basePro;
    }


    //@attackCache
    get attackBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.attackBoost);
        return result + this.baseAttack;
    }

    get protectBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.protectBoost);
        return result + this.baseProtect;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.jewels.forEach(e => result += e.fightPower);       
        return result + 2.7 ^ ((this.protectBoost * 0.45 + this.attackBoost * 0.55) * this.quality);

    }

    public addJewel(jewel : Jewel){

        this.jewels.push(jewel);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("protectBoost:" + this.protectBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }

}


class Jewel{
  
    private level : jewelLevel;
    private protectBoostCoefficient = 0;
    private attackBoostCoefficient = 0;

    constructor(level : jewelLevel, protectBoostCoefficient : number, attackBoostCoefficient : number){

        this.level = level;
        this.protectBoostCoefficient = protectBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;

    }

    get protectBoost(){

        return this.protectBoostCoefficient * this.level;
    }

    get attackBoost(){

        return this.attackBoostCoefficient * this.level;
    }

    
    get fightPower(){

        return 2.7 ^ ((this.protectBoost * 0.5 + this.attackBoost * 0.5)*this.level);
    }

    public show(){

        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.protectBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }
}

//一级，二级，三级宝石
enum jewelLevel{

    one = 1,
    two = 2,
    three = 3
}

//装备品质分为金，银，铜，铁
enum equipmentQuality{

    iron = 1,
    copper = 2,
    silver = 3,
    gold = 4
}

//英雄稀有度
enum heroValue{

    r = 1,
    sr = 2,
    ssr = 3
}


