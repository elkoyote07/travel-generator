# Configuración de APIs Gratuitas para Travel Generator

## 🚀 APIs Disponibles

### 1. Aviation Stack API
- **URL**: https://aviationstack.com/
- **Plan Gratuito**: 100 requests/mes
- **Registro**: Gratuito
- **Uso**: Información de vuelos en tiempo real

**Pasos para obtener API Key:**
1. Ve a https://aviationstack.com/
2. Haz clic en "Get Free API Key"
3. Completa el formulario de registro
4. Copia tu API key

### 2. Amadeus API
- **URL**: https://developers.amadeus.com/
- **Plan Gratuito**: 1000 requests/mes
- **Registro**: Gratuito
- **Uso**: Búsqueda de ofertas de vuelos

**Pasos para obtener API Keys:**
1. Ve a https://developers.amadeus.com/
2. Crea una cuenta gratuita
3. Crea una nueva aplicación
4. Copia tu Client ID y Client Secret

### 3. Kiwi.com API (Tequila)
- **URL**: https://tequila.kiwi.com/
- **Plan Gratuito**: 1000 requests/mes
- **Registro**: Gratuito
- **Uso**: Búsqueda de vuelos baratos

**Pasos para obtener API Key:**
1. Ve a https://tequila.kiwi.com/
2. Regístrate gratuitamente
3. Crea una nueva aplicación
4. Copia tu API key

## ⚙️ Configuración

### 1. Crear archivo .env.local
Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# APIs Gratuitas para Información de Vuelos

# Aviation Stack API (Gratuita - 100 requests/mes)
AVIATION_STACK_API_KEY=tu_api_key_aqui

# Amadeus API (Gratuita - 1000 requests/mes)
AMADEUS_CLIENT_ID=tu_client_id_aqui
AMADEUS_CLIENT_SECRET=tu_client_secret_aqui

# Kiwi.com API (Gratuita - 1000 requests/mes)
KIWI_API_KEY=tu_api_key_aqui
```

### 2. Reiniciar el servidor
Después de añadir las variables de entorno, reinicia el servidor:

```bash
npm run dev
```

## 🔄 Fallback Automático

Si no configuras las APIs o se agotan las cuotas gratuitas, el sistema automáticamente:

1. **Genera precios simulados** basados en destinos reales
2. **Proporciona enlaces directos** a Google Flights, Kayak y Momondo
3. **Mantiene la funcionalidad completa** del generador de viajes

## 📊 Límites de las APIs Gratuitas

| API | Requests/Mes | Uso Recomendado |
|-----|-------------|-----------------|
| Aviation Stack | 100 | Desarrollo y pruebas |
| Amadeus | 1000 | Uso moderado |
| Kiwi | 1000 | Uso moderado |

## 🎯 Ventajas de Usar APIs Reales

1. **Precios reales** cuando las APIs están disponibles
2. **Información de aerolíneas** actualizada
3. **Datos de disponibilidad** en tiempo real
4. **Fallback inteligente** cuando las APIs no están disponibles

## 🚨 Notas Importantes

- Las APIs gratuitas tienen límites de uso
- Los precios simulados son realistas pero no reales
- Los enlaces a Google Flights, Kayak y Momondo siempre funcionan
- El sistema es completamente funcional sin APIs configuradas

## 🔧 Solución de Problemas

### Error: "API key not found"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que las variables están correctamente nombradas
- Reinicia el servidor después de añadir las variables

### Error: "Rate limit exceeded"
- Las APIs gratuitas tienen límites mensuales
- El sistema usará precios simulados automáticamente
- Considera actualizar a un plan de pago si necesitas más requests

### Los precios no se actualizan
- Verifica que las API keys son válidas
- Comprueba los logs en el terminal para ver qué APIs están funcionando
- El sistema mostrará en los logs qué fuentes de datos está utilizando 