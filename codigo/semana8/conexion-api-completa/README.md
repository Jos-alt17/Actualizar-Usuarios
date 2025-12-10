1. ¿Cómo mejorarías la implementación de useFetch?
La versión inicial de useFetch es un buen punto de partida para peticiones GET, pero para convertirlo en un hook reutilizable y robusto para toda la aplicación (CRUD), es esencial dotarlo de capacidad para manejar la mutación de datos y la gestión de la limpieza de efectos secundarios.

Las mejoras clave son:

A. Centralización de Métodos HTTP (POST, PUT, DELETE)
En lugar de limitar el hook a peticiones automáticas GET, lo transformamos en un gestor de peticiones flexible.

Implementación: Se devuelve una función de ejecución (executeFetch) que permite al componente llamar al hook de forma manual, aceptando la URL y un objeto de configuración que incluye el método (POST, PUT, DELETE), encabezados (headers) y cuerpo (body).

Beneficio: Permite que un solo hook maneje todas las operaciones de la API (lectura y escritura), eliminando la duplicación de código en los componentes.

B. Prevención de Fugas de Memoria con AbortController
En una Single Page Application (SPA), es un problema común que un componente se desmonte mientras una petición fetch está aún en curso, lo que provoca advertencias y posibles fugas de memoria al intentar actualizar un estado inexistente.

Implementación: Se integra la API nativa AbortController para generar una señal (signal) que se pasa a fetch. Esta señal se llama dentro de la función de limpieza (return) del useEffect cuando el componente se desmonta.

Beneficio: Asegura que si el usuario navega a otra página, la petición pendiente se cancela, manteniendo limpia la consola y el entorno de ejecución.

C. Manejo Robusto de Errores y Respuestas
El hook debe ser capaz de diferenciar entre errores de red y respuestas exitosas sin cuerpo (ej. un DELETE exitoso que devuelve un código 204 "No Content").

Implementación: Se añade lógica para capturar errores HTTP (códigos 4xx y 5xx) y se evita el intento de parsear la respuesta como JSON cuando el método es DELETE o el código de estado es 204, devolviendo un objeto de éxito simple en su lugar.

2. En el form de edición/creación de post, ¿qué hacemos para poder actualizar el estado de los datos de envío para no tener que manejar cada uno de los datos de manera individual?
Para manejar formularios complejos (como un formulario de edición o creación con múltiples campos como título, cuerpo, autor, etc.) sin crear un estado individual (useState) para cada input, la práctica recomendada en React es utilizar un único objeto de estado que represente el formulario completo.