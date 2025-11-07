# 🤖 ByteCallers - Plataforma de Call Center con IA

Plataforma moderna de call center potenciada con Inteligencia Artificial, desarrollada en React Native con Expo y TypeScript.

## 🚀 Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/Edwarmo/Byte-callers.git
cd Byte-callers

# Instalar dependencias
npm install

# Iniciar aplicación
npm start
```

Abre http://localhost:8081 en tu navegador.

## ✨ Características Principales

### 🏠 Landing Page Empresarial
- **Home**: Hero con CTA, estadísticas y beneficios clave
- **Soluciones IA**: Chatbots, Voicebots, Asistentes y Análisis de Sentimiento
- **Casos de Éxito**: Empresas reales con resultados medibles
- **Tecnología IA**: Demos interactivos de capacidades
- **Testimonios**: Clientes satisfechos con la plataforma
- **Contacto**: Formulario para solicitar demos

### 🎨 Diseño Moderno
- **Modo Oscuro**: Detección automática del tema del sistema
- **Glassmorphism**: Efectos de vidrio transparente en menús
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Menú Hamburguesa**: Sidebar animado con toggle en móvil (60% pantalla)
- **Emojis**: Iconografía visual en toda la navegación

### 🔐 Sistema de Autenticación
- Login para agentes con validación
- Dashboard de agente con métricas en tiempo real
- Gestión de sesiones y roles

### 📊 Datos Centralizados
- Información en archivos JSON separados (`src/infoPageJson/`)
- Fácil actualización de contenido sin tocar código
- Estructura escalable y mantenible

## 🛠️ Stack Tecnológico

- **Frontend**: React Native + Expo
- **Lenguaje**: TypeScript
- **Estilos**: StyleSheet con soporte de modo oscuro
- **Estado**: React Hooks (useState, useColorScheme)
- **Componentes**: Arquitectura modular reutilizable
- **Datos**: JSON estáticos para contenido

## 💻 Comandos Disponibles

```bash
npm start          # Iniciar desarrollo (web)
npm run android    # Ejecutar en Android
npm run ios        # Ejecutar en iOS
```

## 🏗️ Estructura del Proyecto (Arquitectura Hexagonal)

```
src/
├── core/
│   ├── domain/              # Capa de dominio
│   │   ├── entities/        # Entidades de negocio
│   │   ├── ports/           # Interfaces (repositories, services)
│   │   ├── types/           # Tipos de dominio
│   │   └── value-objects/   # Objetos de valor
│   └── application/
│       ├── usecases/        # Casos de uso
│       └── dto/             # Data Transfer Objects
├── infrastructure/
│   ├── adapters/
│   │   ├── repositories/    # Implementaciones de repositorios
│   │   ├── services/        # Servicios externos
│   │   ├── controllers/     # Controladores
│   │   └── models/          # Modelos de datos
│   └── ui/
│       ├── pages/           # Páginas (public, auth, app)
│       ├── components/      # Componentes UI
│       │   ├── landing/     # Landing page
│       │   ├── features/    # Features específicos
│       │   ├── shared/      # Compartidos
│       │   └── forms/       # Formularios
│       ├── hooks/           # Custom hooks
│       └── styles/          # Estilos globales
└── shared/
    ├── config/              # Configuración
    ├── utils/               # Utilidades
    └── constants/           # Constantes
```

## 🎯 Navegación

### Secciones Públicas
- 🏠 **Inicio**: Hero, stats y beneficios principales
- 🤖 **Soluciones IA**: Automatización, asistentes, análisis
- 🏢 **Empresas**: Casos de éxito con métricas reales
- 🚀 **Tecnología**: Demos de voicebots, chatbots, IA
- ⭐ **Testimonios**: Clientes satisfechos
- 📞 **Contacto**: Formulario de solicitud de demo

### Sistema Interno
- 🔐 **Login**: Acceso para agentes
- 📊 **Dashboard**: Panel con métricas del agente

## 🌙 Modo Oscuro

El sistema detecta automáticamente el tema del dispositivo y aplica:
- Fondos: `#0f172a` / `#1e293b`
- Textos: `#e2e8f0` / `#94a3b8`
- Cards: Fondo oscuro con transparencias
- Menú: Glassmorphism con blur

## 📱 Responsive Design

### Desktop (>768px)
- Menú horizontal con emojis
- Layout de múltiples columnas
- Hover effects

### Mobile (<768px)
- Menú hamburguesa con animación toggle (X)
- Sidebar lateral 60% de pantalla
- Overlay oscuro semitransparente
- Layout vertical optimizado

## 🎨 Paleta de Colores

### Modo Claro
- Principal: `#3498db` (Azul)
- Fondo: `#f8fafc` (Gris claro)
- Texto: `#0f172a` (Azul oscuro)
- Secundario: `#64748b` (Gris)

### Modo Oscuro
- Principal: `#60a5fa` (Azul claro)
- Fondo: `#0f172a` (Azul muy oscuro)
- Texto: `#e2e8f0` (Gris claro)
- Secundario: `#94a3b8` (Gris medio)

## 📊 Métricas Destacadas

- **80%** de consultas automatizadas
- **40%** reducción de costos operacionales
- **24/7** disponibilidad ininterrumpida
- **65%** reducción en tiempo de respuesta (caso real)

## 🔧 Personalización

### Actualizar Contenido
Edita los archivos JSON en `src/infoPageJson/`:
- `solutions.json` - Soluciones de IA
- `enterprise.json` - Casos de éxito
- `aiShowcase.json` - Demos de tecnología
- `testimonials.json` - Testimonios de clientes

### Agregar Nuevas Secciones
1. Crear componente en `src/clientPortal/components/`
2. Agregar tipo en `Navigation.tsx`
3. Registrar en `LandingPage.tsx`
4. Actualizar menú con emoji

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ByteCallers 2025

## 👥 Contacto

- **Email**: info@bytecallers.com
- **GitHub**: [Edwarmo/Byte-callers](https://github.com/Edwarmo/Byte-callers)

---

Desarrollado con ❤️ usando React Native + IA
