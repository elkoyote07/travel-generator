# Configuración de Variables de Entorno - Travel Generator

## 📁 Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# ========================================
# MODO DE FUNCIONAMIENTO PRINCIPAL
# ========================================
# Opciones: mock, scraper, apis, hybrid
# - mock: Genera precios simulados (por defecto)
# - scraper: Usa el scraper original de Skyscanner
# - apis: Usa APIs gratuitas
# - hybrid: Intenta APIs, luego scraper, finalmente mock
FLIGHT_MODE=mock

# ========================================
# CONFIGURACIÓN DE LOGGING
# ========================================
# Habilitar/deshabilitar logs (true/false)
LOGGING_ENABLED=true

# Nivel de logs (info, debug, warn, error)
LOG_LEVEL=info

# Mostrar URLs en los logs (true/false)
LOG_SHOW_URLS=true

# Mostrar precios en los logs (true/false)
LOG_SHOW_PRICES=true

# ========================================
# CONFIGURACIÓN DE MOCK
# ========================================
# Habilitar modo mock (true/false)
MOCK_ENABLED=true

# Delay simulado en milisegundos
MOCK_DELAY=1000

# ========================================
# CONFIGURACIÓN DE SCRAPING
# ========================================
# Habilitar modo scraper (true/false)
SCRAPING_ENABLED=true

# Timeout para scraping en milisegundos
SCRAPING_TIMEOUT=10000

# Número de reintentos para scraping
SCRAPING_RETRIES=3

# ========================================
# CONFIGURACIÓN DE APIS
# ========================================

# AVIATION STACK API
# Habilitar Aviation Stack (true/false)
AVIATION_STACK_ENABLED=false
# API Key de Aviation Stack (gratuita - 100 requests/mes)
AVIATION_STACK_API_KEY=tu_api_key_aqui

# AMADEUS API
# Habilitar Amadeus (true/false)
AMADEUS_ENABLED=false
# Client ID de Amadeus (gratuito - 1000 requests/mes)
AMADEUS_CLIENT_ID=tu_client_id_aqui
# Client Secret de Amadeus
AMADEUS_CLIENT_SECRET=tu_client_secret_aqui

# KIWI API
# Habilitar Kiwi (true/false)
KIWI_ENABLED=false
# API Key de Kiwi (gratuita - 1000 requests/mes)
KIWI_API_KEY=tu_api_key_aqui
```

## 🎯 Ejemplos de Configuración

### 1. Solo Mock (Recomendado para desarrollo)
```env
FLIGHT_MODE=mock
LOGGING_ENABLED=true
LOG_SHOW_PRICES=true
```

### 2. Solo Scraper (Skyscanner original)
```env
FLIGHT_MODE=scraper
LOGGING_ENABLED=true
SCRAPING_ENABLED=true
```

### 3. Solo APIs (APIs gratuitas)
```env
FLIGHT_MODE=apis
LOGGING_ENABLED=true
AVIATION_STACK_ENABLED=true
AVIATION_STACK_API_KEY=tu_key_aqui
AMADEUS_ENABLED=true
AMADEUS_CLIENT_ID=tu_id_aqui
AMADEUS_CLIENT_SECRET=tu_secret_aqui
```

### 4. Modo Híbrido (Recomendado para producción)
```env
FLIGHT_MODE=hybrid
LOGGING_ENABLED=true
AVIATION_STACK_ENABLED=true
AVIATION_STACK_API_KEY=tu_key_aqui
SCRAPING_ENABLED=true
MOCK_ENABLED=true
```

## 🔧 Cómo Obtener las API Keys

### Aviation Stack API
1. Ve a https://aviationstack.com/
2. Haz clic en "Get Free API Key"
3. Completa el registro gratuito
4. Copia tu API key

### Amadeus API
1. Ve a https://developers.amadeus.com/
2. Crea una cuenta gratuita
3. Crea una nueva aplicación
4. Copia tu Client ID y Client Secret

### Kiwi API
1. Ve a https://tequila.kiwi.com/
2. Regístrate gratuitamente
3. Crea una nueva aplicación
4. Copia tu API key

## 🚀 Después de Configurar

1. **Guarda el archivo** `.env.local`
2. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```
3. **Verifica la configuración** en los logs del terminal

## 📊 Información en los Logs

El sistema mostrará en el terminal:
- ✅ Modo de funcionamiento actual
- 🔌 APIs configuradas y habilitadas
- 🕷️ Estado del scraper
- 🎲 Estado del mock
- 📝 Configuración de logging
- 💰 Información de precios obtenidos
- ✈️ Aerolíneas encontradas
- 🔍 Fuentes de datos utilizadas

## 🚨 Notas Importantes

- **Sin configuración**: El sistema usa `mock` por defecto
- **APIs gratuitas**: Tienen límites mensuales
- **Fallback automático**: Si algo falla, usa mock
- **Logs detallados**: Siempre puedes ver qué está pasando
- **Enlaces directos**: Siempre funcionan para búsquedas manuales 