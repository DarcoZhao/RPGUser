var Cache = function (target, propertyName, desc) {
    var method = desc.value;
    desc.value = function () {
        //如果战斗力缓存不存在并且flag为脏，获取战斗力的函数,否则直接使用缓存的战斗力
        if (this["fightPowerCache"] == null || this["dirtyFlag"] == true) {
            this["dirtyFlag"] = false;
            //得到战斗力缓存的值
            this["fightPowerCache"] = method.apply(this);
            return method.apply(this);
        }
        else if (this["fightPowerCache"] != null && this["dirtyFlag"] == false) {
            console.log("use cache");
            return target["fightPowerCache"];
        }
    };
    return desc;
};
var HpCache = function (target, propertyName, desc) {
    var method = desc.value;
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
    };
    return desc;
};
var attackCache = function (target, propertyName, desc) {
    var method = desc.value;
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
    };
    return desc;
};
var User = (function () {
    function User() {
        this.name = "Darco";
        this.money = 0;
        //undealGold = 0;
        this.exp = 0;
        this.level = 0;
        this.fightPowerCache = null;
        this.dirtyFlag = false;
        //User与Hero为聚合关系的表现
        this.heroes = [];
        this.heroesInTeam = [];
        this.money = 0;
        //this.undealGold = 0;
        this.exp = 0;
        this.level = 0;
    }
    var d = __define,c=User,p=c.prototype;
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            this.heroesInTeam.forEach(function (hero) { return result += hero.fightPower; });
            return result;
        }
    );
    p.addHero = function (hero) {
        this.heroes.push(hero);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("User:");
        console.log("Level:" + this.level);
        console.log("Exp：" + this.exp);
        console.log("Money:" + this.money);
        console.log("fightPower:" + this.fightPower);
    };
    return User;
}());
egret.registerClass(User,'User');
var Hero = (function () {
    function Hero(baseHp, baseAttack, baseProtect, rare) {
        this.isInteam = false;
        this.level = 0;
        this.baseAttack = 0;
        this.baseProtect = 0;
        this.baseHp = 0;
        this.rare = 0;
        this.equipments = [];
        this.dirtyFlag = false;
        this.fightPowerCache = null;
        this.hpCache = null;
        this.attackPowerCache = null;
        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseProtect = baseProtect;
        this.baseHp = baseHp;
        this.rare = rare;
    }
    var d = __define,c=Hero,p=c.prototype;
    d(p, "hp"
        //@HpCache
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.protectBoost; });
            return result + this.baseHp + (1 + (1 - this.rare) * 0.5) * this.level;
        }
    );
    d(p, "attack"
        //@attackCache
        ,function () {
            var result = 0;
            //将所有装备的攻击力累加
            this.equipments.forEach(function (e) { return result += e.attackBoost; });
            return (result + this.baseAttack) ^ this.level * 0.85;
        }
    );
    d(p, "protect"
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.protectBoost; });
            return (result + this.baseProtect) ^ this.level;
        }
    );
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.fightPower; });
            return result + 2.7 ^ (this.attack * 0.5 + this.protect * 0.5 + this.hp * 0.02);
        }
    );
    p.addEquipment = function (equipment) {
        this.equipments.push(equipment);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("rare:" + this.rare);
        console.log("attack:" + this.attack);
        console.log("protect:" + this.protect);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    };
    return Hero;
}());
egret.registerClass(Hero,'Hero');
var Equipment = (function () {
    function Equipment(quality, baseAttack, basePro) {
        this.jewels = [];
        this.baseAttack = 0;
        this.baseProtect = 0;
        this.fightPowerCache = null;
        this.dirtyFlag = false;
        this.protectCache = null;
        this.attackPowerCache = null;
        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseProtect = basePro;
    }
    var d = __define,c=Equipment,p=c.prototype;
    d(p, "attackBoost"
        //@attackCache
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.attackBoost; });
            return result + this.baseAttack;
        }
    );
    d(p, "protectBoost"
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.protectBoost; });
            return result + this.baseProtect;
        }
    );
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.fightPower; });
            return result + 2.7 ^ ((this.protectBoost * 0.45 + this.attackBoost * 0.55) * this.quality);
        }
    );
    p.addJewel = function (jewel) {
        this.jewels.push(jewel);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("protectBoost:" + this.protectBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Equipment;
}());
egret.registerClass(Equipment,'Equipment');
var Jewel = (function () {
    function Jewel(level, protectBoostCoefficient, attackBoostCoefficient) {
        this.protectBoostCoefficient = 0;
        this.attackBoostCoefficient = 0;
        this.level = level;
        this.protectBoostCoefficient = protectBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;
    }
    var d = __define,c=Jewel,p=c.prototype;
    d(p, "protectBoost"
        ,function () {
            return this.protectBoostCoefficient * this.level;
        }
    );
    d(p, "attackBoost"
        ,function () {
            return this.attackBoostCoefficient * this.level;
        }
    );
    d(p, "fightPower"
        ,function () {
            return 2.7 ^ ((this.protectBoost * 0.5 + this.attackBoost * 0.5) * this.level);
        }
    );
    p.show = function () {
        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.protectBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Jewel;
}());
egret.registerClass(Jewel,'Jewel');
//一级，二级，三级宝石
var jewelLevel;
(function (jewelLevel) {
    jewelLevel[jewelLevel["one"] = 1] = "one";
    jewelLevel[jewelLevel["two"] = 2] = "two";
    jewelLevel[jewelLevel["three"] = 3] = "three";
})(jewelLevel || (jewelLevel = {}));
//装备品质分为金，银，铜，铁
var equipmentQuality;
(function (equipmentQuality) {
    equipmentQuality[equipmentQuality["iron"] = 1] = "iron";
    equipmentQuality[equipmentQuality["copper"] = 2] = "copper";
    equipmentQuality[equipmentQuality["silver"] = 3] = "silver";
    equipmentQuality[equipmentQuality["gold"] = 4] = "gold";
})(equipmentQuality || (equipmentQuality = {}));
//英雄稀有度
var heroValue;
(function (heroValue) {
    heroValue[heroValue["r"] = 1] = "r";
    heroValue[heroValue["sr"] = 2] = "sr";
    heroValue[heroValue["ssr"] = 3] = "ssr";
})(heroValue || (heroValue = {}));
//# sourceMappingURL=User.js.map