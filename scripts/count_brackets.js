const fs = require('fs');
const path = 'c:/Users/window/Desktop/Learning/Typing/src/components/TypingTest.tsx';
const s = fs.readFileSync(path,'utf8');
const counts = {'(':0,')':0,'{':0,'}':0,'[':0,']':0};
for(const ch of s){ if(Object.prototype.hasOwnProperty.call(counts,ch)) counts[ch]++; }
console.log(JSON.stringify(counts,null,2));
