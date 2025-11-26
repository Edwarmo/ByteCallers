# Sistema de Login - ByteCallers

## 🔐 Funcionamiento del Login

### Proceso de Autenticación

1. **Simulación de Fetch a Base de Datos**
   - El sistema simula una consulta a la base de datos (delay de 500ms)
   - Muestra indicador de carga durante la consulta

2. **Comportamiento por Usuario**
   - **Usuario Existente**: Valida credenciales normalmente
   - **Usuario Nuevo**: Si no existe, lo crea automáticamente y permite el ingreso
   - **Usuario Bloqueado**: Aplica política de bloqueo por intentos fallidos

### Validaciones Requeridas

- **Número de Teléfono**: Formato internacional válido
- **Contraseña**: Mínimo 8 caracteres con:
  - 1 letra mayúscula
  - 1 letra minúscula  
  - 1 número
  - 1 símbolo especial

### Ejemplos de Uso

#### Usuario Nuevo (Cualquier teléfono válido)
```
Teléfono: +1234567890
Contraseña: MiPass123!
Resultado: ✅ Usuario creado automáticamente
```

#### Usuario Existente
```
Teléfono: (mismo que usaste antes)
Contraseña: (misma contraseña)
Resultado: ✅ Login exitoso
```

#### Contraseña Incorrecta
```
Teléfono: (usuario existente)
Contraseña: (contraseña incorrecta)
Resultado: ❌ Credenciales incorrectas
```

### Características de Seguridad

- **Bloqueo Automático**: 3 intentos fallidos = 15 minutos bloqueado
- **Almacenamiento Seguro**: Contraseñas en SecureStore/localStorage
- **Tokens JWT**: Sesiones seguras con expiración
- **Validación en Tiempo Real**: Retroalimentación inmediata

### Roles de Usuario

- **Agent**: Rol por defecto para usuarios nuevos
- **Supervisor**: Acceso ampliado (configuración manual)
- **Admin**: Acceso completo (configuración manual)

## 🚀 Para Probar

1. Ingresa cualquier número de teléfono válido
2. Usa una contraseña que cumpla los requisitos
3. Si es la primera vez, se creará automáticamente
4. Si ya existe, validará las credenciales

**Nota**: El sistema simula una base de datos real pero funciona localmente para desarrollo.