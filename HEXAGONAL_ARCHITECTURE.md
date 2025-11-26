# 🏗️ Arquitectura Hexagonal - ByteCallers

## 📐 Estructura Propuesta

```
src/
├── core/                           # NÚCLEO (Domain + Application)
│   ├── domain/                     # Capa de Dominio
│   │   ├── entities/              # Entidades de negocio
│   │   │   ├── User.ts
│   │   │   ├── Call.ts
│   │   │   ├── Ticket.ts
│   │   │   └── TicketFactory.ts
│   │   ├── value-objects/         # Objetos de valor
│   │   │   ├── PhoneNumber.ts
│   │   │   └── CallStatus.ts
│   │   └── ports/                 # Interfaces (Puertos)
│   │       ├── repositories/
│   │       │   ├── IUserRepository.ts
│   │       │   ├── ICallRepository.ts
│   │       │   └── ITicketRepository.ts
│   │       └── services/
│   │           ├── IAuthService.ts
│   │           └── INotificationService.ts
│   │
│   └── application/               # Capa de Aplicación
│       ├── usecases/              # Casos de uso
│       │   ├── auth/
│       │   │   ├── LoginUseCase.ts
│       │   │   └── LogoutUseCase.ts
│       │   ├── calls/
│       │   │   ├── InterveneCallUseCase.ts
│       │   │   ├── UpdateContextUseCase.ts
│       │   │   └── TakeCaseUseCase.ts
│       │   └── tickets/
│       │       ├── CreateTicketUseCase.ts
│       │       └── ListTicketsUseCase.ts
│       └── dto/                   # Data Transfer Objects
│           ├── LoginDTO.ts
│           └── CallDTO.ts
│
├── infrastructure/                # INFRAESTRUCTURA (Adaptadores)
│   ├── adapters/
│   │   ├── repositories/         # Implementaciones de repositorios
│   │   │   ├── InMemoryUserRepository.ts
│   │   │   ├── LocalStorageUserRepository.ts
│   │   │   └── ApiCallRepository.ts
│   │   ├── services/             # Implementaciones de servicios
│   │   │   ├── MockAuthService.ts
│   │   │   ├── AIAssistantService.ts
│   │   │   └── APIButtonController.ts
│   │   └── api/                  # Clientes HTTP
│   │       └── ApiClient.ts
│   │
│   └── ui/                       # PRESENTACIÓN (Adaptadores UI)
│       ├── pages/                # Páginas
│       │   ├── public/          # Sitio web público
│       │   │   └── LandingPage.tsx
│       │   ├── auth/            # Autenticación
│       │   │   └── LoginPage.tsx
│       │   └── app/             # Aplicación interna
│       │       ├── CallCenterPage.tsx
│       │       └── TicketsPage.tsx
│       ├── components/           # Componentes UI
│       │   ├── shared/          # Compartidos
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   └── Modal.tsx
│       │   ├── landing/         # Landing page
│       │   │   ├── Home.tsx
│       │   │   ├── Solutions.tsx
│       │   │   ├── Enterprise.tsx
│       │   │   ├── AIShowcase.tsx
│       │   │   ├── Testimonials.tsx
│       │   │   ├── ContactForm.tsx
│       │   │   ├── Navigation.tsx
│       │   │   └── Footer.tsx
│       │   ├── features/        # Funcionalidades app
│       │   │   ├── AIAssistant.tsx
│       │   │   ├── SessionWarningModal.tsx
│       │   │   ├── SatisfactionChart.tsx
│       │   │   ├── ServicesChart.tsx
│       │   │   └── PerformanceChart.tsx
│       │   └── forms/           # Formularios
│       │       └── LoginForm.tsx
│       └── hooks/                # Custom Hooks
│           ├── useAuth.ts
│           ├── useChatbot.ts
│           └── useButtonsForVSR.ts
│
└── shared/                       # COMPARTIDO
    ├── config/
    │   └── index.ts
    ├── constants/
    │   └── constants.ts
    ├── utils/
    │   ├── validation.ts
    │   ├── security.ts
    │   └── storage.ts
    ├── lib/                      # Librerías compartidas
    │   ├── validation.ts
    │   ├── security.ts
    │   └── storage.ts
    └── data/                     # Datos estáticos
        └── landing/              # Contenido landing page
            ├── solutions.json
            ├── enterprise.json
            ├── aiShowcase.json
            ├── testimonials.json
            └── content.json
```

## 🎯 Capas de la Arquitectura Hexagonal

### 1. **CORE (Núcleo)**
- **Domain**: Lógica de negocio pura, sin dependencias externas
- **Application**: Casos de uso que orquestan la lógica de dominio

### 2. **Infrastructure (Infraestructura)**
- **Adapters**: Implementaciones concretas de los puertos
- **UI**: Componentes de presentación

### 3. **Shared (Compartido)**
- Utilidades y configuraciones transversales

## 📝 Ejemplo de Implementación

### Domain Entity
```typescript
// src/core/domain/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly phoneNumber: string,
    public readonly role: 'agent' | 'supervisor',
    private _isBlocked: boolean,
    private _failedAttempts: number
  ) {}

  canLogin(): boolean {
    return !this._isBlocked && this._failedAttempts < 3;
  }

  incrementFailedAttempts(): void {
    this._failedAttempts++;
    if (this._failedAttempts >= 3) {
      this._isBlocked = true;
    }
  }
}
```

