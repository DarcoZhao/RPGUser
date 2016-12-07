# RPGUser

### 简述
共有4层结构：宝石、装备、英雄、用户


##**1.宝石**
  基础属性：等级，攻击力加成系数，防御力加成系数（它们决定了宝石评级的大小
  
  高级属性：宝石评级
  
               宝石评级= e^ （等级*（攻击力加成系数*0.5 + 防御力加成系数*0.5））
 
    
##**2.装备**
  基础属性：品质，基础攻击量，基础防御量
  
  高级属性：攻击力加成量，防御力加成量，装备评级
  
              攻击力加成量=装备上的所有宝石的攻击量加成系数*基础攻击量
              
              防御力加成量=装备上的所有宝石的防御量加成系数*基础防御量
              
              装备评级=装备上所有宝石的评级+e^ （品质*（攻击力加成*0.55+防御力加成*0.45））
           
  
##**3.英雄**
  基础属性：等级，基础攻击力，基础防御力，基础血量，稀有度
  
  高级属性：血量，攻击力，防御力，战斗评级
               
               血量=基础血量+（1+（1-稀有度）*0.5）*等级
  
               攻击力=（基础攻击力+所有装备的攻击力加成量）^等级 * 0.85
               
               防御力=（基础防御力+所有装备的防御力加成量）^等级
               
               战斗评级=所有装备的评级+e^ （攻击力*0.5+防御力*0.5+血量/20）
  
  
##**4.用户**
  基础属性：等级，经验，金钱
  
  高级属性：战斗力
  
              战斗力=玩家所拥有的所有英雄的战斗评级之和*（1+（1-稀有度））
