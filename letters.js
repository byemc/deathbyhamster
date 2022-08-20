// Inspired by https://github.com/PaulBGD/PixelFont


const fntA = [
    [, , 1, 1, 1, 1], 
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, 1, 1, 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
];

const fntB = [
    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1], 
    [, 1, 1, 1, 1, 1], 
    
];

const fntC = [
    [, , 1, 1, 1, 1], 
    [, 1, 1, , , 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1, , , 1, 1],
    [, , 1, 1, 1, 1]
    
];

const fntD = [
    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, 1, 1, 1] 
    
];

const fntE = [
    
    [, , 1, 1, 1, 1, 1], 
    [, 1, 1, 1, 1, 1, 1],
    [, 1, 1],
    [, 1, 1, 1, 1, 1],
    [, 1, 1],
    [, 1, 1, 1, 1, 1, 1], 
    [, , 1, 1, 1, 1, 1], 
    
];

const fntF = [
    
    [, , 1, 1, 1, 1, 1], 
    [, 1, 1, 1, 1, 1, 1],
    [, 1, 1],
    [, 1, 1, 1, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    
];

const fntG = [
    [, , 1, 1, 1, 1, 1], 
    [, 1, 1, 1, 1, 1, 1], , 
    [, 1, 1],
    [, 1, 1, , 1, 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, 1, 1, 1, 1],
    [, , 1, 1, 1, 1]
    
];

const fntH = [
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1,1,1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    
];

const fntI = [
    
    [, 1, 1, 1, 1, 1, 1],
    [, , , 1, 1],
    [, , , 1, 1],
    [, , , 1, 1],
    [, , , 1, 1],
    [, , , 1, 1],
    [, 1, 1, 1, 1, 1, 1],
];

const fntJ = [
    
    [, , 1, 1, 1, 1, 1],  
    [, , , , , 1, 1],
    [, , , , , 1, 1],
    [, , , , , 1, 1],
    [, , , , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, , 1, 1, 1, 1],
    
 ];

 const fntK = [

    [, 1, 1, , , 1],
    [, 1, 1, , , 1],
    [, 1, 1, , 1],
    [, 1, 1, 1],
    [, 1, 1, , 1],
    [, 1, 1, , , 1], 
    [, 1, 1, , , 1],
    
 ];

 const fntL = [

    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1, 1, 1, 1, 1], 
    [, 1, 1, 1, 1, 1, 1], 
    
 ];

 const fntM = [

    [, 1, 1, , , , 1], 
    [, 1, 1, 1, , 1, 1],
    [, 1, 1, , 1, , 1],
    [, 1, 1, , , , 1],
    [, 1, 1, , , , 1],
    [, 1, 1, , , , 1], 
    [, 1, 1, , , , 1],

 ];

 const fntN = [

    [, 1, 1, , , , 1], 
    [, 1, 1, , , , 1], 
    [, 1, 1, 1, , , 1], 
    [, 1, 1, 1, 1, , 1], 
    [, 1, 1, , 1, 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , , 1],
    
 ];

 const fntO = [

    [, , 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, , 1, 1, 1, 1], 
    
 ];

 const fntP = [
    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, 1, 1, 1],
    [, 1, 1],
    [, 1, 1],
    [, 1, 1],
    
 ];

 const fntQ = [

    [, , 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , 1, 1, 1],
    [, 1, 1, , , 1, 1], 
    [, , 1, 1, 1, 1, , 1], 
    
 ];

 const fntR = [

    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, 1, 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    [, 1, 1, , , 1, 1],
    
 ];

 const fntS = [

    [, , 1, 1, 1, 1], 
    [, 1, 1, , , , 1], 
    [, 1, 1],
    [, , 1, 1, 1, 1], 
    [, , , , , , 1], 
    [, 1, 1, , , , 1], 
    [, , 1, 1, 1, 1],
    
 ];

 const fntT = [

    [, 1, 1, 1, 1, 1, 1], 
    [, 1, 1, 1, 1, 1, 1],
    [, , , 1, 1],
    [, , , 1, 1], 
    [, , , 1, 1],
    [, , , 1, 1],
    [, , , 1, 1],
    
 ];

 const fntU = [

    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, , , 1, 1], 
    [, 1, 1, 1, 1, 1, 1], 
    [, , 1, 1, 1, 1],
    
 ];

 const fntV = [

    [, 1, 1, , , , 1], 
    [, 1, 1, , , , 1], 
    [, 1, 1, , , , 1],  
    [, 1, 1, , , , 1],  
    [, 1, 1, , , , 1],  
    [, , 1, 1, , 1],  
    [, , , 1, 1],
    
 ];

 const fntW = [

    [, 1, 1, , , , 1],  
    [, 1, 1, , , , 1],  
    [, 1, 1, , , , 1],  
    [, 1, 1, , 1, , 1],  
    [, 1, 1, , 1, , 1],  
    [, 1, 1, , 1, , 1],
    [, , , 1, , 1], 
    
 ];

 const fntX = [

    [, 1, , , , , 1], 
    [, 1, 1, , , 1, 1],  
    [, , 1, 1, 1, 1],  
    [, , , 1, 1],  
    [, , 1, 1, 1, 1],  
    [, 1, 1, , , 1, 1],  
    [, 1, , , , , 1],  
    
 ];

 const fntY = [

    [, 1, 1, , , 1, 1],  
    [, 1, 1, , , 1, 1],  
    [, 1, 1, , , 1, 1],  
    [, , 1, 1, 1, 1, 1],  
    [, , , , , 1, 1],  
    [, 1, 1, , , 1, 1],  
    [, , 1, 1, 1, 1], 
    
 ];

 const fntZ = [

    [,1, 1, 1, 1, 1, 1],
    [, , , , , 1, 1],
    [, , , , 1, 1],
    [, , , 1, 1],
    [, , 1, 1],
    [, 1, 1],
    [, 1, 1, 1, 1, 1, 1], , 
    
 ];

 const fnt1 = [
   [, , , 1, 1],
   [, , 1, 1, 1],
   [, , , 1, 1],
   [, , , 1, 1],
   [, , , 1, 1],
   [, , , 1, 1],
   [, 1, 1, 1, 1, 1, 1],
];


