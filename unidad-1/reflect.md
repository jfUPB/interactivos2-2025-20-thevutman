# **Unidad 1**

## 🤔 Fase: Reflect

### **Actividad 6**
#### **Parte 1: recuperación de conocimiento (Retrieval Practice)**

#### 1. Describe la diferencia clave entre un artista que crea una obra de forma tradicional (ej. un pintor) y un artista generativo. ¿Dónde reside el “arte” en el arte generativo?
Un artista tradicional expresa sus emociones y lo que quiere reflejar atravez de sus trazos, se podria decir que sabe lo que quiere plasmar. Un artista generativo crea reglas en un algoritmo, crea unas cuantas variables y se deja llevar de la aletoriedad para construir una obra y buscarle alguna emocion a eso.

#### 2. Explica con tus palabras qué es un “parámetro” en un sistema de diseño generativo. Da un ejemplo de un parámetro que hayas manipulado en la Actividad 03.
Un parametro es lo que recibe una funcion como valor variable que puede usar, entonces es asi como podemos cambiar una de las reglas del algoritmo creado, cambiando estos parametros podemos hacer que la obra cambie. 

Un ejemplo de los parametros que cambie en la actividad 3 seria el `background()`, sus parametros van dentro de los parentesis y son en tipo RGB `(R,G,B)` seprados por una coma cada valor significa algo diferente dentro de la funcion, en este caso son los valores que pueden tomar el rojo, verde y azul para asi formar todos los colores segun la cantidad, estos van desde 0 hasta 255 y lo configure para que este valor dependiera de la posicion del mouse

``` js
  let r = map(mouseX, 0, width, 50, 255);
  let g = map(mouseY, 0, height, 50, 255);
  let b = map(mouseX + mouseY, 0, width + height, 100, 255);
  background(r, g, b);
```
#### 3. ¿Cuál es el propósito del método de aprendizaje “Deconstrucción/Reconstrucción” que aplicamos en la Actividad 05? Nombra al menos tres de sus siete etapas.
El proposito es aprender y crear un proyecto unico en base a la creatividad. La fase de select nos permite explorar algo que nos guste. La fase de convert nos permite usar nuestra imaginacion y solo lo que vemos para tratar de plasmar lo que vimos en codigo y de probarnos a nosotros de que somos capaces, ademas de que nos ayuda aprender atravez de la practica y la investigacion. La fase de Think nos permite una vez reconstruido experimentar con el codigo para ahora si crear algo unico.

#### 4. Piensa en los referentes que vimos. ¿Qué tienen en común sus trabajos?


#### 5. ¿Qué papel juega la aleatoriedad en los sketches básicos que creaste en la Actividad 04?
Muy importante ya que todo se base en esto en un ciclo de figuras generadas aleatoriamente en espacios aleatroios y con colores aleatorios generando algo visulmente satisfactorio

#### **Parte 2: reflexión sobre tu proceso (Metacognición)**

#### 1. La Actividad 05 te pedía explícitamente “disfruta del proceso, experimenta, juega, diviértete”. Describe un momento durante esa actividad en el que te sentiste realmente explorando o jugando, y qué descubriste en ese momento.
A mi me divierte hacer codigo, asi que el momento de reconstruir y buscar por la libreria de p5 cosas que me sirvieran para poder recrear lo que vi me parecio muy divertido y placentero, ademas de que me ayudo a aprender un poco mas funcionalidades de p5

#### 2. Reflexiona sobre la aplicación del método Deconstrucción/Reconstrucción. ¿Qué etapa te resultó más desafiante? ¿Cuál te pareció más útil para tu aprendizaje?
La que me parecio mas util fue la de convert ya que es en la que uno experimenta con todo lo visto. la etapa para mi mas desafiante fue la de think, ya que no sabia que hacer o que si modificar o que no y que especialmente que la destruccion me gustara.

#### 3. Vuelve a pensar en la pregunta de la Actividad 01: “¿Qué posibilidades crees que esto puede ofrecer a tu perfil profesional?”. Después de estas dos semanas de exploración, ¿Ha cambiado o se ha enriquecido tu respuesta? ¿Cómo?
Me gusta mucho, quiero seguir explorando esto ya que en realidad se puede hacer de todo, cosas no imaginables y javascript es un lenguaje que me gusta demasiado.

#### 4. ¿Qué estrategia de aprendizaje de esta unidad (ver videos, discutir en grupo, analizar referentes, deconstruir código) te ha funcionado mejor hasta ahora?
Sin duda analizar referente y deconstruir el codigo es lo que mas me a ayudado a aprender.

### **Actividad 7**

