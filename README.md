# 🚀 Social Connect - Plataforma de Red Social

![Estado del Proyecto](https://img.shields.io/badge/ESTADO-EN_DESARROLLO-orange?style=for-the-badge)
![Licencia](https://img.shields.io/badge/LICENCIA-MIT-green?style=for-the-badge)

> Una red social escalable desarrollada bajo la arquitectura **MVC**, enfocada en la seguridad de datos y la experiencia de usuario fluida.

---

## 📸 Galería del Proyecto
Aquí puedes ver el flujo principal de la aplicación.
inicio de la aplicacion:
![inicio de la aplicacion](/assets/inicio.png)

![feed de publicaciones](/assets/feed.png)

### Panel de Usuario / Perfil
![perfil del usuario](/assets/perfil.png)

### Inicio de sesion / Registro
![inicio de sesion](/assets/inicioSesion.png)

---

## 🛠️ Tecnologías Utilizadas

El proyecto fue construido utilizando el stack **MERN** con énfasis en patrones de diseño robustos:

### Backend (Lógica y Datos)
* **Node.js & Express:** Manejo de servidor y rutas API RESTful.
* **MongoDB (Mongoose):** Base de datos NoSQL para almacenamiento flexible de documentos.
* **Arquitectura MVC:** Separación clara de Modelos, Vistas (controladas por React) y Controladores.
* **Seguridad:** Implementación de **Middlewares** personalizados para validación de datos y autenticación.

### Frontend (Interfaz de Usuario)
* **React.js:** Creación de componentes reutilizables y gestión de estado.
* **Tailwind CSS:** Estilizado moderno y responsivo (Mobile First).

---

## ✨ Funcionalidades Principales

- [x] **Autenticación Segura:** Registro e inicio de sesión de usuarios.
- [x] **CRUD de Publicaciones:** Crear, leer, actualizar y eliminar posts.
- [ ] **Sistema de Comentarios:** (En desarrollo) Interacción en hilos.
- [ ] **Gestión de Perfiles:** Edición de datos personales y foto de perfil.

---

## 🔧 Instalación y Despliegue Local

Si deseas correr este proyecto en tu máquina local:

1. **Clonar el repositorio**
   ```bash
   git clone [https://github.com/JassCast18/redSocial.git](https://github.com/JassCast18/redSocial.git)
2. Instalar dependencias
   npm install
   cd client //para el frontEnd
   npm install
3. Cambiar las cadenas de conexion
   cambiar tu cadena de conexion al bd :

   ![cambia la cadena de conexion](/assets/conexionCadena.png)
4. Correr el programa
   en el backend y en el frontEnd ejecutar:

   npm run dev
