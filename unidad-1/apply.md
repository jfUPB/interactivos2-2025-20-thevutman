# **Unidad 1**

## 🛠 Fase: Apply

#### **1. Select**
[Proyecto origial](http://www.generative-gestaltung.de/2/sketches/?01_P/P_1_0_01)

#### **2. Describe**
El proyecto muestra 2 cuadrados uno de fondo y otro que se expande o disminuye por el canva segun la posición del mouse, ademas los colores de los cuadrados tambien cambian dependiendo la posicion del mouse, lo intersante es que los cuadrados tienen colores opuestos, resaltando asi uno del otro.

#### **3. Analyze**
El proyecto tiene configurado unos randoms para los colores de fondo y para el cuadrado basado en la posicion del mouse, ademas de que el tamaño del cuadrado tambien depende de la posicion "x" y "y" del mouse.

#### **4. Convert**
``` js
function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background(mouseX, mouseY, 100);
  
  strokeWeight(0)
  fill(mouseY, mouseX, 100)
  square(width/2,height/2, mouseX)
  
}
```

#### **5. explore**
Aqui realice algunos cambio

#### **6. Tinker**