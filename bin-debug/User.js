//@Cache
var User = (function () {
    function User() {
        this.money = 0;
        this.undealMoney = 0;
        this.currentExp = 0;
        this.level = 0;
        //User与Hero为聚合关系的表现
        this.heroes = [];
        this.money = 0;
        this.undealMoney = 0;
        this.currentExp = 0;
        this.level = 0;
    }
    var d = __define,c=User,p=c.prototype;
    d(p, "heroesInTeam"
        //基础数值写法
        
        //heroesInTeam : Hero[] = [];
       
        //高阶数值写法
        ,function () {
            return this.heroes.filter(function (hero) { return hero.isInteam; });
        }
    );
    d(p, "fightPower"
        ,function () {
            var result = 0;
            //forEach : 将数组中每个元素都执行
            this.heroesInTeam.forEach(function (hero) { return result += hero.fightPower; });
            return result;
        }
    );
    p.addHero = function (hero) {
        this.heroes.push(hero);
    };
    p.show = function () {
        console.log("User:");
        console.log("level:" + this.level);
        console.log("currentExp：" + this.currentExp);
        console.log("undealMoney:" + this.undealGold);
        console.log("money:" + this.gold);
        console.log("fightPower:" + this.fightPower);
    };
    return User;
}());


egret.registerClass(User,'User');
var Hero = (function () {
    function Hero(baseHp, baseAttack, value) {
        this.isInteam = false;
        this.baseHp = 0;
        this.baseAttack = 0;
        this.level = 0;
        this.value = 0;
        this.equipments = [];
        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
        this.value = value;
    }
    var d = __define,c=Hero,p=c.prototype;
    d(p, "hp"
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.hpBoost; });
            return result + this.baseHp + (1 + 0.2 * this.value) * this.level;
        }
    );
    d(p, "attack"
        ,function () {
            var result = 0;
            //累加所有装备的攻击力
            this.equipments.forEach(e => result += e.attackBoost);
        return result + this.baseAttack + (2 + 0.6 * this.value) * this.level;
    }
    );
    d(p, "fightPower"
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.fightPower; });
             return result + (this.hp * 650 + this.attack * 450) * 1;
        }
    );
    p.addEquipment = function (equipment) {
        this.equipments.push(equipment);
    };
    p.show = function () {
        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("value:" + this.value);
        console.log("attack:" + this.attack);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    };
    return Hero;
}());
egret.registerClass(Hero,'Hero');
var Equipment = (function () {
    function Equipment(quality, baseAttack, baseHp) {
        this.jewels = [];
        this.baseAttack = 0;
        this.baseHp = 0;
        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
    }
    var d = __define,c=Equipment,p=c.prototype;
    d(p, "attackBoost"
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.attackBoost; });
            return result + (this.quality * 15) + this.baseAttack;
        }
    );
    d(p, "hpBoost"
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.hpBoost; });
            return result + (this.quality * 15) + this.baseHp;
        }
    );
    d(p, "fightPower"
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.fightPower; });
             return result + (this.hpBoost * 350 + this.attackBoost * 450) * 0.6;
        }
    );
    p.addJewel = function (jewel) {
        this.jewels.push(jewel);
    };
    p.show = function () {
        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Equipment;
}());
egret.registerClass(Equipment,'Equipment');
var Jewel = (function () {
    function Jewel(level, hpBoostCoefficient, attackBoostCoefficient) {
        this.hpBoostCoefficient = 0;
        this.attackBoostCoefficient = 0;
        this.level = level;
        this.hpBoostCoefficient = hpBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;
    }
    var d = __define,c=Jewel,p=c.prototype;
    d(p, "hpBoost"
        ,function () {
            return this.hpBoostCoefficient * this.level;
        }
    );
    d(p, "attackBoost"
        ,function () {
            return this.attackBoostCoefficient * this.level;
        }
    );
    d(p, "fightPower"
        ,function () {
            return this.hpBoost * 300 + this.attackBoost * 500;
        }
    );
    p.show = function () {
        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Jewel;
}());
egret.registerClass(Jewel,'Jewel');
//不同级别的宝物
var jewelLevel;
(function (jewelLevel) {
    jewelLevel[jewelLevel["one"] = 1] = "one";
    jewelLevel[jewelLevel["two"] = 2] = "two";
    jewelLevel[jewelLevel["three"] = 3] = "three";
})(jewelLevel || (jewelLevel = {}));
//装备分为四个不同的等级
var equipmentQuality;
(function (equipmentQuality) {
    equipmentQuality[equipmentQuality["grey"] = 1] = "grey";
    equipmentQuality[equipmentQuality["green"] = 2] = "green";
    equipmentQuality[equipmentQuality["red"] = 3] = "red";
    equipmentQuality[equipmentQuality["yellow"] = 4] = "yellow";
})(equipmentQuality || (equipmentQuality = {}));
//heros rarility
var heroValue;
(function (heroValue) {
    heroValue[heroValue["good"] = 1] = "good";
    heroValue[heroValue["better"] = 2] = "better";
    heroValue[heroValue["excellent"] = 3] = "excellent";
})(heroValue || (heroValue = {}));
//# sourceMappingURL=User.js.map