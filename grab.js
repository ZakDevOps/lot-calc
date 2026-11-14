/* Закладка «＋ Ставка на лот»: зчитує відкритий лот на bid.cars / IAAI / Copart і відкриває калькулятор із ним.
   Тут без однорядкових коментарів: код вставляється в закладку одним рядком. */
(function(){
var SITE='https://zakdevops.github.io/lot-calc/';
var T=(document.body.innerText||'')+' '+(document.body.textContent||'');T=T.replace(/\s+/g,' ');
var H=location.hostname, U=location.href;
function g(re){var m=T.match(re);return m?m[1].trim():null;}
function num(s){return s?+String(s).replace(/[^\d]/g,'')||null:null;}
var MON={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11,'янв':0,'фев':1,'мар':2,'апр':3,'мая':4,'май':4,'июн':5,'июл':6,'авг':7,'сен':8,'окт':9,'ноя':10,'дек':11,'січ':0,'лют':1,'бер':2,'кві':3,'тра':4,'чер':5,'лип':6,'сер':7,'вер':8,'жов':9,'лис':10,'гру':11};
var TZ={EST:-5,EDT:-4,CST:-6,CDT:-5,MST:-7,MDT:-6,PST:-8,PDT:-7};
var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function kyiv(d){if(!d||isNaN(d))return null;var k=new Date(d.getTime()+2*3600e3);function p(n){return(n<10?'0':'')+n;}
 return WD[k.getUTCDay()]+' '+k.getUTCDate()+' '+MN[k.getUTCMonth()]+', '+p(k.getUTCHours())+':'+p(k.getUTCMinutes())+' GMT+2';}
function usDate(s){if(!s)return null;var m=s.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s*(\d{4})?[^\d]{0,6}(\d{1,2}):(\d{2})\s*(am|pm)?\s*\(?([A-Z]{3})?/i);if(!m)return null;
 var h=+m[4]%12+(/pm/i.test(m[6]||'')?12:0),y=m[3]?+m[3]:new Date().getFullYear(),off=TZ[(m[7]||'EST').toUpperCase()];if(off==null)off=-5;
 return kyiv(new Date(Date.UTC(y,MON[m[1].toLowerCase()],+m[2],h-off,+m[5])));}
var r={src:H.replace(/^www\./,''),at:new Date().toISOString().slice(0,10)};
if(/bid\.cars/.test(H)){
 var lm=U.match(/lot\/([01]-\d+)/);r.lot=lm&&lm[1];r.vin=(U.match(/([A-HJ-NPR-Z0-9]{17})/i)||[])[1];
 r.name=(document.title.split('|')[0]||'').trim();
 var mi=g(/Одометр\s*([\d\s ]+)\s*миль/);r.odo=num(mi);
 r.loc=g(/Місцезнаходження:\s*(.+?\([A-Z]{2}\))/);r.dmg=g(/Первинний збиток\s*(.+?)\s*Вторинний/);var DU={'Передня частина':'Front end','Зад':'Rear end','Задня частина':'Rear end','Бік':'Side','Ходова частина':'Undercarriage','Дах':'Top/roof','Повністю':'All over','Пожежа':'Burn','Вода':'Flood','Град':'Hail','Механічний':'Mechanical','Перекидання':'Rollover'};if(r.dmg&&DU[r.dmg])r.dmg=DU[r.dmg];
 r.doc=g(/Документ про продаж:?\s*(.+?\))/);var k=g(/Ключ\s*(Присутній|Відсутній)/);r.key=k==='Відсутній'?'Missing':k?'Present':null;
 var st=g(/Початковий код\s*(Заводиться і їде|Автомобіль заводиться|Заводиться|Стаціонарний)/);r.start=st==='Заводиться і їде'?'Run / Drive':st?(/Стаціонар/.test(st)?'Stationary':'Starts'):null;
 r.seller=g(/Продавець:?\s*(.+?)\s*(?:Документ|Програш|Первинний)/);
 var dm=T.match(/(\d{1,2})\s+(янв|фев|мар|апр|мая|май|июн|июл|авг|сен|окт|ноя|дек|січ|лют|бер|кві|тра|чер|лип|сер|вер|жов|лис|гру)[а-яіїє]*,?\s*(\d{1,2}):(\d{2})/i);
 if(dm){var y=new Date().getFullYear();r.close=kyiv(new Date(Date.UTC(y,MON[dm[2].toLowerCase().slice(0,3)]??MON[dm[2].toLowerCase()],+dm[1],+dm[3]-2,+dm[4])));}
 var imgs=[].slice.call(document.images).map(function(i){return i.src;}).filter(function(s){return r.lot&&s.indexOf(r.lot.replace('-',''))>-1&&/-1\.jpg/.test(s);});r.img=imgs[0]||null;
 var pc=g(/Переглянути\s*(\d+)\s*Фото/);r.photos=pc?+pc:null;
}else if(/iaai\.com/.test(H)){
 r.lot='0-'+g(/Stock #:\s*(\d+)/);r.vin=(g(/VIN[^:]*:\s*([A-HJ-NPR-Z0-9*]{17})/)||'').replace(/\*/g,'?');
 r.name=(document.title.split(' for Auction')[0]||'').trim();r.odo=num(g(/Odometer:\s*([\d,]+)\s*mi/));
 var br=g(/Selling Branch:\s*(.+?\([A-Z]{2}\))/);r.loc=br;r.dmg=g(/Primary Damage:\s*(.+?)\s*(?:Secondary|Title|Loss|Start)/);
 r.doc=g(/Title\/Sale Doc:\s*(.+?)\s*(?:Start Code|Key|Odometer|$)/);var kk=g(/Key:\s*(Present|Missing|Not Present)/i);r.key=kk?(/present/i.test(kk)&&!/not/i.test(kk)?'Present':'Missing'):null;
 var sc=g(/Start Code:\s*(Run & Drive|Starts|Stationary|[A-Za-z ]+?)\s*(?:Key|Odometer)/);r.start=/run/i.test(sc||'')?'Run / Drive':/start/i.test(sc||'')?'Starts':/station/i.test(sc||'')?'Stationary':null;
 r.seller=g(/Seller:\s*(.+?)\s*Seller Type/);if(r.seller&&/\*/.test(r.seller))r.seller=null;
 r.close=usDate(g(/Auction Date and Time:\s*(.{0,40})/));if(/Not Ready/i.test(T))r.note='IAAI: аукціон ще не призначено (Not Ready for Sale)';
 var im=[].slice.call(document.images).map(function(i){return i.src;}).filter(function(s){return /vis\.iaai\.com\/resizer/.test(s);});r.img=im[0]||null;
}else if(/copart\.com/.test(H)){
 r.lot='1-'+((U.match(/lot\/(\d+)/)||[])[1]||g(/Lot number:?\s*(\d+)/i));r.vin=(g(/VIN:?\s*([A-HJ-NPR-Z0-9*]{17})/i)||'').replace(/\*/g,'?');
 r.name=(document.title.split('|')[0]||'').replace(/for Sale.*$/i,'').trim();r.odo=num(g(/Odometer:?\s*([\d,]+)/i));
 var lc=g(/Location:?\s*([A-Z]{2})\s*-\s*([A-Z .]+?)\s/);var lcm=T.match(/Location:?\s*([A-Z]{2})\s*-\s*([A-Z .\-]+?)(?:\s{1,}[A-Z][a-z]|\s*Sale)/);r.loc=lcm?(lcm[2].trim().toLowerCase().replace(/\b\w/g,function(c){return c.toUpperCase();})+' ('+lcm[1]+')'):null;
 r.dmg=g(/Primary damage:?\s*(.+?)\s*(?:Secondary|Highlights|Estimated|Cylinders|Body)/i);r.doc=g(/Title code:?\s*(.+?)\s*(?:Odometer|Primary)/i);
 var kc=g(/Keys:?\s*(Yes|No)/i);r.key=kc?(/yes/i.test(kc)?'Present':'Missing'):null;
 var hl=g(/Highlights:?\s*(Run and Drive|Engine Starts|Enhanced Vehicles|[A-Za-z ]{0,30})/i);r.start=/run and drive/i.test(hl||'')?'Run / Drive':/engine start/i.test(hl||'')?'Starts':null;
 r.close=usDate(g(/Sale date:?\s*(.{0,40})/i));
 var ci=[].slice.call(document.images).map(function(i){return i.src;}).filter(function(s){return /cs\.copart\.com|copart.*\.jpg/i.test(s);});r.img=ci[0]||null;
}else{alert('Відкрийте сторінку лота на bid.cars, IAAI або Copart');return;}
if(!r.lot||/null$/.test(r.lot)){alert('Не вдалося знайти номер лота на цій сторінці');return;}
window.open(SITE+'#add='+encodeURIComponent(JSON.stringify(r)),'_blank');
})();
