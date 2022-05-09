pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier2 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;  
   signal output c;  

   // Constraints.  
   c <== a * b;  
}

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;

   component multi1 = Multiplier2();
   component multi2 = Multiplier2();

   multi1.a <== a;
   multi1.b <== b;
   multi2.a <== multi1.c;
   multi2.b <== c;

   // Constraints.  
   d <== multi2.c;  
}

component main = Multiplier3();