const fnt2 = [
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, , , , , 1, 1],
   [, , , , 1, 1],
   [, , , 1, 1],
   [, , 1, 1],
   [, 1, 1, 1, 1, 1, 1],
];

const fnt3 = [
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, , , , , 1, 1],
   [, , , , 1, 1],
   [, , , , , 1, 1],
   [, 1, 1, , , 1, 1],
   [, , 1, 1, 1, 1],
];


const fnt4 = [
   [, , , , 1, 1, 1],
   [, , , 1, 1, 1, 1],
   [, , 1, 1, , 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, 1, 1, 1, 1],
   [, , , , , 1, 1],
   [, , , , , 1, 1],
];

const fnt5 = [
   [, 1, 1, 1, 1, 1, 1],
   [, 1, 1],
   [, 1, 1],
   [, 1, 1, 1, 1, 1,],
   [, , , , , 1, 1],
   [, , , , , 1, 1],
   [, 1, 1, 1, 1, 1,],
];

const fnt6 = [
      [, , 1, 1, 1, 1],
      [, 1, 1, , , 1, 1],
      [, 1, 1],
      [, 1, 1, 1, 1, 1],
      [, 1, 1, , , 1, 1],
      [, 1, 1, , , 1, 1],
      [, , 1, 1, 1, 1],
];

const fnt7 = [
   [, 1, 1, 1, 1, 1, 1],
   [, 1, 1, 1, 1, 1, 1],
   [, , , , 1, 1],
   [, , , , 1, 1],
   [, , , 1, 1],
   [, , , 1, 1],
   [, , , 1, 1],
];

const fnt8 = [
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, , , 1, 1],
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, , , 1, 1],
   [, , 1, 1, 1, 1],
];

const fnt9 = [
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, , , 1, 1],
   [, , 1, 1, 1, 1, 1],
   [, , , , , 1, 1],
   [, , , , , 1, 1],
   [, , , , , 1, 1],
];


const fnt0 = [
   [, , 1, 1, 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, , , 1, 1],
   [, 1, 1, , 1, 1, 1],
   [, 1, 1, 1, , 1, 1],
   [, 1, 1, , , 1, 1],
   [, , 1, 1, 1, 1],
];

const fntSlash = [
   [],
   [, , , , , , 1],
   [, , , , , 1],
   [, , , , 1],
   [, , , 1],
   [, , 1],
   [, 1],
];

const fntColon = [
   [, 1,1],
   [, 1,1],
   [],
   [],
   [],
   [, 1,1],
   [, 1,1],
];

const fntDot = [
   [],
   [],
   [],
   [],

   [],
   [, 1,1],
   [, 1,1],
]


const fntINDEX = {
   'A': fntA, 'B': fntB, 'C': fntC, 'D': fntD, 'E': fntE, 'F': fntF,
   'G': fntG, 'H': fntH, 'I': fntI, 'J': fntJ, 'K': fntK, 'L': fntL,
   'M': fntM, 'N': fntN, 'O': fntO, 'P': fntP, 'Q': fntQ, 'R': fntR,
   'S': fntS, 'T': fntT, 'U': fntU, 'V': fntV, 'W': fntW, 'X': fntX,
   'Y': fntY, 'Z': fntZ, '1': fnt1, '2': fnt2, '3': fnt3, '4': fnt4,
   '5': fnt5, '6': fnt6, '7': fnt7, '8': fnt8, '9': fnt9, '0': fnt0,
   '/': fntSlash, ':': fntColon, '.': fntDot,
}

