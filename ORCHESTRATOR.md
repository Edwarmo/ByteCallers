# 🎭 Arquitectura del Sistema - ByteCallers

## 📋 Descripción General

ByteCallers es una plataforma de call center con IA que utiliza una arquitectura modular y escalable, separando claramente el portal público del sistema interno.

## 🏗️ Arquitectura de Componentes

### 1. **Portal Público (Landing Page)**

#### Estructura de Navegación
```typescript
type Section = 'home' | 'solutions' | 'enterprise' | 'ai-tech' | 'testimonials' | 'contact';
```

#### Componentes Principales
- **Home**: Hero, estadísticas, beneficios y testimonios
- **Solutions**: Soluciones de IA (Chatbots, Voicebots, Asistentes, Análisis)
- **Enterprise**: Casos de éxito empresariales con métricas
- **AIShowcase**: Demos interactivos de tecnología IA
- **Testimonials**: Testimonios de clientes
- **ContactForm**: Formulario de solicitud de demo
- **Navigation**: Header responsive con menú hamburguesa
- **Footer**: Información corporativa y enlaces

#### Sistema de Datos
```
src/infoPageJson/
├── solutions.json      # 4 soluciones de IA
├── enterprise.json     # 3 casos de éxito
├── aiShowcase.json     # 4 demos de tecnología
└── testimonials.json   # 4 testimonios
```

### 2. **Sistema Interno (Dashboard)**

#### Páginas
- **LoginPage**: Autenticación de agentes
- **CallCenterPage**: Dashboard con métricas del agente

#### Componentes Compartidos
```
src/shared/ui/
├── Card.tsx           # Card con modo oscuro
├── Button.tsx         # Botones reutilizables
├── Input.tsx          # Inputs de formulario
├── Modal.tsx          # Modales
├── Layout.tsx         # Layout base
└── Loader.tsx         # Indicador de carga
```

## 🎨 Sistema de Diseño

### Modo Oscuro Automático
```typescript
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';
```

#### Paleta de Colores

**Modo Claro:**
- Principal: `#3498db`
- Fondo: `#f8fafc`
- Texto: `#0f172a`
- Secundario: `#64748b`

**Modo Oscuro:**
- Principal: `#60a5fa`
- Fondo: `#0f172a`
- Cards: `#1e293b`
- Texto: `#e2e8f0`
- Secundario: `#94a3b8`

### Responsive Design

#### Desktop (>768px)
- Menú horizontal con emojis
- Layout multi-columna
- Hover effects

#### Mobile (<768px)
- Menú hamburguesa animado (toggle X)
- Sidebar lateral 60% pantalla
- Overlay semitransparente
- Layout vertical

## 🔄 Flujo de Navegación

### Portal Público
```
App.tsx
  └── LandingPage
      ├── Navigation (Header)
      ├── Home | Solutions | Enterprise | AIShowcase | Testimonials | Contact
      └── Footer
```

### Sistema Interno
```
App.tsx
  ├── LoginPage → Autenticación
  └── CallCenterPage → Dashboard
```

## 📊 Gestión de Estado

### Estado Local (useState)
- Sección actual en navegación
- Menú hamburguesa abierto/cerrado
- Formularios y inputs
- Tabs activos en carruseles

### Detección de Sistema (useColorScheme)
- Modo oscuro automático
- Adaptación de colores en tiempo real

## 🎯 Componentes Reutilizables

### Card Component
```typescript
<Card style={customStyles} padding={20}>
  {children}
</Card>
```
- Soporte modo oscuro automático
- Padding y margin configurables
- Elevación y sombras

### Navigation Component
```typescript
<Navigation 
  onNavigate={handleNavigate}
  onSectionChange={setSection}
  currentSection={section}
/>
```
- Responsive automático
- Menú hamburguesa en móvil
- Indicador de sección activa

## 🚀 Escalabilidad

### Agregar Nueva Sección

1. **Crear componente:**
```typescript
// src/clientPortal/components/NewSection.tsx
const NewSection: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Contenido */}
    </View>
  );
};
```

2. **Actualizar tipos:**
```typescript
type Section = 'home' | 'solutions' | ... | 'newSection';
```

3. **Registrar en Navigation:**
```typescript
{ id: 'newSection', label: 'Nueva Sección', emoji: '🆕' }
```

4. **Agregar a LandingPage:**
```typescript
case 'newSection': return <NewSection />;
```

### Agregar Datos JSON

1. Crear archivo en `src/infoPageJson/newData.json`
2. Importar en componente: `import data from '../../infoPageJson/newData.json'`
3. Usar datos: `data.map(item => ...)`

## 🔐 Seguridad

### Validaciones
- Validación de teléfono y contraseña
- Sanitización de inputs
- Protección contra XSS

### Autenticación
- Login con credenciales
- Gestión de sesión
- Roles de usuario (agent, supervisor, admin)

## 📈 Métricas y Analytics

### Datos Destacados
- 80% consultas automatizadas
- 40% reducción de costos
- 24/7 disponibilidad
- 65% reducción tiempo de respuesta

### Casos de Éxito
- BancoDigital: 85% automatización
- TelecomPlus: 40% mejora satisfacción
- EcommerceMax: 90% resolución por chatbot

## 🛠️ Mantenimiento

### Actualizar Contenido
- Editar archivos JSON en `src/infoPageJson/`
- No requiere cambios en código
- Cambios reflejados automáticamente

### Agregar Estilos Modo Oscuro
```typescript
const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fafc' },
  containerDark: { backgroundColor: '#0f172a' },
  text: { color: '#0f172a' },
  textDark: { color: '#e2e8f0' },
});
```

## 🎭 Patrones de Diseño

### Composición de Componentes
- Componentes pequeños y reutilizables
- Props bien definidas con TypeScript
- Memo para optimización

### Separación de Responsabilidades
- Componentes de presentación
- Lógica de negocio separada
- Datos en JSON externos

### Responsive First
- Mobile-first approach
- Breakpoints claros (768px)
- Adaptación automática

## 📦 Estructura de Archivos

```
src/
├── clientPortal/          # Portal público
│   ├── components/        # Componentes de landing
│   └── views/            # Vista principal
├── pages/                # Páginas del sistema
├── shared/               # Componentes compartidos
│   └── ui/              # UI components
├── business/            # Lógica de negocio
│   ├── controllers/     # Controladores
│   ├── models/         # Modelos de datos
│   └── entities/       # Entidades
├── infoPageJson/        # Datos en JSON
├── types/              # Tipos TypeScript
└── utils/              # Utilidades
```

## 🔮 Roadmap Futuro

### Módulos Sugeridos
- 📈 **Reportes**: Analytics avanzados
- 👥 **Equipo**: Gestión de agentes
- ⚙️ **Configuración**: Settings del sistema
- 💬 **Chat Interno**: Comunicación entre agentes
- 🔔 **Notificaciones**: Centro de alertas
- 📊 **Dashboard BI**: Business Intelligence

### Mejoras Técnicas
- Server-side rendering (SSR)
- Progressive Web App (PWA)
- Internacionalización (i18n)
- Tests automatizados
- CI/CD pipeline

---

**ByteCallers** - Arquitectura modular, escalable y mantenible para call centers.