### Port (Interface)
```typescript
// src/core/domain/ports/repositories/IUserRepository.ts
import { User } from '../../entities/User';

export interface IUserRepository {
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
```

### Use Case
```typescript
// src/core/application/usecases/auth/LoginUseCase.ts
import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { IAuthService } from '../../../domain/ports/services/IAuthService';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(phoneNumber: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (!user || !user.canLogin()) {
      throw new Error('Invalid credentials or blocked user');
    }

    const isValid = await this.authService.validateCredentials(phoneNumber, password);
    
    if (!isValid) {
      user.incrementFailedAttempts();
      await this.userRepository.update(user);
      throw new Error('Invalid credentials');
    }

    user.resetFailedAttempts();
    await this.userRepository.update(user);
    
    const token = await this.authService.generateToken(user);
    return { user, token };
  }
}
```

### Adapter (Implementation)
```typescript
// src/infrastructure/adapters/repositories/InMemoryUserRepository.ts
import { IUserRepository } from '../../../core/domain/ports/repositories/IUserRepository';
import { User } from '../../../core/domain/entities/User';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.users.get(phoneNumber) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.phoneNumber, user);
  }

  async update(user: User): Promise<void> {
    this.users.set(user.phoneNumber, user);
  }
}
```

### UI Component (Adapter)
```typescript
// src/infrastructure/ui/pages/LoginPage.tsx
import { LoginUseCase } from '../../../core/application/usecases/auth/LoginUseCase';

export const LoginPage: React.FC = () => {
  const loginUseCase = new LoginUseCase(userRepository, authService);

  const handleLogin = async (phoneNumber: string, password: string) => {
    try {
      const { user, token } = await loginUseCase.execute(phoneNumber, password);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    // UI implementation
  );
};
```

## 🔄 Flujo de Datos

```
UI (LoginPage) 
  → Use Case (LoginUseCase)
    → Domain Entity (User)
    → Port (IUserRepository)
      → Adapter (InMemoryUserRepository)
        → External System (Database/API)
```

## ✅ Beneficios

1. **Independencia de frameworks**: El core no depende de React, Expo, etc.
2. **Testeable**: Fácil de testear con mocks
3. **Mantenible**: Cambios en UI no afectan lógica de negocio
4. **Escalable**: Fácil agregar nuevos adaptadores
5. **Flexible**: Cambiar implementaciones sin tocar el core

## 🚀 Pasos para Migrar

1. Crear estructura de carpetas
2. Mover entidades a `core/domain/entities/`
3. Crear interfaces (puertos) en `core/domain/ports/`
4. Crear casos de uso en `core/application/usecases/`
5. Implementar adaptadores en `infrastructure/adapters/`
6. Mover UI a `infrastructure/ui/`
7. Configurar inyección de dependencias

## 📦 Dependency Injection

```typescript
// src/infrastructure/di/container.ts
import { LoginUseCase } from '../../core/application/usecases/auth/LoginUseCase';
import { InMemoryUserRepository } from '../adapters/repositories/InMemoryUserRepository';
import { MockAuthService } from '../adapters/services/MockAuthService';

export class DIContainer {
  private static userRepository = new InMemoryUserRepository();
  private static authService = new MockAuthService();

  static getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.userRepository, this.authService);
  }
}
```

## 🌐 Sitio Web (Landing Page)

El sitio web público también sigue la arquitectura hexagonal:

### Estructura Landing Page
```
infrastructure/ui/
├── pages/public/
│   └── LandingPage.tsx          # Página principal
├── components/landing/
│   ├── Home.tsx                 # Hero section
│   ├── Solutions.tsx            # Soluciones IA
│   ├── Enterprise.tsx           # Casos de éxito
│   ├── AIShowcase.tsx           # Demos tecnología
│   ├── Testimonials.tsx         # Testimonios
│   ├── ContactForm.tsx          # Formulario contacto
│   ├── Navigation.tsx           # Menú navegación
│   └── Footer.tsx               # Pie de página
└── shared/data/landing/
    ├── solutions.json           # Datos soluciones
    ├── enterprise.json          # Datos empresas
    ├── aiShowcase.json          # Datos demos
    └── testimonials.json        # Datos testimonios
```

### Casos de Uso para Landing
```typescript
// src/core/application/usecases/contact/SendContactFormUseCase.ts
export class SendContactFormUseCase {
  constructor(private emailService: IEmailService) {}

  async execute(data: ContactFormDTO): Promise<void> {
    // Validar datos
    // Enviar email
    // Guardar en base de datos
  }
}
```

### Separación de Contextos
- **Público**: Landing page (marketing)
- **Autenticación**: Login/Registro
- **Aplicación**: Dashboard, Tickets, Llamadas

## 🎯 Resultado Final

Tu proyecto tendrá:
- ✅ Lógica de negocio aislada y testeable
- ✅ Adaptadores intercambiables
- ✅ UI desacoplada del core
- ✅ Sitio web y app en la misma arquitectura
- ✅ Fácil mantenimiento y escalabilidad
- ✅ Preparado para crecimiento futuro
