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
<div>
  <p>Aqui realice algunos cambios a las variables esto alterando los colores y la forma en la que crece el cuadrado, antes se hacia de manera horizontal, ahora se hace de manera vertical</p>
  <img width="280" height="280" alt="image" src="https://github.com/user-attachments/assets/44a2f9f3-1744-48c8-acd0-75b187312eff" style="display: block; margin: 0 auto"/>
</div>

#### **6. Tinker**
<div>
  <p>aqui reconfigure el programa para que salgan 10 figuras en posiciones aleatorias que tambien varien su tamaño teniendo en cuenta la posicion del mouse e igual el color y que ahora en vez de cuadrados sean circulos</p>
  <div>
    <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/917ad6da-ae46-4288-93d7-df55c94b0488" />
    <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/8f043c83-44a1-4304-ad51-38473418770d" />
  </div>
</div>

---

> [Link de mi versión reconstruida](https://editor.p5js.org/supervejito80/sketches/blCRl18US)
