# AppGastos

Aplicación web para el control de gastos personales desarrollada con ASP.NET Core y React.

## Características

- Registro de gastos con fecha, descripción, monto y categoría
- Edición y eliminación de gastos
- Categorización de gastos
- Interfaz de usuario moderna y responsiva

## Tecnologías Utilizadas

- Backend:
  - ASP.NET Core 6.0
  - Entity Framework Core
  - SQL Server

- Frontend:
  - React
  - Bootstrap
  - Axios

## Requisitos Previos

- .NET 6.0 SDK
- Node.js y npm
- SQL Server

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/AppGastos.git
cd AppGastos
```

2. Configurar la base de datos:
- Asegúrate de tener SQL Server instalado y corriendo
- Actualiza la cadena de conexión en `appsettings.json` si es necesario

3. Restaurar las dependencias del backend:
```bash
cd AppGastos
dotnet restore
```

4. Restaurar las dependencias del frontend:
```bash
cd ClientApp
npm install
```

## Ejecución

1. Iniciar el backend:
```bash
cd AppGastos
dotnet run
```

2. Iniciar el frontend (en otra terminal):
```bash
cd ClientApp
npm start
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: https://localhost:5001

## Estructura del Proyecto

```
AppGastos/
├── AppGastos/              # Proyecto backend
│   ├── Controllers/        # Controladores API
│   ├── Models/            # Modelos de datos
│   └── Program.cs         # Configuración de la aplicación
├── ClientApp/             # Proyecto frontend
│   ├── src/               # Código fuente React
│   └── public/            # Archivos estáticos
└── README.md             # Este archivo
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 